import {
  EventBookingCardModel,
  LogModel,
  SpecialEventModel,
  UserModel,
} from "@/models/index";
import {
  DataException,
  InputException,
  RuleException,
  classError,
} from "@/utils/error_message";
import {
  createMeeting,
  deleteMeeting,
  editMeeting,
  meetingOptions,
} from "@/utils/zoom";
import crypto from "crypto";
import { DateTime } from "luxon";
import { ObjectId } from "mongodb";
import { HydratedDocument, Types } from "mongoose";
import { RRule } from "rrule";
import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import validator from "validator";
import { EventBookingCard, EventBookingStatusValue } from "./eventBookingCard";
import { updateRegistrationStatus } from "./eventBookingCard.resolver";
import { CategoryValue, SubCategoryValue } from "./log";
import {
  filterEvents,
  generateRecurrenceId,
  ruleUpdate,
  sendRescheduleEmail,
  sendRescheduleNotification,
  validateDeletion,
} from "./regularClass.resolver";
import { SpecialEvent, SpecialEventInput } from "./specialEvent";
import { User } from "./user";

const MAXIMUM_CLASS_LIMIT = 25 as const;

async function eventDeletionLog(
  event: HydratedDocument<SpecialEvent>,
  updatedBy: Types.ObjectId
) {
  const updater = await UserModel.findById(updatedBy);

  const affectedBooking: Array<string> = [];

  const onlineBookedLength = event.online.booked.length;
  const offlineBookedLength = event.offline.booked.length;

  await Promise.all([
    ...event.online.booked.map(async (booking: Partial<EventBookingCard>) => {
      const bookingUser: HydratedDocument<EventBookingCard, { user: User }> =
        await EventBookingCardModel.findById(booking._id).populate({
          path: "user",
          select: "name",
        });

      affectedBooking.push(
        `[${bookingUser.bookingCode}_${bookingUser.user.name} - online]`
      );
    }),

    ...event.offline.booked.map(async (booking: Partial<EventBookingCard>) => {
      const bookingUser: HydratedDocument<EventBookingCard, { user: User }> =
        await EventBookingCardModel.findById(booking._id).populate({
          path: "user",
          select: "name",
        });

      affectedBooking.push(
        `[${bookingUser.bookingCode}_${bookingUser.user.name} - offline]`
      );
    }),
  ]);

  const joinedAffectedBooking = affectedBooking.join(", ");

  return new LogModel({
    user: updatedBy,
    category: CategoryValue.CLASS,
    subCategory: SubCategoryValue.DELETED,
    message: `${
      event.details.title
    } originally scheduled on ${DateTime.fromJSDate(
      event.schedule.date
    ).toFormat("dd LLL yyyy")} was deleted by ${updater.name}. 
    ${onlineBookedLength + offlineBookedLength} registration(s) were affected: 
    ${joinedAffectedBooking}`,
  });
}

async function rejectAllEventRegistration(
  event: HydratedDocument<SpecialEvent>,
  updatedBy: Types.ObjectId
) {
  const onlineBookingLength = event.online.booked.length;
  const offlineBookingLength = event.offline.booked.length;

  for (let i = 0; i < onlineBookingLength; i++) {
    await updateRegistrationStatus(event.online.booked[i]._id, {
      updatedBy,
      value: EventBookingStatusValue.REJECTED,
    });
  }

  for (let i = 0; i < offlineBookingLength; i++) {
    await updateRegistrationStatus(event.offline.booked[i]._id, {
      updatedBy,
      value: EventBookingStatusValue.REJECTED,
    });
  }
}

function validateUserInput(event: SpecialEventInput) {
  if (!event.details.title) throw new InputException(classError.NO_TITLE);

  if (
    !validator.isAlphanumeric(event.details.title, "en-US", {
      ignore: " ",
    })
  )
    throw new InputException(classError.TITLE_MUST_BE_ALPHANUMERIC);

  if (event.instructors.length === 0)
    throw new InputException(classError.NO_INSTRUCTOR);
  if (event.online.capacity === 0 && event.offline.capacity === 0)
    throw new InputException(classError.OFFLINE_ONLINE_ZERO_CAPACITY);
  if (!event.schedule.rString)
    throw new InputException(classError.INVALID_RECURRENCE);
}

