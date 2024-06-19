import {
  BookingCardModel,
  LogModel,
  MessageModel,
  RegularClassModel,
  UserModel,
} from "@/models/index";
import {
  DataException,
  InputException,
  RuleException,
  classError,
  userError,
} from "@/utils/error_message";
import { formatTable, sendNotificationEmail } from "@/utils/mailer";
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
import { Arg, Args, Authorized, Mutation, Query, Resolver } from "type-graphql";
import validator from "validator";
import { BookingCard, BookingStatusValue } from "./bookingCard";
import { cancelBookingCard, confirmBookingCard } from "./bookingCard.resolver";
import { CategoryValue, SubCategoryValue } from "./log";
import {
  RegularClass,
  RegularClassInput,
  UpdateClassMutationArgs,
} from "./regularClass";
import { SpecialEvent } from "./specialEvent";
import { User } from "./user";

const MAXIMUM_CLASS_LIMIT = 25 as const;

const cancelAllBookingsInRegularClass = async (
  regularClass: HydratedDocument<RegularClass>,
  updatedBy: Types.ObjectId
) => {
  const onlineBookingLength = regularClass.online.booked.length;
  const offlineBookingLength = regularClass.offline.booked.length;

  for (let i = 0; i < onlineBookingLength; i++) {
    await cancelBookingCard({
      _id: regularClass.online.booked[i]._id,
      updatedBy,
      bookingStatus: BookingStatusValue.CLASS_CANCELLED,
    });
  }

  for (let i = 0; i < offlineBookingLength; i++) {
    await cancelBookingCard({
      _id: regularClass.offline.booked[i]._id,
      updatedBy,
      bookingStatus: BookingStatusValue.CLASS_CANCELLED,
    });
  }
};

const confirmAllBookingsInRegularClass = async (
  regularClass: HydratedDocument<RegularClass>,
  updatedBy: Types.ObjectId
) => {
  const onlineBookingLength = regularClass.online.booked.length;
  const offlineBookingLength = regularClass.offline.booked.length;

  for (let i = 0; i < onlineBookingLength; i++) {
    const res = await confirmBookingCard({
      _id: regularClass.online.booked[i]._id,
      updatedBy,
    });

    if (!res) throw new DataException(classError.CONFIRMATION_FAILED_PARTIAL);
  }

  for (let i = 0; i < offlineBookingLength; i++) {
    const res = await confirmBookingCard({
      _id: regularClass.offline.booked[i]._id,
      updatedBy,
    });

    if (!res) throw new DataException(classError.CONFIRMATION_FAILED_PARTIAL);
  }
};

const classDeletionLog = async (
  regularClass: HydratedDocument<RegularClass>,
  updatedBy: Types.ObjectId
) => {
  const updater = await UserModel.findById(updatedBy);

  const affectedBooking: Array<string> = [];

  const onlineBookedLength = regularClass.online.booked.length;
  const offlineBookedLength = regularClass.offline.booked.length;

  await Promise.all([
    ...regularClass.online.booked.map(async (booking: Partial<BookingCard>) => {
      const bookingUser: HydratedDocument<BookingCard, { user: User }> =
        await BookingCardModel.findById(booking._id).populate({
          path: "user",
          select: "name",
        });

      affectedBooking.push(
        `[${bookingUser.bookingCode}_${bookingUser.user.name} - online]`
      );
    }),

    ...regularClass.offline.booked.map(
      async (booking: Partial<BookingCard>) => {
        const bookingUser: HydratedDocument<BookingCard, { user: User }> =
          await BookingCardModel.findById(booking._id).populate({
            path: "user",
            select: "name",
          });

        affectedBooking.push(
          `[${bookingUser.bookingCode}_${bookingUser.user.name} - offline]`
        );
      }
    ),
  ]);

  const joinedAffectedBooking = affectedBooking.join(", ");

  return new LogModel({
    user: updatedBy,
    category: CategoryValue.CLASS,
    subCategory: SubCategoryValue.DELETED,
    message: `${
      regularClass.details.title
    } originally scheduled on ${DateTime.fromJSDate(
      regularClass.schedule.date
    ).toFormat("dd LLL yyyy")} was deleted by ${updater.name}. 
    ${onlineBookedLength + offlineBookedLength} booking(s) were affected: 
    ${joinedAffectedBooking}`,
  });
};

export const filterEvents = (events, originalDate) => {
  return {
    priorEvents: events.filter((event) => event.schedule.date < originalDate),
    postEvents: events.filter((event) => event.schedule.date >= originalDate),
  };
};

