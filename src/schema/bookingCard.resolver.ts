import {
  BookingCardModel,
  CounterModel,
  LogModel,
  MembershipModel,
  MessageModel,
  RegularClassModel,
  UserModel,
} from "@/models/index";
import { bookingCardCounterString } from "@/utils/counter";
import {
  DataException,
  RuleException,
  bookingCardError,
  classError,
  membershipError,
  userError,
} from "@/utils/error_message";
import { formatTable, sendNotificationEmail } from "@/utils/mailer";
import { sortBookingCardAsc, sortBookingCardDesc } from "@/utils/sort";
import { DateTime } from "luxon";
import { ObjectId } from "mongodb";
import { HydratedDocument, PopulatedDoc, Types } from "mongoose";
import { Membership, RegularClass, User } from "src/generated/graphql";
import { BookingStatusValue, ClassTypeValue } from "src/schema/bookingCard";
import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import { BookingCard, BookingCardInput } from "./bookingCard";
import { CategoryValue, SubCategoryValue } from "./log";

type TUpdateMembershipAction = "confirm" | "cancel";

export const cancelBookingCard = async ({
  _id,
  updatedBy,
  bookingStatus,
}: {
  _id: Types.ObjectId;
  updatedBy: Types.ObjectId;
  bookingStatus: BookingStatusValue;
}) => {
  try {
    if (
      ![
        BookingStatusValue.BOOKING_CANCELLED,
        BookingStatusValue.CLASS_CANCELLED,
      ].some((status) => status === bookingStatus)
    )
      throw new DataException(bookingCardError.INVALID_BOOKING_STATUS);

    const bookingCard: HydratedDocument<BookingCard> =
      await BookingCardModel.findById(_id)
        .populate<PopulatedDoc<RegularClass>>("regularClass")
        .populate<PopulatedDoc<User>>("user");
    if (!bookingCard) throw new DataException(bookingCardError.NOT_FOUND);

    /**
     * Stop process if booking card already cancelled
     */
    if (
      bookingCard.status.value === BookingStatusValue.BOOKING_CANCELLED ||
      bookingCard.status.value === BookingStatusValue.CLASS_CANCELLED
    )
      return bookingCard;

    // Validate time limit if is not being cancelled by admin
    const updater = await UserModel.findById(updatedBy);
    if (!updater) throw new DataException(bookingCardError.UPDATER_NOT_FOUND);

    /**
     * Type guard
     * To make sure regular class and user is populated
     */
    if (
      bookingCard.regularClass instanceof RegularClassModel &&
      bookingCard.user instanceof UserModel
    ) {
      if (!updater.role.isAdmin) {
        const now = DateTime.now().toJSDate();

        const cancelTimeLimit = getCancelTimeLimit(bookingCard.regularClass);

        if (
          (bookingCard.classType === ClassTypeValue.OFFLINE &&
            cancelTimeLimit.offline < now) ||
          (bookingCard.classType === ClassTypeValue.ONLINE &&
            cancelTimeLimit.online < now)
        )
          throw new RuleException(bookingCardError.TIMELIMIT_CANCEL_EXPIRED);
      }

      // Update booking card status
      bookingCard.status = {
        value: bookingStatus,
        updatedBy,
        lastUpdateOn: new Date(),
      };

      let title: String, message: String;

      switch (bookingStatus) {
        case BookingStatusValue.CLASS_CANCELLED:
          title = `Class Cancelled - ${
            bookingCard.regularClass.details.title
          } - ${DateTime.fromJSDate(
            bookingCard.regularClass.schedule.date
          ).toFormat("dd LLLL yyyy")}`;
          message = `This class has been cancelled and your balance has been restored. We apologize for any inconvenience caused.`;
          break;

        /**
         * Diff message cancelled by user and admin
         */
        case BookingStatusValue.BOOKING_CANCELLED:
          title = `Reservation Cancelled - ${
            bookingCard.regularClass.details.title
          } - ${DateTime.fromJSDate(
            bookingCard.regularClass.schedule.date
          ).toFormat("dd LLLL yyyy")}`;

          if (bookingCard.user._id.toString() === updatedBy.toString())
            message = `Your cancellation request for this class is confirmed.`;
          else
            message = `Your booking has been cancelled by our administrator due to administrative reason, your balance has been restored. We apologize for any inconvenience caused.`;

          break;

        default:
          throw new DataException(
            "Internal Server Error - Invalid booking status"
          );
      }

      /**
       * Save changes to booking card, membership and respective class
       */
      await bookingCard.save();
      await updateMembership(
        "cancel",
        _id,
        bookingCard.user.membership.latest as Types.ObjectId
      );
      await removeBookingFromClass(
        _id,
        bookingCard.regularClass._id,
        bookingCard.classType
      );

      /**
       * Email Notification
       */
      const tableRows = [
        {
          label: "Class Name",
          content: `${bookingCard.regularClass.details.title}`,
        },
        {
          label: "Schedule",
          content: `${DateTime.fromJSDate(
            bookingCard.regularClass.schedule.date
          )
            .setZone("Asia/Jakarta")
            .toFormat("dd LLL yyyy, HH:mm")} - ${DateTime.fromJSDate(
            bookingCard.regularClass.schedule.date
          )
            .setZone("Asia/Jakarta")
            .plus({ minutes: bookingCard.regularClass.schedule.duration })
            .toFormat("HH:mm")}`,
        },
        { label: "", content: "Jakarta time (UTC+7)" },
        { label: "Booking Code", content: `${bookingCard.bookingCode}` },
        { label: "Reason", content: `${message}` },
      ];

      const emailParams = {
        identifier: bookingCard.user.email,
        subject: `Your booking on ${process.env.NEXT_PUBLIC_STUDIO_NAME} has been cancelled`,
        header: `Cancellation Notification`,
        htmlMessage: formatTable(tableRows),
        plainTextMessage: `Your booking ${bookingCard.bookingCode} for ${
          bookingCard.regularClass.details.title
        } on ${DateTime.fromJSDate(bookingCard.regularClass.schedule.date)
          .setZone("Asia/Jakarta")
          .toFormat("dd LLL yyyy, HH:mm")} - ${DateTime.fromJSDate(
          bookingCard.regularClass.schedule.date
        )
          .setZone("Asia/Jakarta")
          .plus({ minutes: bookingCard.regularClass.schedule.duration })
          .toFormat(
            "HH:mm"
          )} has been cancelled. Cancellation reason : ${bookingStatus}`,
      };

      /**
       * In-App Notification Message
       */
      const newMessage = new MessageModel({
        user: bookingCard.user,
        title,
        message,
      });

      const newLog = new LogModel({
        user: bookingCard.user._id,
        category: CategoryValue.BOOKING,
        subCategory: SubCategoryValue.CANCELLED,
        message: `[${bookingCard.bookingCode}] - ${
          bookingCard.classType
        } seat. ${
          bookingCard.regularClass.details.title
        } - ${DateTime.fromJSDate(
          bookingCard.regularClass.schedule.date
        ).toFormat("dd LLL yyyy")}. ${
          bookingStatus[0].toUpperCase() +
          bookingStatus.substring(1).toLowerCase()
        } by ${updater.name}. Refunded points : ${bookingCard.cost}`,
      });

      await Promise.all([
        sendNotificationEmail(emailParams),
        newMessage.save(),
        newLog.save(),
      ]);

      return bookingCard;
    }
  } catch (error) {
    return error;
  }
};

