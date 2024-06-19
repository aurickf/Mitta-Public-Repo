import { model, Model, models, Schema, Types } from "mongoose";
import { RegularClass } from "src/generated/graphql";

const RegularClassSchema = new Schema<RegularClass>({
  recurrenceId: {
    type: String,
  },

  instructors: {
    type: [Types.ObjectId],
    ref: "User",
    required: true,
  },

  details: {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    level: {
      type: Types.ObjectId,
      ref: "Level",
      required: true,
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
      ref: "Booking_Card",
    },

    bookingTimeLimit: {
      type: Number,
      default: 1,
    },

    cancelTimeLimit: {
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
      ref: "Booking_Card",
    },

    bookingTimeLimit: {
      type: Number,
      default: 4,
    },

    cancelTimeLimit: {
      type: Number,
      default: 24,
    },

    cost: {
      type: Number,
      default: 100,
    },
  },
});

RegularClassSchema.set("toJSON", { virtuals: true });
RegularClassSchema.set("toObject", { virtuals: true });

RegularClassSchema.virtual("online.availability").get(function () {
  return this.online.capacity - this.online.booked.length;
});

RegularClassSchema.virtual("offline.availability").get(function () {
  return this.offline.capacity - this.offline.booked.length;
});

export const RegularClassModel =
  (models.Regular_Class as Model<RegularClass>) ||
  model("Regular_Class", RegularClassSchema);
