import {
  BookingCardModel,
  EventBookingCardModel,
  MembershipModel,
  RegularClassModel,
} from "@/models/index";
import { DateTime } from "luxon";
import { ObjectId } from "mongodb";
import { Arg, Authorized, Query, Resolver } from "type-graphql";
import { BookingReport } from "./report";

/**
 * conditional check on input time frame
 *
 * @param timeFrame
 * @returns
 */
const switchTimeFrame = (timeFrame) => {
  const now = DateTime.now();

  const thisYear = now.year;
  const thisMonth = now.month;
  const thisWeek = now.weekNumber;

  switch (timeFrame) {
    case "allTime":
      return {
        $match: {},
      };
    case "thisYear":
      return {
        $match: {
          year: thisYear,
        },
      };
    case "thisMonth":
      return {
        $match: {
          month: thisMonth,
        },
      };
    case "thisWeek":
      return {
        $match: {
          week: thisWeek,
        },
      };
    case "lastYear":
      return {
        $match: {
          year: thisYear - 1,
        },
      };
    case "lastMonth":
      const _lastMonth = now.minus({ month: 1 });

      return {
        $match: {
          month: _lastMonth.month,
          year: _lastMonth.year,
        },
      };
    case "lastWeek": {
      const _lastWeek = now.minus({ week: 1 });
      return {
        $match: {
          week: _lastWeek.weekNumber,
          year: _lastWeek.year,
        },
      };
    }
    case "past3Month": {
      return {
        $match: {
          fullDate: {
            $gte: now.minus({ month: 3 }).toJSDate(),
          },
        },
      };
    }
    case "past6Month": {
      return {
        $match: {
          fullDate: {
            $gte: now.minus({ month: 6 }).toJSDate(),
          },
        },
      };
    }
    case "past12Month": {
      return {
        $match: {
          fullDate: {
            $gte: now.minus({ month: 12 }).toJSDate(),
          },
        },
      };
    }

    default:
      break;
  }
};

/**
 *  Deconstruct regular class schedule to different fields
 */
const addScheduleFieldToBooking = {
  $addFields: {
    year: { $year: { date: "$regularClass.schedule.date" } },
    month: { $month: { date: "$regularClass.schedule.date" } },
    date: { $dayOfMonth: { date: "$regularClass.schedule.date" } },
    week: { $isoWeek: { date: "$regularClass.schedule.date" } },
    fullDate: "$regularClass.schedule.date",
  },
};
/**
 *  Deconstruct event schedule to different fields
 */
const addEventScheduleFieldToBooking = {
  $addFields: {
    year: { $year: { date: "$event.schedule.date" } },
    month: { $month: { date: "$event.schedule.date" } },
    date: { $dayOfMonth: { date: "$event.schedule.date" } },
    week: { $isoWeek: { date: "$event.schedule.date" } },
    fullDate: "$event.schedule.date",
  },
};

/**
 *  Deconstruct regular class schedule to different fields
 */
const addScheduleFieldToClass = {
  $addFields: {
    year: { $year: { date: "$schedule.date" } },
    month: { $month: { date: "$schedule.date" } },
    date: { $dayOfMonth: { date: "$schedule.date" } },
    week: { $isoWeek: { date: "$schedule.date" } },
    fullDate: "$schedule.date",
  },
};
/**
 * Deconstruct membership payment details
 */
const addScheduleFieldToMembership = {
  $addFields: {
    year: { $year: { date: "$payment.date" } },
    month: { $month: { date: "$payment.date" } },
    date: { $dayOfMonth: { date: "$payment.date" } },
    week: { $isoWeek: { date: "$payment.date" } },
    fullDate: "$payment.date",
  },
};

/**
 * Group by class type
 */
const groupByClassTypeWeeklyAndSumSeat = {
  $group: {
    _id: {
      classType: "$classType",
      week: "$week",
    },
    totalSeat: { $sum: "$seat" },
    count: { $count: {} },
  },
};
/**
 * Group by class type and week number
 */
const groupByClassTypeWeekly = {
  $group: {
    _id: {
      classType: "$classType",
      week: "$week",
    },
    count: {
      $count: {},
    },
    totalCost: {
      $sum: "$cost",
    },
  },
};
/**
 * Group by instructor name
 */