export const confirmBookingCard = async ({
  _id,
  updatedBy,
}: {
  _id: Types.ObjectId;
  updatedBy: Types.ObjectId;
}) => {
  try {
    const bookingCard: HydratedDocument<BookingCard> =
      await BookingCardModel.findOne({ _id })
        .populate<PopulatedDoc<RegularClass>>("regularClass")
        .populate<PopulatedDoc<User>>("user");

    /**
     * Stop process if booking card already confirmed
     */
    if (bookingCard.status.value === BookingStatusValue.CONFIRMED)
      return bookingCard;

    if (!bookingCard) throw new DataException(bookingCardError.NOT_FOUND);

    const updater: HydratedDocument<User> = await UserModel.findById(updatedBy);
    if (!updater) throw new DataException(userError.NOT_FOUND);

    const regularClass = await RegularClassModel.findById(
      bookingCard.regularClass
    );
    if (!regularClass) throw new DataException(classError.NOT_FOUND);

    /**
     * Type guard
     */
    if (bookingCard.user instanceof UserModel) {
      // Update booking card data
      bookingCard.status = {
        value: BookingStatusValue.CONFIRMED,
        updatedBy,
        lastUpdateOn: new Date(),
      };

      await bookingCard.save();
      await updateMembership(
        "confirm",
        _id,
        bookingCard.user.membership.latest as Types.ObjectId
      );

      const newLog = new LogModel({
        user: bookingCard.user._id,
        category: CategoryValue.BOOKING,
        subCategory: SubCategoryValue.CONFIRMED,
        message: `[${bookingCard.bookingCode}] - ${bookingCard.classType}. ${
          regularClass.details.title
        } - ${DateTime.fromJSDate(regularClass.schedule.date).toFormat(
          "dd LLL yyyy"
        )}. Confirmed by ${updater.name}.`,
      });

      await newLog.save();

      return bookingCard;
    }
  } catch (error) {
    return error;
  }
};