export const generateRecurrenceId = () => {
  return crypto.randomBytes(12).toString("hex");
};

export const ruleUpdate = (
  arrayOfClass: Array<RegularClass | SpecialEvent>,
  rString: string = null
) => {
  let _rule;
  if (!rString) {
    _rule = RRule.fromString(arrayOfClass[0].schedule.rString);
  } else {
    _rule = RRule.fromString(rString);
  }

  if (_rule.origOptions.until) delete _rule.origOptions.until;
  _rule.origOptions.count = arrayOfClass.length;

  const rule = new RRule(_rule.origOptions);
  const string = rule.toString();
  const result = rule.all();

  return { rule, string, result };
};

export const sendRescheduleNotification = async (
  event: HydratedDocument<RegularClass | SpecialEvent>
) => {
  const onlineBooked = event.online.booked.map((bookingData) => {
    return {
      user: bookingData.user,
      bookingCode: bookingData.bookingCode,
    };
  });

  // @ts-ignore
  const onlineConfirmed = (event.online?.confirmed || []).map((bookingData) => {
    return {
      user: bookingData.user,
      bookingCode: bookingData.bookingCode,
    };
  });

  const offlineBooked = event.offline.booked.map((bookingData) => {
    return {
      user: bookingData.user,
      bookingCode: bookingData.bookingCode,
    };
  });

  // @ts-ignore
  const offlineConfirmed = (event.offline?.confirmed || []).map(
    (bookingData) => {
      return {
        user: bookingData.user,
        bookingCode: bookingData.bookingCode,
      };
    }
  );

  const allBooked = [
    ...onlineBooked,
    ...onlineConfirmed,
    ...offlineBooked,
    ...offlineConfirmed,
  ];

  await Promise.all(
    allBooked.map(async (booked) => {
      const newMessage = new MessageModel({
        user: booked.user,
        title: `Class Reschedule - ${event.details.title}`,
        message: `Please be notified your upcoming class has been rescheduled to ${DateTime.fromJSDate(
          event.schedule.date
        )
          .setZone("Asia/Jakarta")
          .toFormat("dd LLL yyyy, HH:mm")} - ${DateTime.fromJSDate(
          event.schedule.date
        )
          .setZone("Asia/Jakarta")
          .plus({ minutes: event.schedule.duration })
          .toFormat(
            "HH:mm"
          )} Jakarta time (UTC+7). We apologize for any inconvenience caused.`,
      });

      return newMessage.save();
    })
  );
};

export const sendRescheduleEmail = async (
  event: HydratedDocument<RegularClass | SpecialEvent>
) => {
  const onlineBooked = event.online.booked.map((bookingData) => {
    return {
      bookingCode: bookingData.bookingCode,
      email: bookingData.user.email,
    };
  });

  // @ts-ignore
  const onlineConfirmed = (event.online?.confirmed || []).map((bookingData) => {
    return {
      user: bookingData.user,
      bookingCode: bookingData.bookingCode,
    };
  });

  const offlineBooked = event.offline.booked.map((bookingData) => {
    return {
      bookingCode: bookingData.bookingCode,
      email: bookingData.user.email,
    };
  });

  // @ts-ignore
  const offlineConfirmed = (event.offline?.confirmed || []).map(
    (bookingData) => {
      return {
        user: bookingData.user,
        bookingCode: bookingData.bookingCode,
      };
    }
  );

  const allBooked = [
    ...onlineBooked,
    ...onlineConfirmed,
    ...offlineBooked,
    ...offlineConfirmed,
  ];

  await Promise.all(
    allBooked.map(async (bookingData) => {
      const tableRows = [
        {
          label: "Class Name",
          content: `${event.details.title}`,
        },
        {
          label: "New Schedule",
          content: `${DateTime.fromJSDate(event.schedule.date)
            .setZone("Asia/Jakarta")
            .toFormat("dd LLL yyyy, HH:mm")} - ${DateTime.fromJSDate(
            event.schedule.date
          )
            .setZone("Asia/Jakarta")
            .plus({ minutes: event.schedule.duration })
            .toFormat("HH:mm")} `,
        },
        {
          label: "",
          content: "Jakarta time (UTC+7)",
        },
        { label: "Booking Code", content: `${bookingData.bookingCode}` },
      ];

      const emailParams = {
        identifier: bookingData.email,
        subject: `Your booking on ${process.env.NEXT_PUBLIC_STUDIO_NAME} has been rescheduled`,
        header: `Reschedule Notification`,
        htmlMessage: formatTable(tableRows),
        plainTextMessage: `Your booking ${bookingData.bookingCode} for ${
          event.details.title
        } has been rescheduled to ${DateTime.fromJSDate(event.schedule.date)
          .setZone("Asia/Jakarta")
          .toFormat("dd LLL yyyy, HH:mm")} - ${DateTime.fromJSDate(
          event.schedule.date
        )
          .setZone("Asia/Jakarta")
          .plus({ minutes: event.schedule.duration })
          .toFormat("HH:mm")} Jakarta time (UTC+7).`,
      };

      return await sendNotificationEmail(emailParams);
    })
  );
};

