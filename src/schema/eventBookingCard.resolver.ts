import {
  CounterModel,
  EventBookingCardModel,
  LogModel,
  MessageModel,
  PaymentMethodModel,
  SpecialEventModel,
  UserModel,
} from "@/models/index";
import { presignS3Url, s3client } from "@/utils/aws";
import { bookingCardCounterString } from "@/utils/counter";
import {
  bookingCardError,
  classError,
  DataException,
  InputException,
  paymentMethodError,
  RuleException,
  userError,
} from "@/utils/error_message";
import {
  EmailParams,
  formatTable,
  RowTable,
  sendNotificationEmail,
} from "@/utils/mailer";
import { sortEventBookingCardAsc } from "@/utils/sort";
import { CopyObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { DateTime } from "luxon";
import { HydratedDocument, PopulatedDoc, Types } from "mongoose";
import path from "path";
import { Arg, Args, Authorized, Mutation, Query, Resolver } from "type-graphql";
import validator from "validator";
import {
  EventBookingCard,
  EventBookingCardInput,
  EventBookingCardStatusInput,
  EventBookingStatusValue,
  EventParticipantsUpdateArgs,
  EventStatusUpdateArgs,
} from "./eventBookingCard";
import { uploadToAWS } from "./file.resolver";
import { CategoryValue, SubCategoryValue } from "./log";
import { SpecialEvent } from "./specialEvent";
import { User } from "./user";

const bucket = process.env.AWS_BUCKET;
const bucketArchive = process.env.AWS_BUCKET_ARCHIVE;

export async function updateRegistrationStatus(
  _id: Types.ObjectId,
  status: EventBookingCardStatusInput
) {
  const bookingCard: HydratedDocument<EventBookingCard> =
    await EventBookingCardModel.findById(_id);

  const user = await UserModel.findById(bookingCard.user);
  if (!user) throw new DataException(userError.NOT_FOUND);

  const updater = await UserModel.findById(status.updatedBy);
  if (!updater) throw new DataException(userError.NOT_FOUND);

  const event: HydratedDocument<
    SpecialEvent,
    {
      online: {
        booked: Types.ObjectId[];
        confirmed: Types.ObjectId[];
        rejected: Types.ObjectId[];
      };
      offline: {
        booked: Types.ObjectId[];
        confirmed: Types.ObjectId[];
        rejected: Types.ObjectId[];
      };
    }
  > = await SpecialEventModel.findById(bookingCard.event);
  if (!event) throw new DataException(classError.NOT_FOUND);

  let filteredBooked: Array<Types.ObjectId>;
  let tableRows: RowTable[];
  let message: string;
  let subCategory: SubCategoryValue;

  switch (status.value) {
    case EventBookingStatusValue.CONFIRMED:
      subCategory = SubCategoryValue.CONFIRMED;

      // move to confirmed array
      filteredBooked = event[bookingCard.classType].booked.filter(
        (id: Types.ObjectId) => id.toString() != _id.toString()
      ) as Array<Types.ObjectId>;
      event[bookingCard.classType].booked = filteredBooked;
      event[bookingCard.classType].confirmed.push(_id);

      /**
       * Email content
       */
      tableRows = [
        {
          label: "Class Name",
          content: event.details.title,
        },
        {
          label: "Schedule",
          content: `${DateTime.fromJSDate(event.schedule.date)
            .setZone("Asia/Jakarta")
            .toFormat("dd LLL yyyy HH:mm")}`,
        },
        {
          label: "Registration Status",
          content: status.value,
        },
        {
          label: "Seat amount",
          content: bookingCard.seat.toString(),
        },
        {
          label: "Registered participant(s)",
          content: bookingCard.participants.join(", "),
        },
      ];

      message = `Your registration for ${
        event.details.title
      } on ${DateTime.fromJSDate(event.schedule.date)
        .setZone("Asia/Jakarta")
        .toFormat("dd LLL yyyy HH:mm")} has been ${status.value.toLowerCase()}`;

      // move to archive
      if (bookingCard.payment.image) {
        await s3client.send(
          new CopyObjectCommand({
            CopySource: `${bucket}/event/${bookingCard.payment.image}`,
            Bucket: bucketArchive,
            Key: `event/${user.name}-${bookingCard.bookingCode}_${
              bookingCard.seat
            } ${bookingCard.classType} seat_${
              event.details.title
            }_${DateTime.fromJSDate(event.schedule.date).toFormat(
              "yyyy-LL-dd"
            )}-${path.extname(bookingCard.payment.image)}`,
          })
        );

        await s3client.send(
          new DeleteObjectCommand({
            Bucket: bucket,
            Key: `event/${bookingCard.payment.image}`,
          })
        );
      }
      break;
    case EventBookingStatusValue.REJECTED:
      subCategory = SubCategoryValue.REJECTED;
      status.reason ??= "class cancelled.";

      // move to rejected array
      filteredBooked = event[bookingCard.classType].booked.filter(
        (id) => id.toString() != _id.toString()
      ) as Array<Types.ObjectId>;
      event[bookingCard.classType].booked = filteredBooked;
      event[bookingCard.classType].rejected.push(_id);

      /**
       * Email content
       */
      tableRows = [
        {
          label: "Class Name",
          content: event.details.title,
        },
        {
          label: "Schedule",
          content: `${DateTime.fromJSDate(event.schedule.date)
            .setZone("Asia/Jakarta")
            .toFormat("dd LLL yyyy HH:mm")}`,
        },
        {
          label: "Registration Status",
          content: status.value,
        },
        {
          label: "Rejection Reason",
          content: status.reason,
        },
      ];

      message = `Your registration for ${
        event.details.title
      } on ${DateTime.fromJSDate(event.schedule.date)
        .setZone("Asia/Jakarta")
        .toFormat(
          "dd LLL yyyy HH:mm"
        )} has been ${status.value.toLowerCase()} due to ${status.reason}`;

      //delete image
      if (bookingCard.payment.image) {
        await s3client.send(
          new DeleteObjectCommand({
            Bucket: bucket,
            Key: `event/${bookingCard.payment.image}`,
          })
        );
      }
      break;

    default:
      throw new InputException("Invalid action");
  }

  bookingCard.status = {
    ...status,
    lastUpdateOn: new Date(),
  };

  bookingCard.payment.image = "";

  /**Save changes */
  await bookingCard.save();
  await event.save();

  const newMessage = new MessageModel({
    user: bookingCard.user,
    title: `Special Class Registration ${status.value}`,
    message,
  });

  const newLog = new LogModel({
    user: status.updatedBy,
    category: CategoryValue.BOOKING,
    subCategory,
    message: `Special class registration [${bookingCard.bookingCode}_${
      user.name
    } - ${bookingCard.classType}] - ${
      bookingCard.seat
    } seat was ${subCategory.toLowerCase()} by ${updater.name}. ${
      status.reason
    }`,
  });

  const emailParams: EmailParams = {
    identifier: user.email,
    subject: `Special Class Registration ${status.value}`,
    header: `Notification`,
    htmlMessage: formatTable(tableRows),
    plainTextMessage: `Your registration request has been ${status.value}. Please check our web apps for details.`,
  };

  await Promise.all([
    newLog.save(),
    newMessage.save(),
    sendNotificationEmail(emailParams),
  ]);

  return bookingCard;
}

function sanitizeAndTrimParticipants(participants: Array<String>) {
  return participants.map((participant) =>
    validator.escape(participant.trim())
  );
}

@Resolver(EventBookingCard)
export class EventBookingResolver {
  /**
   *
   * @returns all event booking cards
   */
  @Authorized(["ADMIN"])
  @Query(() => [EventBookingCard])
  async eventBookingCards() {
    try {
      return await EventBookingCardModel.find()
        .populate("user", "name")
        .populate("status.updatedBy", "name");
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Query(() => EventBookingCard)
  async eventBookingCard(@Arg("_id") _id: Types.ObjectId) {
    try {
      const bookingCard = await EventBookingCardModel.findById(_id)
        .populate("user", "name")
        .populate("status.updatedBy", "name");

      if (bookingCard.payment.image)
        bookingCard.payment.image = await presignS3Url(
          process.env.AWS_SPECIAL_EVENT + bookingCard.payment.image
        );

      return bookingCard;
    } catch (error) {
      return error;
    }
  }

  @Authorized()
  @Query(() => [EventBookingCard])
  async upcomingEventBookingCardsUser(@Arg("_id") _id: Types.ObjectId) {
    const earlierToday = DateTime.now().startOf("day").toJSDate();
    const urlEvent = process.env.AWS_SPECIAL_EVENT;
    try {
      const result = await EventBookingCardModel.find({
        user: _id,
      })
        .populate<PopulatedDoc<User>>("status.updatedBy", "name")
        .populate<PopulatedDoc<SpecialEvent>>("event");

      const filteredResult = result
        .filter((res) => res.event && res.event.schedule.date > earlierToday)
        .sort(sortEventBookingCardAsc);

      const signedResult = await Promise.all(
        filteredResult.map(async (res) => {
          if (res.payment.image)
            res.payment.image = await presignS3Url(
              urlEvent + res.payment.image
            );
          return res;
        })
      );

      return signedResult;
    } catch (error) {
      return error;
    }
  }

  /**
   *
   * @param input : event _id
   * @returns event booking cards associated with event _id
   */
  @Authorized(["ADMIN"])
  @Query(() => [EventBookingCard])
  async selectedEventBookingCards(@Arg("_id") _id: Types.ObjectId) {
    try {
      const result = await EventBookingCardModel.find({
        event: _id,
      })
        .populate("user", "name")
        .populate("status.updatedBy", "name");

      return await Promise.all(
        result.map(async (bookingCard) => {
          if (bookingCard.payment.image)
            bookingCard.payment.image = await presignS3Url(
              process.env.AWS_SPECIAL_EVENT + bookingCard.payment.image
            );
          return bookingCard;
        })
      );
    } catch (error) {
      return error;
    }
  }

  @Authorized()
  @Mutation(() => EventBookingCard)
  async addEventBookingCard(@Arg("input") input: EventBookingCardInput) {
    try {
      const event = await SpecialEventModel.findById(input.event)
        .populate("online.booked")
        .populate("online.confirmed")
        .populate("online.rejected")
        .populate("offline.booked")
        .populate("offline.confirmed")
        .populate("offline.rejected");
      if (!event) throw new DataException(classError.NOT_FOUND);

      const user = await UserModel.findById(input.user);
      if (!user) throw new DataException(userError.NOT_FOUND);

      const booker = await UserModel.findById(input.booker);
      if (!booker) throw new DataException(userError.NOT_FOUND);

      const paymentMethod = await PaymentMethodModel.findById(
        input.payment.method
      );
      if (!paymentMethod) throw new DataException(paymentMethodError.NOT_FOUND);

      /**
       * Validate input
       */
      if (!input.image && paymentMethod.requireProof)
        throw new InputException(paymentMethodError.REQUIRE_PROOF);

      if (event.status.isVIPOnly && !user.membership.isVIP)
        throw new RuleException(classError.IS_VIP_ONLY);

      /**
       * Validate seat
       */
      if (input.seat < 1)
        throw new InputException(bookingCardError.SEAT_CANNOT_BE_ZERO);

      if (input.seat !== input.participants.length)
        throw new InputException(bookingCardError.SEAT_PARTIPICANT_NO_MATCH);

      if (
        !booker.role.isAdmin &&
        input.seat > event[input.classType].availability
      )
        throw new RuleException(bookingCardError.CLASS_IS_FULL);

      if (
        booker.role.isAdmin &&
        input.seat > event[input.classType].availability + 10
      )
        throw new RuleException(bookingCardError.CLASS_IS_FULL);

      /**
       * Validate time limit
       */

      const timeLimit = DateTime.fromJSDate(event.schedule.date)
        .minus({ hour: event[input.classType].bookingTimeLimit })
        .toJSDate();
      const now = DateTime.now().toJSDate();

      if (now > timeLimit && !booker.role.isAdmin)
        throw new RuleException(bookingCardError.TIMELIMIT_BOOK_EXPIRED);

      const classDate = DateTime.fromJSDate(event.schedule.date)
        .toFormat("yyLLdd")
        .toString();

      let bookingCardCounter = await CounterModel.findOne({
        keyword: "bookingCard",
        prefix: `S-${classDate}`,
      });

      if (!bookingCardCounter) {
        bookingCardCounter = new CounterModel({
          keyword: "bookingCard",
          prefix: `S-${classDate}`,
          counter: 0,
        });
      }

      bookingCardCounter.counter++;

      const doc = new EventBookingCardModel(input);

      doc.bookingCode = bookingCardCounterString(bookingCardCounter);
      doc.participants = sanitizeAndTrimParticipants(input.participants);
      doc.payment.method = paymentMethod.via;
      doc.payment.amount = input.seat * event[input.classType].cost;

      // @ts-ignore
      doc.status.updatedBy = input.booker._id;
      event[input.classType].booked.push(doc._id);

      if (input.image) {
        const newFileName = await uploadToAWS(input.image, "event");
        doc.payment.image = newFileName;
      }

      await doc.save();
      await bookingCardCounter.save();
      await event.save();

      return doc;
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Mutation(() => EventBookingCard)
  async updateEventBookingRequestStatus(
    @Args()
    { _id, status }: EventStatusUpdateArgs
  ) {
    try {
      return await updateRegistrationStatus(_id, status);
    } catch (error) {
      return error;
    }
  }

  // Delete image mutation
  @Authorized(["ADMIN"])
  @Mutation(() => EventBookingCard)
  async deleteEventBookingPaymentImage(@Arg("_id") _id: Types.ObjectId) {
    try {
      const bookingCard = await EventBookingCardModel.findById(_id);
      if (!bookingCard) throw new DataException(bookingCardError.NOT_FOUND);

      await s3client.send(
        new DeleteObjectCommand({
          Bucket: bucket,
          Key: `event/${bookingCard.payment.image}`,
        })
      );

      bookingCard.payment.image = "";

      return await bookingCard.save();
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Mutation(() => EventBookingCard)
  async updateSpecialEventBookingParticipants(
    @Args()
    { _id, participants }: EventParticipantsUpdateArgs
  ) {
    try {
      const bookingCard = await EventBookingCardModel.findById(_id);
      if (!bookingCard) throw new DataException(bookingCardError.NOT_FOUND);

      if (bookingCard.seat !== participants.length)
        throw new InputException(bookingCardError.SEAT_PARTIPICANT_NO_MATCH);

      bookingCard.participants = sanitizeAndTrimParticipants(participants);

      return await bookingCard.save();
    } catch (error) {
      return error;
    }
  }
}
