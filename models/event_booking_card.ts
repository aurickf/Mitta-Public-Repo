import { model, Model, models, Schema, Types } from "mongoose";
import { EventBookingCard } from "src/generated/graphql";

const EventBookingCardSchema = new Schema<EventBookingCard>(
  {
    bookingCode: {
      type: String,
      default: "",
    },

    event: {
      type: Types.ObjectId,
      ref: "Special_Event",
      required: true,
    },

    classType: {
      type: String,
      enum: ["online", "offline"],
      required: true,
    },

    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    booker: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    seat: {
      type: Number,
    },

    participants: {
      type: [String],
    },

    payment: {
      amount: {
        type: Number,
      },

      date: {
        type: Date,
      },

      method: {
        type: String,
      },

      image: {
        type: String,
      },
    },

    status: {
      value: {
        type: String,
        enum: ["Pending", "Confirmed", "Rejected"],
        default: "Pending",
      },
      lastUpdateOn: {
        type: Date,
        default: new Date(),
      },
      updatedBy: {
        type: Types.ObjectId,
        ref: "User",
      },

      reason: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

export const EventBookingCardModel =
  (models.Event_Booking_Card as Model<EventBookingCard>) ||
  model("Event_Booking_Card", EventBookingCardSchema);