export const validateDeletion = (event: RegularClass | SpecialEvent) => {
  if (!event) throw new DataException(classError.NOT_FOUND);
  if (!event.recurrenceId)
    throw new DataException(classError.INVALID_RECURRENCE);
  if (event.status.isRunning) throw new RuleException(classError.IS_RUNNING);
};

const validateUserInput = (regularClass: RegularClassInput) => {
  if (regularClass.instructors.length === 0)
    throw new InputException(classError.NO_INSTRUCTOR);
  if (!regularClass.details.title)
    throw new InputException(classError.NO_TITLE);

  if (
    !validator.isAlphanumeric(regularClass.details.title, "en-US", {
      ignore: " ",
    })
  )
    throw new InputException(classError.TITLE_MUST_BE_ALPHANUMERIC);

  if (!regularClass.details.level)
    throw new InputException(classError.NO_LEVEL);
  if (
    regularClass.online.capacity === null ||
    regularClass.offline.capacity === null
  )
    throw new InputException(classError.NO_CAPACITY);
  if (regularClass.online.capacity === 0 && regularClass.offline.capacity === 0)
    throw new InputException(classError.OFFLINE_ONLINE_ZERO_CAPACITY);
  if (!regularClass.schedule.rString)
    throw new InputException(classError.INVALID_RECURRENCE);

  if (regularClass.schedule.duration < 0)
    throw new InputException(classError.DURATION_IS_INVALID);
};