const getBookingTimeLimit = (regularClass: RegularClass) => {
  return {
    offline: DateTime.fromJSDate(regularClass.schedule.date)
      .minus({ hour: regularClass.offline.bookingTimeLimit })
      .toJSDate(),
    online: DateTime.fromJSDate(regularClass.schedule.date)
      .minus({
        hour: regularClass.online.bookingTimeLimit,
      })
      .toJSDate(),
  };
};

const getCancelTimeLimit = (regularClass: RegularClass) => {
  return {
    offline: DateTime.fromJSDate(regularClass.schedule.date)
      .minus({ hour: regularClass.offline.cancelTimeLimit })
      .toJSDate(),
    online: DateTime.fromJSDate(regularClass.schedule.date)
      .minus({
        hour: regularClass.online.cancelTimeLimit,
      })
      .toJSDate(),
  };
};

const updateMembership = async (
  action: TUpdateMembershipAction,
  bookingId: Types.ObjectId,
  membershipId: Types.ObjectId
) => {
  const membership: HydratedDocument<
    Membership,
    { confirmed: Types.ObjectId[]; cancelled: Types.ObjectId[] }
  > = await MembershipModel.findById(membershipId);
  if (!membership) throw new DataException(membershipError.NOT_FOUND);

  const filteredMembership = membership.booked.filter(
    (id) => id.toString() !== bookingId.toString()
  );

  membership.booked = filteredMembership;

  if (action === "confirm") membership.confirmed.push(bookingId);
  if (action === "cancel") membership.cancelled.push(bookingId);

  return await membership.save();
};

const removeBookingFromClass = async (
  bookingId: Types.ObjectId,
  regularClassId: Types.ObjectId,
  classType: string
) => {
  const regularClass = await RegularClassModel.findById(regularClassId);
  if (!regularClass) throw new DataException(classError.NOT_FOUND);

  const filteredClass = regularClass[classType].booked.filter(
    (id) => id.toString() != bookingId
  );

  regularClass[classType].booked = filteredClass;
  return regularClass.save();
};

@Resolver(BookingCard)
export class BookingCardResolver {
  @Authorized(["ADMIN"])
  @Query(() => [BookingCard])
  async bookingCards() {
    try {
      return await BookingCardModel.find()
        .populate({
          path: "regularClass",
          select: "details schedule status online offline",
          populate: {
            path: "instructors",
            select: "name image",
          },
        })
        .populate("user", "name image")
        .populate("booker", "name image")
        .populate("status.updatedBy", "name image")
        .sort({
          bookingCode: -1,
        });
    } catch (error) {
      return error;
    }
  }

  @Authorized()
  @Query(() => BookingCard)
  async bookingCard(@Arg("_id") _id: ObjectId) {
    try {
      return await BookingCardModel.findById(_id)
        .populate("regularClass")
        .populate("user");
    } catch (error) {
      return error;
    }
  }
  /**
   * Return only future booking with status is NOT cancelled
   * sort from early to latest
   * Use to show upcoming booking
   * */
  @Authorized()
  @Query(() => [BookingCard])
  async activeBookings(@Arg("_id") _id: ObjectId) {
    try {
      const result = await BookingCardModel.find({
        user: _id,
        "status.value": BookingStatusValue.SCHEDULED,
      })
        .populate({
          path: "regularClass",
          select: "details schedule status online offline zoom",
          populate: {
            path: "instructors",
            select: "name image",
          },
        })
        .populate("user", "name image")
        .sort({ "regularClass.schedule.date": 1 });

      return result
        .filter(
          (bookingCard) =>
            bookingCard.regularClass &&
            bookingCard.regularClass.schedule.date >
              DateTime.now().startOf("day").toJSDate()
        )
        .sort(sortBookingCardAsc);
    } catch (error) {
      return error;
    }
  }

  /**
   * Return all bookings with condition class is NOT deleted and
   * sort from newer to older
   * Use to show booking history
   */
  @Authorized()
  @Query(() => [BookingCard])
  async bookingCardsUser(@Arg("_id") _id: ObjectId) {
    try {
      const result = await BookingCardModel.find({ user: _id })
        .populate({
          path: "regularClass",
          select: "details schedule status online offline",
          populate: {
            path: "instructors",
            select: "name image",
          },
        })
        .populate("user", "name image");

      return result
        .filter((bookingCard) => bookingCard.regularClass)
        .sort(sortBookingCardDesc);
    } catch (error) {
      return error;
    }
  }