const groupByInstructor = {
  $group: {
    _id: {
      instructor: "$instructor.name",
    },
    totalCost: { $sum: "$cost" },
  },
};
/**
 * Group by instructor name and class status
 */
const groupByInstructorAndStatus = {
  $group: {
    _id: {
      instructor: "$instructor.name",
      status: "$status.isRunning",
    },
    count: { $count: {} },
  },
};
/**
 * Group by user name
 */
const groupByUser = {
  $group: {
    _id: {
      user: "$user.name",
    },
    totalCost: {
      $sum: "$cost",
    },
  },
};

const groupMembershipByUser = {
  $group: {
    _id: {
      user: "$user.name",
    },
    totalCost: { $sum: "$payment.amount" },
  },
};

/**
 * Group by class type (Offline or Online)
 * and
 * booking status (Confirmed, Scheduled, Booking Cancelled, Class Cancelled)
 */
const groupByClassTypeAndBookingStatus = {
  $group: {
    _id: {
      classType: "$classType",
      status: "$status.value",
    },
    count: { $count: {} },
  },
};

/**
 * Lookup regular class field
 * MDL equivalent to .populate("regularClass")
 */
const lookupRegularClass = {
  $lookup: {
    from: "regular_classes",
    localField: "regularClass",
    foreignField: "_id",
    pipeline: [
      {
        $project: {
          _id: 0,
          "details.title": 1,
          "schedule.date": 1,
          instructors: 1,
        },
      },
    ],
    as: "regularClass",
  },
};
/**
 * Lookup event field
 * MDL equivalent to .populate("event")
 */
const lookupEvent = {
  $lookup: {
    from: "special_events",
    localField: "event",
    foreignField: "_id",
    pipeline: [
      {
        $project: {
          _id: 0,
          "details.title": 1,
          "schedule.date": 1,
        },
      },
    ],
    as: "event",
  },
};

/**
 * Lookup instructor field
 * MDL equivalent to .populate("regularClass.instructors")
 */
const lookupInstructorFromBooking = {
  $lookup: {
    from: "users",
    localField: "regularClass.instructors",
    foreignField: "_id",
    pipeline: [
      {
        $project: {
          _id: 0,
          name: 1,
          image: 1,
        },
      },
    ],
    as: "instructor",
  },
};
/**
 * Lookup instructor field
 * MDL equivalent to .populate("regularClass.instructors")
 */
const lookupInstructorFromClass = {
  $lookup: {
    from: "users",
    localField: "instructors",
    foreignField: "_id",
    pipeline: [
      {
        $project: {
          _id: 1,
          name: 1,
          image: 1,
        },
      },
    ],
    as: "instructor",
  },
};
/**
 * Lookup user field
 * MQL equivalent to .populate("user")
 */
const lookupUser = {
  $lookup: {
    from: "users",
    localField: "user",
    foreignField: "_id",
    pipeline: [
      {
        $project: {
          _id: 0,
          name: 1,
          image: 1,
        },
      },
    ],
    as: "user",
  },
};
/**
 * Exclude user, booker, membership, status last updated and status updated by
 */
const projectSimpleBookingCard = {
  $project: {
    booker: 0,
    membership: 0,
    "status.lastUpdateOn": 0,
    "status.updatedBy": 0,
  },
};
/**
 * Generate regular class object from the array result of lookup
 */
const unwindRegularClass = {
  $unwind: {
    path: "$regularClass",
    preserveNullAndEmptyArrays: false,
  },
};
/**
 * Generate special class object from the array result of lookup
 */
const unwindEvent = {
  $unwind: {
    path: "$event",
    preserveNullAndEmptyArrays: false,
  },
};

/**
 * Generate regular class object from the array result of lookup
 */
const unwindUser = {
  $unwind: {
    path: "$user",
    preserveNullAndEmptyArrays: false,
  },
};
/**
 *
 */
