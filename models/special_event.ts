import { model, Model, models, Schema, Types } from "mongoose";
import { SpecialEvent } from "src/generated/graphql";

const SpecialEventSchema = new Schema<SpecialEvent>({
  recurrenceId: {
    type: String,
  },

  instructors: [
    {
      name: {
        type: String,
        required: true,
      },
    },
  ],

  details: {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    tags: {
      type: [String],
    },
  },

  zoom: {
    meetingId: {
      type: String,
    },

    password: {
      type: String,
    },

    joinUrl: {
      type: String,
    },
  },

  schedule: {
    date: {
      type: Date,
      default: new Date(),
    },

    isAllDay: {
      type: Boolean,
      default: false,
    },

    duration: {
      type: Number,
      default: 100,
    },

    rString: {
      type: String,
      default: null,
    },
  },

  status: {
    isRunning: {
      type: Boolean,
      default: null,
    },

    isPublished: {
      type: Boolean,
      default: false,
    },

    isVIPOnly: {
      type: Boolean,
      default: false,
    },
  },

  online: {
    capacity: {
      type: Number,
      default: 0,
    },

    booked: {
      type: [Types.ObjectId],
      ref: "Event_Booking_Card",
    },

    confirmed: {
      type: [Types.ObjectId],
      ref: "Event_Booking_Card",
    },

    rejected: {
      type: [Types.ObjectId],
      ref: "Event_Booking_Card",
    },

    bookingTimeLimit: {
      type: Number,
      default: 1,
    },

    cost: {
      type: Number,
      default: 100,
    },
  },

  offline: {
    capacity: {
      type: Number,
      default: 0,
    },

    booked: {
      type: [Types.ObjectId],
      ref: "Event_Booking_Card",
    },

    confirmed: {
      type: [Types.ObjectId],
      ref: "Event_Booking_Card",
    },

    rejected: {
      type: [Types.ObjectId],
      ref: "Event_Booking_Card",
    },

    bookingTimeLimit: {
      type: Number,
      default: 4,
    },

    cost: {
      type: Number,
      default: 100,
    },
  },
});

SpecialEventSchema.virtual("online.bookedSeat").get(function () {
  let onlineBookedSeat = 0;
  this.online.booked.forEach((booking) => (onlineBookedSeat += booking.seat));

  return onlineBookedSeat;
});

SpecialEventSchema.virtual("online.confirmedSeat").get(function () {
  let onlineConfirmedSeat = 0;
  this.online.confirmed.forEach(
    (booking) => (onlineConfirmedSeat += booking.seat)
  );

  return onlineConfirmedSeat;
});

SpecialEventSchema.virtual("online.rejectedSeat").get(function () {
  let onlineRejectedSeat = 0;
  this.online.rejected.forEach(
    (booking) => (onlineRejectedSeat += booking.seat)
  );

  return onlineRejectedSeat;
});

SpecialEventSchema.virtual("offline.bookedSeat").get(function () {
  let offlineBookedSeat = 0;
  this.offline.booked.forEach((booking) => (offlineBookedSeat += booking.seat));

  return offlineBookedSeat;
});

SpecialEventSchema.virtual("offline.confirmedSeat").get(function () {
  let offlineConfirmedSeat = 0;
  this.offline.confirmed.forEach(
    (booking) => (offlineConfirmedSeat += booking.seat)
  );

  return offlineConfirmedSeat;
});

SpecialEventSchema.virtual("offline.rejectedSeat").get(function () {
  let offlineRejectedSeat = 0;
  this.offline.rejected.forEach(
    (booking) => (offlineRejectedSeat += booking.seat)
  );

  return offlineRejectedSeat;
});

SpecialEventSchema.virtual("online.availability").get(function () {
  return (
    this.online.capacity - (this.online.bookedSeat + this.online.confirmedSeat)
  );
});

SpecialEventSchema.virtual("offline.availability").get(function () {
  return (
    this.offline.capacity -
    (this.offline.bookedSeat + this.offline.confirmedSeat)
  );
});

SpecialEventSchema.set("toJSON", { virtuals: true });
SpecialEventSchema.set("toObject", { virtuals: true });

export const SpecialEventModel =
  (models.Special_Event as Model<SpecialEvent>) ||
  model("Special_Event", SpecialEventSchema);