  @Authorized()
  @Mutation(() => [BookingCard])
  async addBookingCard(@Arg("input") input: BookingCardInput) {
    try {
      const classType = input.classType.toLowerCase();

      const regularClass = await RegularClassModel.findById(input.regularClass)
        .populate("online.booked")
        .populate("offline.booked");
      if (!regularClass) throw new DataException(classError.NOT_FOUND);

      const user = await UserModel.findById(input.user);
      if (!user) throw new DataException(userError.NOT_FOUND);

      const updater = await UserModel.findById(input.status.updatedBy);
      if (!updater) throw new DataException(userError.NOT_FOUND);

      const membership: HydratedDocument<Membership> =
        await MembershipModel.findById(user.membership.latest)
          .populate<PopulatedDoc<BookingCard>>("booked")
          .populate<PopulatedDoc<BookingCard>>("confirmed");
      if (!membership) throw new DataException(membershipError.NOT_FOUND);

      const now = DateTime.now();

      const bookingTimeLimit = getBookingTimeLimit(regularClass);

      // Class validation
      // Bypass if done by admin
      if (
        regularClass.status.isRunning === true &&
        updater.role.isAdmin !== true
      )
        throw new RuleException(classError.IS_CLOSED);

      if (regularClass.status.isRunning === false)
        throw new RuleException(classError.IS_CANCELLED);
      if (regularClass.status.isVIPOnly && !user.membership.isVIP)
        throw new RuleException(classError.IS_VIP_ONLY);
      if (regularClass[classType].availability < input.seat)
        throw new RuleException(bookingCardError.CLASS_IS_FULL);

      // Membership validation
      if (membership.balance.validUntil < now.toJSDate())
        throw new RuleException(membershipError.IS_EXPIRED);

      if (
        membership.balance.available <
        input.seat * regularClass[`${input.classType}`].cost
      )
        throw new RuleException(membershipError.INSUFFICIENT_BALANCE);

      // This request is not done by admin thus timelimits n nonVIPs validation take place
      if (!updater.role.isAdmin) {
        // Booking time limit validation
        if (
          (classType === "offline" &&
            bookingTimeLimit.offline < now.toJSDate()) ||
          (classType === "online" && bookingTimeLimit.online < now.toJSDate())
        )
          throw new RuleException(bookingCardError.TIMELIMIT_BOOK_EXPIRED);

        // Non-VIP user validations
        if (!user.membership.isVIP) {
          if (input.seat > 1)
            throw new RuleException(bookingCardError.NO_MULTIPLE_SEAT);

          const bookingCard = await BookingCardModel.findOne({
            regularClass: input.regularClass,
            user: input.user,
            "status.value": BookingStatusValue.SCHEDULED,
          });

          if (bookingCard)
            throw new RuleException(bookingCardError.NO_MULTIPLE_BOOK);
        }
      }

      const classDate = DateTime.fromJSDate(regularClass.schedule.date)
        .toFormat("yyLLdd")
        .toString();

      let bookingCardCounter = await CounterModel.findOne({
        keyword: "bookingCard",
        prefix: classDate,
      });

      if (!bookingCardCounter) {
        bookingCardCounter = new CounterModel({
          keyword: "bookingCard",
          prefix: classDate,
          counter: 0,
        });
      }

      // Start loop - Create new booking card(s)
      let newBookings = [];
      let newBookingCodes = [];

      for (let i = 0; i < input.seat; i++) {
        bookingCardCounter.counter++;

        const newBookingCardInput = {
          regularClass: input.regularClass,
          user: input.user,
          booker: input.booker,
          classType: input.classType,
          membership: membership._id,
          cost: regularClass[`${input.classType}`].cost,
          bookingCode: bookingCardCounterString(bookingCardCounter),
        };

        const newBookingCard = new BookingCardModel(newBookingCardInput);

        await newBookingCard.save();
        await bookingCardCounter.save();

        newBookingCodes.push(newBookingCard.bookingCode);

        // push booking code to array
        newBookings.push(newBookingCard);

        // push booking card to membership
        membership.booked.push(newBookingCard._id);

        // push booking card to class
        if (classType === "online")
          regularClass.online.booked.push(newBookingCard._id);
        if (classType === "offline")
          regularClass.offline.booked.push(newBookingCard._id);
      }
      // End loop

      // Save after push is done
      await membership.save();
      await regularClass.save();

      const newLog = new LogModel({
        user: input.user,
        category: CategoryValue.BOOKING,
        subCategory: SubCategoryValue.NEW,
        message: `[${newBookingCodes.join(", ")}] - ${
          newBookings.length
        } ${classType} seat. ${
          regularClass.details.title
        } - ${DateTime.fromJSDate(regularClass.schedule.date).toFormat(
          "dd LLL yyyy"
        )}. Points spent : ${
          input.seat * regularClass[`${input.classType}`].cost
        }`,
      });
      await newLog.save();

      return newBookings;
    } catch (error) {
      return error;
    }
  }

  @Authorized()
  @Mutation(() => BookingCard)
  public async cancelBookingCard(
    @Arg("_id") _id: Types.ObjectId,
    @Arg("updatedBy") updatedBy: Types.ObjectId,
    @Arg("bookingStatus") bookingStatus: string
  ) {
    // @ts-ignore
    return await cancelBookingCard({ _id, updatedBy, bookingStatus });
  }
}