const unwindInstructor = {
  $unwind: {
    path: "$instructor",
    preserveNullAndEmptyArrays: false,
  },
};
@Resolver()
export class BookingCardReportResolver {
  @Authorized(["ADMIN"])
  @Query(() => [BookingReport])
  async overallBookingReport() {
    try {
      const result = await BookingCardModel.aggregate([
        projectSimpleBookingCard,
        groupByClassTypeAndBookingStatus,
        {
          $sort: {
            "_id.status": 1,
            "_id.classType": 1,
          },
        },
      ]);
      return result;
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Query(() => [BookingReport])
  async weeklyBookingReport(
    @Arg("bookingStatus") bookingStatus: string,
    @Arg("timeFrame") timeFrame: string
  ) {
    try {
      const matchTimeFrame = switchTimeFrame(timeFrame);
      const result = await BookingCardModel.aggregate([
        {
          $match: {
            "status.value": bookingStatus,
          },
        },
        lookupRegularClass,
        unwindRegularClass,
        addScheduleFieldToBooking,
        matchTimeFrame,
        projectSimpleBookingCard,
        groupByClassTypeWeekly,
        {
          $sort: {
            "_id.week": 1,
          },
        },
      ]);

      return result;
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Query(() => [BookingReport])
  async topUserReport(
    @Arg("bookingStatus") bookingStatus: string,
    @Arg("timeFrame") timeFrame: string
  ) {
    try {
      const matchTimeFrame = switchTimeFrame(timeFrame);

      const result = await BookingCardModel.aggregate([
        {
          $match: {
            "status.value": bookingStatus,
          },
        },
        lookupUser,
        unwindUser,
        lookupRegularClass,
        unwindRegularClass,
        addScheduleFieldToBooking,
        projectSimpleBookingCard,
        matchTimeFrame,
        groupByUser,
        {
          $sort: {
            totalCost: -1,
          },
        },
        {
          $limit: 20,
        },
      ]);

      return result;
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Query(() => [BookingReport])
  async topUserMembershipReport(@Arg("timeFrame") timeFrame: string) {
    try {
      const matchTimeFrame = switchTimeFrame(timeFrame);

      const result = await MembershipModel.aggregate([
        {
          $match: {
            "verified.isVerified": true,
          },
        },
        lookupUser,
        unwindUser,
        addScheduleFieldToMembership,
        matchTimeFrame,
        groupMembershipByUser,
        {
          $sort: {
            totalCost: -1,
          },
        },
        {
          $limit: 20,
        },
      ]);
      return result;
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Query(() => [BookingReport])
  async topInstructorReport(
    @Arg("bookingStatus") bookingStatus: string,
    @Arg("timeFrame") timeFrame: string
  ) {
    const matchTimeFrame = switchTimeFrame(timeFrame);
    try {
      const result = await BookingCardModel.aggregate([
        {
          $match: {
            "status.value": bookingStatus,
          },
        },
        lookupRegularClass,
        unwindRegularClass,
        lookupInstructorFromBooking,
        unwindInstructor,
        addScheduleFieldToBooking,
        projectSimpleBookingCard,
        matchTimeFrame,
        groupByInstructor,
        {
          $sort: {
            totalCost: -1,
          },
        },
      ]);
      return result;
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Query(() => [BookingReport])
  async instructorPerformanceReport(
    @Arg("instructorId") instructorId: ObjectId,
    @Arg("timeFrame") timeFrame: string
  ) {
    try {
      const matchTimeFrame = switchTimeFrame(timeFrame);

      const result = await RegularClassModel.aggregate([
        addScheduleFieldToClass,
        matchTimeFrame,
        lookupInstructorFromClass,
        unwindInstructor,
        {
          $match: {
            "instructor._id": new ObjectId(instructorId),
          },
        },
        groupByInstructorAndStatus,
        {
          $sort: {
            "_id.status": 1,
          },
        },
      ]);
      return result;
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Query(() => [BookingReport])
  async specialClassReport(@Arg("timeFrame") timeFrame: string) {
    try {
      const matchTimeFrame = switchTimeFrame(timeFrame);

      const result = await EventBookingCardModel.aggregate([
        {
          $match: {
            "status.value": "Confirmed",
          },
        },
        lookupEvent,
        unwindEvent,
        addEventScheduleFieldToBooking,
        matchTimeFrame,
        groupByClassTypeWeeklyAndSumSeat,
      ]);

      return result;
    } catch (error) {
      return error;
    }
  }
}
