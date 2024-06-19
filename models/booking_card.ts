import { model, Model, models, Schema, Types } from "mongoose";
import { BookingCard } from "src/generated/graphql";

const BookingCardSchema = new Schema<BookingCard>(
  {
    bookingCode: {
      type: String,
    },

    regularClass: {
      type: Types.ObjectId,
      ref: "Regular_Class",
      required: true,
    },

    classType: {
      type: String,
      enum: ["online", "offline"],
      required: true,
    },

    cost: {
      type: Number,
      default: 100,
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

    status: {
      value: {
        type: String,
        enum: [
          "Scheduled",
          "Confirmed",
          "Booking Cancelled",
          "Class Cancelled",
        ],
        default: "Scheduled",
      },
      lastUpdateOn: {
        type: Date,
        default: new Date(),
      },
      updatedBy: {
        type: Types.ObjectId,
        ref: "User",
      },
    },
  },
  {
    timestamps: true,
  }
);

export const BookingCardModel =
  (models.Booking_Card as Model<BookingCard>) ||
  model("Booking_Card", BookingCardSchema);