@Resolver(SpecialEvent)
export class SpecialEventResolver {
  @Authorized(["ADMIN"])
  @Query(() => [SpecialEvent])
  async specialEvents() {
    try {
      const res = await SpecialEventModel.find()
        .populate("online.booked")
        .populate("online.confirmed")
        .populate("online.rejected")
        .populate("offline.booked")
        .populate("offline.confirmed")
        .populate("offline.rejected")
        .sort({ "schedule.date": "desc" });

      return res;
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Query(() => [SpecialEvent])
  async specialEventsPerMonth(@Arg("viewedDate") viewedDate: Date) {
    try {
      const firstDate = DateTime.fromJSDate(viewedDate)
        .setZone("UTC+7")
        .startOf("month")
        .toJSDate();
      const lastDate = DateTime.fromJSDate(viewedDate)
        .setZone("UTC+7")
        .endOf("month")
        .toJSDate();

      return await SpecialEventModel.find({
        "schedule.date": {
          $gt: firstDate,
          $lte: lastDate,
        },
      })
        .populate("online.booked")
        .populate("online.confirmed")
        .populate("online.rejected")
        .populate("offline.booked")
        .populate("offline.confirmed")
        .populate("offline.rejected")
        .sort({ "schedule.date": "desc" });
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Query(() => SpecialEvent)
  async specialEvent(@Arg("_id") _id: ObjectId) {
    return await SpecialEventModel.findById(_id)
      .populate("online.booked")
      .populate("online.confirmed")
      .populate("online.rejected")
      .populate("offline.booked")
      .populate("offline.confirmed")
      .populate("offline.rejected");
  }

  @Authorized(["ADMIN"])
  @Mutation(() => SpecialEvent)
  async addZoomMeetingSpecialEvent(@Arg("_id") _id: ObjectId) {
    try {
      const doc = await SpecialEventModel.findById(_id);

      const password = crypto.randomBytes(2).toString("hex");

      const zoomMeeting = await createMeeting(
        meetingOptions({
          topic: doc.details.title,
          start_time: doc.schedule.date,
          duration: doc.schedule.duration,
          password,
        })
      );

      if (zoomMeeting?.data?.id) {
        doc.zoom.meetingId = zoomMeeting?.data?.id?.toString();
        doc.zoom.password = password;
        doc.zoom.joinUrl = zoomMeeting?.data?.join_url;
      }

      return await doc.save();
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Mutation(() => Number)
  async addSpecialEvent(@Arg("input") input: SpecialEventInput) {
    try {
      validateUserInput(input);

      input.details = {
        ...input.details,
        title: input.details.title.trim(),
        description: input.details.description.trim(),
      };

      let {
        instructors,
        details,
        status,
        online,
        offline,
        schedule,
        createZoomMeeting,
      } = input;

      // @ts-ignore
      instructors = instructors.map((instructor) => {
        return {
          name: instructor.trim(),
        };
      });

      const scheduleArray = RRule.fromString(schedule.rString).all();

      const recurrenceId = generateRecurrenceId();

      /**
       * For co-host auto assignment, however it requires email to be licensed under same account
       */
      // const instructorsEmail = await Promise.all(
      //   instructors.map(async (instructor) => {
      //     const _user = await User.findById(instructor).select("email");
      //     return _user.email;
      //   })
      // );

      let amountOfSpecialEvents =
        scheduleArray.length <= MAXIMUM_CLASS_LIMIT
          ? scheduleArray.length
          : MAXIMUM_CLASS_LIMIT;

      for (let i = 0; i < amountOfSpecialEvents; i++) {
        const inThePast =
          DateTime.fromJSDate(scheduleArray[i]).plus({
            minutes: schedule.duration,
          }) < DateTime.now();

        const doc = new SpecialEventModel({
          instructors,
          details,
          online,
          offline,
          status,
          schedule: {
            date: scheduleArray[i],
            isAllDay: schedule.isAllDay,
            duration: schedule.duration,
            rString: schedule.rString,
          },
        });

        doc.schedule.date = scheduleArray[i];
        doc.recurrenceId = recurrenceId;

        const password = crypto.randomBytes(2).toString("hex");

        if (createZoomMeeting && !inThePast) {
          const zoomMeeting = await createMeeting(
            meetingOptions({
              topic: details.title,
              start_time: doc.schedule.date,
              duration: schedule.duration,
              password,
            })
          );

          if (zoomMeeting?.data?.id) {
            doc.zoom.meetingId = zoomMeeting?.data?.id?.toString();
            doc.zoom.password = password;
            doc.zoom.joinUrl = zoomMeeting?.data?.join_url;
          }
        }

        await doc.save();
      }

      return amountOfSpecialEvents;
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Mutation(() => Number)
  async editSingleSpecialEvent(@Arg("input") input: SpecialEventInput) {
    try {
      input.details = {
        ...input.details,
        title: input.details.title.trim(),
        description: input.details.description.trim(),
      };

      validateUserInput(input);

      const { _id, instructors, details, status, online, offline, schedule } =
        input;

      const event: HydratedDocument<SpecialEvent> =
        await SpecialEventModel.findById(_id)
          .populate({
            path: "online.booked",
            select: "bookingCode user",
            populate: {
              path: "user",
              select: "email",
            },
          })
          .populate({
            path: "online.confirmed",
            select: "bookingCode user",
            populate: {
              path: "user",
              select: "email",
            },
          })
          .populate({
            path: "offline.booked",
            select: "bookingCode user",
            populate: {
              path: "user",
              select: "email",
            },
          })
          .populate({
            path: "offline.confirmed",
            select: "bookingCode user",
            populate: {
              path: "user",
              select: "email",
            },
          });
      const originalEventDate = event.schedule.date;
      const originalEventTitle = event.details.title;

      if (instructors) {
        event.instructors = instructors.map((instructor) => {
          return {
            name: instructor.trim(),
          };
        });
      }
      if (details) event.details = details;
      if (schedule) event.schedule = schedule;
      if (online) {
        event.online.capacity = online.capacity;
        event.online.bookingTimeLimit = online.bookingTimeLimit;
        event.online.cost = online.cost;
      }
      if (offline) {
        event.offline.capacity = offline.capacity;
        event.offline.bookingTimeLimit = offline.bookingTimeLimit;
        event.offline.cost = offline.cost;
      }
      if (status)
        event.status = {
          ...status,
          isRunning: event.status.isRunning,
        };

      /**
       * Only send Zoom API request on schedule change
       */
      if (
        event.zoom?.meetingId &&
        (DateTime.fromJSDate(originalEventDate).toISO() !==
          DateTime.fromJSDate(schedule.date).toISO() ||
          originalEventTitle !== event.details.title)
      ) {
        await editMeeting(
          event.zoom.meetingId,
          meetingOptions({
            topic: event.details.title,
            start_time: event.schedule.date,
            duration: event.schedule.duration,
          })
        );
      }

      await event.save();

      /**
       * Only send email when there's a schedule change
       */
      if (
        DateTime.fromJSDate(originalEventDate).toISO() !==
        DateTime.fromJSDate(schedule.date).toISO()
      ) {
        await sendRescheduleEmail(event);
        await sendRescheduleNotification(event);
      }

      return 1;
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Mutation(() => Number)
  async editRecurrenceSpecialEvent(@Arg("input") input: SpecialEventInput) {
    try {
      input.details = {
        ...input.details,
        title: input.details.title.trim(),
        description: input.details.description.trim(),
      };

      validateUserInput(input);

      const { _id, instructors, details, status, online, offline, schedule } =
        input;

      const _res: HydratedDocument<SpecialEvent> =
        await SpecialEventModel.findById(_id);
      if (!_res) throw new DataException(classError.NOT_FOUND);

      let recurrenceId: string;

      if (_res.recurrenceId) {
        recurrenceId = _res.recurrenceId;
      } else throw new DataException(classError.INVALID_RECURRENCE);

      // @ts-ignore
      // TS warning shown due to the result is being sorted
      const result: Array<HydratedDocument<SpecialEvent>> =
        await SpecialEventModel.find({ recurrenceId })
          .populate({
            path: "online.booked",
            select: "bookingCode user",
            populate: {
              path: "user",
              select: "email",
            },
          })
          .populate({
            path: "offline.booked",
            select: "bookingCode user",
            populate: {
              path: "user",
              select: "email",
            },
          })
          .sort({
            "schedule.date": 1,
          });

      if (!result) throw new DataException(classError.INVALID_RECURRENCE);

      const newRule = ruleUpdate(result, schedule.rString);

      let originalEventDate: Date, originalEventTitle: string;
      const resultLength = result.length;

      for (let i = 0; i < resultLength; i++) {
        originalEventDate = result[i].schedule.date;
        originalEventTitle = result[i].details.title;

        result[i].schedule.date = newRule.result[i];
        result[i].schedule.rString = newRule.string;
        result[i].schedule.duration = schedule.duration;
        result[i].schedule.isAllDay = schedule.isAllDay;

        result[i].instructors = instructors.map((instructor) => {
          return { name: instructor.trim() };
        });
        result[i].details = details;
        result[i].online.capacity = online.capacity;
        result[i].online.cost = online.cost;
        result[i].offline.capacity = offline.capacity;
        result[i].offline.cost = offline.cost;
        result[i].status = {
          ...status,
          isRunning: result[i].status.isRunning,
        };
        await result[i].save();

        /**
         * Only send Zoom API request and email on schedule or title change
         */
        if (
          result[i].zoom?.meetingId &&
          (DateTime.fromJSDate(originalEventDate).toISO() !==
            DateTime.fromJSDate(newRule.result[i]).toISO() ||
            originalEventTitle !== details.title)
        ) {
          await editMeeting(
            result[i].zoom.meetingId,
            meetingOptions({
              topic: result[i].details.title,
              start_time: result[i].schedule.date,
              duration: result[i].schedule.duration,
            })
          );
        }

        /**
         * Only send email on schedule change
         */
        if (
          DateTime.fromJSDate(originalEventDate).toISO() !==
          DateTime.fromJSDate(newRule.result[i]).toISO()
        ) {
          await Promise.all([
            sendRescheduleEmail(result[i]),
            sendRescheduleNotification(result[i]),
          ]);
        }
      }

      return result.length;
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Mutation(() => Number)
  async editFollowingSpecialEvent(
    @Arg("input") input: SpecialEventInput,
    @Arg("originalDate") originalDate: Date
  ) {
    try {
      input.details = {
        ...input.details,
        title: input.details.title.trim(),
        description: input.details.description.trim(),
      };

      validateUserInput(input);

      const { _id, instructors, details, status, online, offline, schedule } =
        input;

      const _res: HydratedDocument<SpecialEvent> =
        await SpecialEventModel.findById(_id);
      if (!_res) throw new DataException(classError.NOT_FOUND);
      if (!_res.recurrenceId) throw new DataException("Invalid recurrenceId");

      const recurrenceId = _res.recurrenceId;

      const selectedEvents = await SpecialEventModel.find({
        recurrenceId,
      })
        .populate({
          path: "online.booked",
          select: "bookingCode user",
          populate: {
            path: "user",
            select: "email",
          },
        })
        .populate({
          path: "offline.booked",
          select: "bookingCode user",
          populate: {
            path: "user",
            select: "email",
          },
        })
        .sort({ "schedule.date": 1 });

      const { priorEvents, postEvents } = filterEvents(
        selectedEvents,
        originalDate
      );

      let rulePrior, rulePost;

      //Update schedule rule before selected date
      if (priorEvents.length > 0) {
        rulePrior = ruleUpdate(priorEvents);

        priorEvents.forEach(async (event) => {
          event.schedule.rString = rulePrior.string;
          await event.save();
        });
      }

      if (postEvents.length > 0) {
        rulePost = ruleUpdate(postEvents, schedule.rString);
      }

      const newRecurrenceId = generateRecurrenceId();

      let originalEventDate: Date, originalEventTitle: string;

      const postEventsLength = postEvents.length;

      for (let i = 0; i < postEventsLength; i++) {
        originalEventDate = postEvents[i].schedule.date;
        originalEventTitle = postEvents[i].details.title;

        postEvents[i].schedule.date = rulePost.result[i];
        postEvents[i].schedule.rString = rulePost.string;

        postEvents[i].recurrenceId = newRecurrenceId;
        postEvents[i].schedule.duration = schedule.duration;
        postEvents[i].schedule.isAllDay = schedule.isAllDay;
        postEvents[i].instructors = instructors.map((instructor) => {
          return { name: instructor.trim() };
        });
        postEvents[i].details = details;
        postEvents[i].online.capacity = online.capacity;
        postEvents[i].online.cost = online.cost;
        postEvents[i].offline.capacity = offline.capacity;
        postEvents[i].offline.cost = offline.cost;
        postEvents[i].status = {
          ...status,
          isRunning: postEvents[i].status.isRunning,
        };

        await postEvents[i].save();

        /**
         * Only send Zoom API request and send email on schedule change
         */
        if (
          postEvents[i].zoom?.meetingId &&
          (DateTime.fromJSDate(originalEventDate).toISO() !==
            DateTime.fromJSDate(rulePost.result[i]).toISO() ||
            originalEventTitle !== details.title)
        ) {
          await editMeeting(
            postEvents[i].zoom.meetingId,
            meetingOptions({
              topic: postEvents[i].details.title,
              start_time: postEvents[i].schedule.date,
              duration: postEvents[i].schedule.duration,
            })
          );
        }

        /**
         * Only send  email on schedule change
         */
        if (
          DateTime.fromJSDate(originalEventDate).toISO() !==
          DateTime.fromJSDate(rulePost.result[i]).toISO()
        ) {
          await Promise.all([
            sendRescheduleEmail(postEvents[i]),
            sendRescheduleNotification(postEvents[i]),
          ]);
        }
      }

      return postEvents.length;
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Mutation(() => Number)
  async deleteSingleSpecialEvent(
    @Arg("_id") _id: Types.ObjectId,
    @Arg("updatedBy") updatedBy: Types.ObjectId
  ) {
    try {
      const event: HydratedDocument<SpecialEvent> =
        await SpecialEventModel.findById(_id)
          .populate("online.booked")
          .populate("offline.booked");

      validateDeletion(event);

      if (event.zoom?.meetingId) await deleteMeeting(event.zoom.meetingId);

      /**
       * Prepare log
       */
      const newLog = await eventDeletionLog(event, updatedBy);

      /**
       * Reject all bookings
       */
      await rejectAllEventRegistration(event, updatedBy);

      /**
       * Delete special class
       */
      await SpecialEventModel.findByIdAndDelete(_id).orFail(
        new Error(classError.CLASS_DELETION_FAILED)
      );

      /**
       * Save log
       */
      await newLog.save();

      return 1;
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Mutation(() => Number)
  async deleteRecurrenceSpecialEvent(
    @Arg("_id") _id: ObjectId,
    @Arg("updatedBy") updatedBy: Types.ObjectId
  ) {
    try {
      const specialEvent = await SpecialEventModel.findById(_id);
      const recurrenceId = specialEvent.recurrenceId;

      const eventArray: HydratedDocument<SpecialEvent>[] =
        await SpecialEventModel.find({ recurrenceId });

      eventArray.forEach((regularClass) => {
        validateDeletion(regularClass);
      });

      const amountOfSpecialEvents = eventArray.length;

      const allLogs = [];

      for (let i = 0; i < amountOfSpecialEvents; i++) {
        if (eventArray[i].zoom.meetingId)
          await deleteMeeting(eventArray[i].zoom.meetingId);

        /**
         * Prepare log
         */
        const newLog = await eventDeletionLog(eventArray[i], updatedBy);
        allLogs.push(newLog);

        /**
         * Reject all bookings
         */
        await rejectAllEventRegistration(eventArray[i], updatedBy);
      }

      /**
       * Delete classes
       */
      const n = await SpecialEventModel.deleteMany({ recurrenceId });

      /**
       * Save log
       */
      allLogs.forEach(async (log) => await log.save());
      return n.deletedCount;
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Mutation(() => Number)
  async deleteFollowingSpecialEvent(
    @Arg("_id") _id: ObjectId,
    @Arg("date") date: Date,
    @Arg("updatedBy") updatedBy: Types.ObjectId
  ) {
    try {
      const event: HydratedDocument<SpecialEvent> =
        await SpecialEventModel.findById(_id);

      const recurrenceId = event.recurrenceId;

      const eventArray: HydratedDocument<SpecialEvent>[] =
        await SpecialEventModel.find({
          recurrenceId,
          "schedule.date": { $gte: date },
        });

      eventArray.forEach((ev) => {
        validateDeletion(ev);
      });

      const eventLength = eventArray.length;
      const allLogs = [];

      for (let i = 0; i < eventLength; i++) {
        if (eventArray[i].zoom.meetingId)
          await deleteMeeting(eventArray[i].zoom.meetingId);

        /**
         * Prepare log
         */
        const newLog = await eventDeletionLog(eventArray[i], updatedBy);
        allLogs.push(newLog);

        /**
         * Reject all bookings
         */
        await rejectAllEventRegistration(eventArray[i], updatedBy);
      }

      /**
       * Delete classes
       */
      const n = await SpecialEventModel.deleteMany({
        recurrenceId,
        "schedule.date": { $gte: date },
      });

      /**
       * Save log
       */
      allLogs.forEach(async (log) => await log.save());

      return n.deletedCount;
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Mutation(() => SpecialEvent)
  async updateSpecialEventStatus(
    @Arg("_id") _id: Types.ObjectId,
    @Arg("isRunning") isRunning: boolean
  ) {
    const now = DateTime.now().toJSDate();

    try {
      const res = await SpecialEventModel.findById(_id);
      if (!res) throw new DataException(classError.NOT_FOUND);

      if (now < res.schedule.date && isRunning)
        throw new RuleException(
          classError.SPECIAL_CLASS_CONFIRM_RUNNING_BEFORE_TIME
        );

      res.status.isRunning = isRunning;

      return await res.save();
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Mutation(() => SpecialEvent)
  async deleteSpecialEventStatus(@Arg("_id") _id: Types.ObjectId) {
    try {
      const res = await SpecialEventModel.findById(_id);
      if (!res) throw new DataException(classError.NOT_FOUND);

      res.status.isRunning = null;

      return await res.save();
    } catch (error) {
      return error;
    }
  }
}