@Resolver(RegularClass)
export class RegularClassResolver {
  @Authorized()
  @Query(() => RegularClass)
  async regularClass(@Arg("_id") _id: ObjectId) {
    try {
      return await RegularClassModel.findById(_id)
        .populate("instructors", "name image")
        .populate({
          path: "offline.booked",
          populate: {
            path: "user",
            select: "name",
          },
        })
        .populate({
          path: "online.booked",
          populate: {
            path: "user",
            select: "name",
          },
        });
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Query(() => [RegularClass])
  async regularClasses() {
    try {
      return await RegularClassModel.find()
        .populate("instructors", "name image")
        .populate("details.level")
        .sort({ "schedule.date": 1 });
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Query(() => [RegularClass])
  async regularClassesPerMonth(@Arg("viewedDate") viewedDate: Date) {
    try {
      const firstDate = DateTime.fromJSDate(viewedDate)
        .setZone("UTC+7")
        .startOf("month")
        .toJSDate();
      const lastDate = DateTime.fromJSDate(viewedDate)
        .setZone("UTC+7")
        .endOf("month")
        .toJSDate();

      return await RegularClassModel.find({
        "schedule.date": {
          $gt: firstDate,
          $lte: lastDate,
        },
      })
        .populate("instructors", "name image")
        .populate("details.level")
        .sort({ "schedule.date": 1 });
    } catch (error) {
      return error;
    }
  }

  @Authorized(["INSTRUCTOR"])
  @Query(() => [RegularClass])
  async regularClassesByInstructorsUsername(
    @Arg("username") username: string,
    @Arg("viewedDate") viewedDate: Date
  ) {
    const options = { sort: [{ name: 1 }] };
    const firstDate = DateTime.fromJSDate(viewedDate)
      .setZone("UTC+7")
      .startOf("month")
      .toJSDate();
    const lastDate = DateTime.fromJSDate(viewedDate)
      .setZone("UTC+7")
      .endOf("month")
      .toJSDate();

    try {
      const instructor = await UserModel.findOne({ username });
      if (!instructor) throw new DataException(userError.NOT_FOUND);

      const result = await RegularClassModel.find({
        instructors: {
          $in: instructor._id,
        },
        "schedule.date": {
          $gt: firstDate,
          $lte: lastDate,
        },
      })
        .populate("instructors")
        .populate("details.level")
        .populate({
          path: "online.booked",
          populate: {
            path: "user",
            model: UserModel,
            options,
          },
        })
        .populate({
          path: "offline.booked",
          populate: {
            path: "user",
            model: UserModel,
            options,
          },
        })
        .sort({ "schedule.date": 1 });

      return result;
    } catch (error) {
      return error;
    }
  }

  // For home page, filtered to only return future date
  @Authorized(["INSTRUCTOR"])
  @Query(() => [RegularClass])
  async activeClassesByInstructors(@Arg("_id") _id: ObjectId) {
    const earlierToday = DateTime.now().startOf("day").toJSDate();

    try {
      const result = await RegularClassModel.find({
        instructors: { $in: _id },
        "schedule.date": {
          $gte: earlierToday,
        },
      })
        .populate("instructors")
        .populate("details.level")
        .populate({
          path: "online.booked",
          populate: {
            path: "user",
            model: "User",
          },
        })
        .populate({
          path: "offline.booked",
          populate: {
            path: "user",
            model: "User",
          },
        })
        .sort({ "schedule.date": 1 })
        .limit(10);

      return result;
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Mutation(() => Number)
  async addRegularClass(@Arg("input") input: RegularClassInput) {
    try {
      validateUserInput(input);

      input.details = {
        ...input.details,
        title: input.details.title.trim(),
        description: input.details.description.trim(),
      };

      const {
        instructors,
        details,
        status,
        online,
        offline,
        schedule,
        createZoomMeeting,
      } = input;

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

      const amountOfRegularClass =
        scheduleArray.length <= MAXIMUM_CLASS_LIMIT
          ? scheduleArray.length
          : MAXIMUM_CLASS_LIMIT;

      for (let i = 0; i < amountOfRegularClass; i++) {
        const inThePast =
          DateTime.fromJSDate(scheduleArray[i]).plus({
            minutes: schedule.duration,
          }) < DateTime.now();

        const doc = new RegularClassModel({
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

      return amountOfRegularClass;
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Mutation(() => RegularClass)
  async addZoomMeetingRegularClass(@Arg("_id") _id: ObjectId) {
    try {
      const doc = await RegularClassModel.findById(_id);

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
  async editSingleRegularClass(@Arg("input") input: RegularClassInput) {
    try {
      input.details = {
        ...input.details,
        title: input.details.title.trim(),
        description: input.details.description.trim(),
      };

      validateUserInput(input);

      const { _id, instructors, details, status, online, offline, schedule } =
        input;

      const event: HydratedDocument<RegularClass> =
        await RegularClassModel.findById(_id)
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
          });
      const originalEventDate = event.schedule.date;
      const originalTitle = event.details.title;

      if (instructors) event.instructors = instructors;
      if (details) event.details = details;
      if (schedule) event.schedule = schedule;

      if (online) {
        event.online.capacity = online.capacity;
        event.online.cost = online.cost;
        event.online.bookingTimeLimit = online.bookingTimeLimit;
        event.online.cancelTimeLimit = online.cancelTimeLimit;
      }
      if (offline) {
        event.offline.capacity = offline.capacity;
        event.offline.cost = offline.cost;
        event.offline.bookingTimeLimit = offline.bookingTimeLimit;
        event.offline.cancelTimeLimit = offline.cancelTimeLimit;
      }
      if (status)
        event.status = {
          ...status,
          isRunning: event.status.isRunning,
        };

      /**
       * Only send Zoom API request on schedule or title change
       */
      if (
        event.zoom?.meetingId &&
        (DateTime.fromJSDate(originalEventDate).toISO() !==
          DateTime.fromJSDate(schedule.date).toISO() ||
          details.title !== originalTitle)
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
  async editRecurrenceRegularClass(@Arg("input") input: RegularClassInput) {
    try {
      input.details = {
        ...input.details,
        title: input.details.title.trim(),
        description: input.details.description.trim(),
      };

      validateUserInput(input);

      const { _id, instructors, details, status, online, offline, schedule } =
        input;

      const _res: HydratedDocument<RegularClass> =
        await RegularClassModel.findById(_id);
      if (!_res) throw new DataException(classError.NOT_FOUND);

      let recurrenceId: string;

      if (_res.recurrenceId) {
        recurrenceId = _res.recurrenceId;
      } else throw new DataException("Invalid recurrenceId");

      // @ts-ignore
      // TS warning shown due to the result is being sorted
      const result: Array<HydratedDocument<RegularClass>> =
        await RegularClassModel.find({ recurrenceId })
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

        result[i].instructors = instructors;
        result[i].details = details;

        result[i].online.capacity = online.capacity;
        result[i].online.cost = online.cost;
        result[i].online.bookingTimeLimit = online.bookingTimeLimit;
        result[i].online.cancelTimeLimit = online.cancelTimeLimit;

        result[i].offline.capacity = offline.capacity;
        result[i].offline.cost = offline.cost;
        result[i].offline.bookingTimeLimit = offline.bookingTimeLimit;
        result[i].offline.cancelTimeLimit = offline.cancelTimeLimit;

        result[i].status = {
          ...status,
          isRunning: result[i].status.isRunning,
        };
        await result[i].save();

        /**
         * Only send Zoom API request on schedule or title change
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
         * Only send Zoom API request and email on schedule change
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
  async editFollowingRegularClass(
    @Arg("input") input: RegularClassInput,
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

      const _res: HydratedDocument<RegularClass> =
        await RegularClassModel.findById(_id);
      if (!_res) throw new DataException(classError.NOT_FOUND);
      if (!_res.recurrenceId) throw new DataException("Invalid recurrenceId");

      const recurrenceId = _res.recurrenceId;

      const selectedEvents = await RegularClassModel.find({
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
        postEvents[i].schedule.duration = schedule.duration;
        postEvents[i].schedule.isAllDay = schedule.isAllDay;

        postEvents[i].recurrenceId = newRecurrenceId;
        postEvents[i].instructors = instructors;
        postEvents[i].details = details;

        postEvents[i].online.capacity = online.capacity;
        postEvents[i].online.cost = online.cost;
        postEvents[i].online.bookingTimeLimit = online.bookingTimeLimit;
        postEvents[i].online.cancelTimeLimit = online.cancelTimeLimit;

        postEvents[i].offline.capacity = offline.capacity;
        postEvents[i].offline.cost = offline.cost;
        postEvents[i].offline.bookingTimeLimit = offline.bookingTimeLimit;
        postEvents[i].offline.cancelTimeLimit = offline.cancelTimeLimit;

        postEvents[i].status = {
          ...status,
          isRunning: postEvents[i].status.isRunning,
        };

        await postEvents[i].save();

        /**
         * Only send Zoom API request  on schedule to title change
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
         * Only send  send email on schedule change
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
  async deleteSingleRegularClass(
    @Arg("_id") _id: Types.ObjectId,
    @Arg("updatedBy") updatedBy: Types.ObjectId
  ) {
    try {
      const regularClass: HydratedDocument<RegularClass> =
        await RegularClassModel.findById(_id)
          .populate({
            path: "online.booked",
            select: "_id bookingCode user",
          })
          .populate({
            path: "offline.booked",
            select: "_id bookingCode user",
          });

      validateDeletion(regularClass);

      if (regularClass.zoom?.meetingId)
        await deleteMeeting(regularClass.zoom.meetingId);

      /**
       * Prepare audit log message
       */
      const newLog = await classDeletionLog(regularClass, updatedBy);

      /**
       * Cancel bookings
       */
      await cancelAllBookingsInRegularClass(regularClass, updatedBy);

      /**
       * Delete class
       */
      await RegularClassModel.findByIdAndDelete(_id).orFail(
        new DataException(classError.CLASS_DELETION_FAILED)
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
  async deleteRecurrenceRegularClass(
    @Arg("_id") _id: Types.ObjectId,
    @Arg("updatedBy") updatedBy: Types.ObjectId
  ) {
    try {
      const regularClass = await RegularClassModel.findById(_id);
      const recurrenceId = regularClass.recurrenceId;

      const regularClassArray: HydratedDocument<RegularClass>[] =
        await RegularClassModel.find({ recurrenceId });

      regularClassArray.forEach((regularClass) => {
        validateDeletion(regularClass);
      });

      const allLogs = [];

      for (let i = 0; i < regularClassArray.length; i++) {
        /**
         * If exist, delete zoom meeting
         */
        if (regularClassArray[i].zoom.meetingId)
          await deleteMeeting(regularClassArray[i].zoom.meetingId);

        /**
         * Generate logs
         */
        const newLog = await classDeletionLog(regularClassArray[i], updatedBy);
        allLogs.push(newLog);

        /**
         * Cancel all bookings
         */
        await cancelAllBookingsInRegularClass(regularClassArray[i], updatedBy);
      }

      /**
       * Delete class
       */
      const n = await RegularClassModel.deleteMany({ recurrenceId }).orFail(
        new DataException(classError.CLASS_DELETION_FAILED)
      );

      /**
       * Save logs
       */
      await Promise.all(allLogs.map(async (log) => log.save()));

      return n.deletedCount;
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Mutation(() => Number)
  async deleteFollowingRegularClass(
    @Arg("_id") _id: ObjectId,
    @Arg("date") date: Date,
    @Arg("updatedBy") updatedBy: Types.ObjectId
  ) {
    try {
      const regularClass: HydratedDocument<RegularClass> =
        await RegularClassModel.findById(_id);

      const recurrenceId = regularClass.recurrenceId;

      const regularClassArray: HydratedDocument<RegularClass>[] =
        await RegularClassModel.find({
          recurrenceId,
          "schedule.date": { $gte: date },
        });

      regularClassArray.forEach((regularClass) => {
        validateDeletion(regularClass);
      });

      const allLogs = [];

      for (let i = 0; i < regularClassArray.length; i++) {
        /**
         * If exist, delete zoom meeting
         */
        if (regularClassArray[i].zoom.meetingId)
          await deleteMeeting(regularClassArray[i].zoom.meetingId);

        /**
         * Generate logs
         */
        const newLog = await classDeletionLog(regularClassArray[i], updatedBy);
        allLogs.push(newLog);

        /**
         * Cancel all bookings
         */
        await cancelAllBookingsInRegularClass(regularClassArray[i], updatedBy);
      }

      /**
       * Delete class
       */
      const n = await RegularClassModel.deleteMany({
        recurrenceId,
        "schedule.date": { $gte: date },
      }).orFail(new DataException(classError.CLASS_DELETION_FAILED));

      /**
       * Save logs
       */
      await Promise.all(allLogs.map(async (log) => log.save()));

      return n.deletedCount;
    } catch (error) {
      return error;
    }
  }

  @Authorized(["INSTRUCTOR"])
  @Mutation(() => RegularClass)
  async updateClassAttendance(
    @Args()
    { _id, updatedBy, action, reason }: UpdateClassMutationArgs
  ) {
    try {
      const regularClass: HydratedDocument<RegularClass> =
        await RegularClassModel.findById(_id);
      if (!regularClass) throw new DataException(classError.NOT_FOUND);

      const user = await UserModel.findById(updatedBy);
      if (!user) throw new DataException(userError.NOT_FOUND);

      switch (action) {
        case "confirm":
          if (!(user.role.isAdmin || user.role.isInstructor))
            throw new RuleException(
              classError.CONFIRM_ONLY_BY_ADMIN_OR_INSTRUCTOR
            );

          const now = DateTime.now().toJSDate();
          const classEndTime = DateTime.fromJSDate(regularClass.schedule.date)
            .plus({ minute: regularClass.schedule.duration })
            .toJSDate();

          if (now < classEndTime)
            throw new RuleException(classError.HAS_NOT_ENDED);

          regularClass.status.isRunning = true;

          await confirmAllBookingsInRegularClass(regularClass, updatedBy);

          break;
        case "cancel":
          if (!(user.role.isAdmin || user.role.isInstructor))
            throw new RuleException(
              classError.CANCEL_ONLY_BY_ADMIN_OR_INSTRUCTOR
            );

          regularClass.status.isRunning = false;

          await cancelAllBookingsInRegularClass(regularClass, updatedBy);

          /**
           * Send email notification to admin
           */
          await sendNotificationEmail({
            identifier: process.env.EMAIL_ADMIN,
            subject: `Class Cancellation Notification - ${regularClass.details.title}`,
            header: `${regularClass.details.title} - ${DateTime.fromJSDate(
              regularClass.schedule.date
            ).toFormat("dd LLL yyyy")} has been cancelled`,
            htmlMessage: formatTable([
              {
                label: "Class title",
                content: `${regularClass.details.title}`,
              },
              {
                label: "Class schedule",
                content: `${DateTime.fromJSDate(
                  regularClass.schedule.date
                ).toFormat("ccc, dd LLL yyyy")}`,
              },
              { label: "Cancelled by", content: `${user.name}` },
              { label: "Reason", content: `${reason}` },
            ]),
            plainTextMessage: `${
              regularClass.details.title
            } on ${DateTime.fromJSDate(regularClass.schedule.date).toFormat(
              "ccc, dd LLL yyyy"
            )} has been cancelled by ${user.name} due to ${reason}.`,
          });

          break;
        default:
          throw new InputException(classError.INVALID_ACTION);
      }

      return await regularClass.save();
    } catch (error) {
      return error;
    }
  }
}
