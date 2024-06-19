import { model, Model, models, Schema, Types } from "mongoose";
import { Membership } from "src/generated/graphql";
import validator from "validator";

const MembershipSchema = new Schema<Membership>(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    note: {
      type: String,
      get: getNote,
    },

    booked: {
      type: [Types.ObjectId],
      ref: "Booking_Card",
    },

    confirmed: {
      type: [Types.ObjectId],
      ref: "Booking_Card",
    },

    cancelled: {
      type: [Types.ObjectId],
      ref: "Booking_Card",
    },

    balance: {
      additional: {
        type: Number,
        required: true,
      },

      // From previous membership
      transferIn: {
        type: Number,
        default: 0,
      },

      // To next membership
      transferOut: {
        type: Number,
        default: 0,
      },

      validUntil: {
        type: Date,
        required: true,
      },
    },

    payment: {
      amount: {
        type: Number,
        required: true,
      },
      method: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        required: true,
      },

      url: {
        type: String,
      },
    },

    verified: {
      isVerified: {
        type: Boolean,
        default: null,
      },
      reason: {
        type: String,
      },
      by: {
        type: Types.ObjectId,
        ref: "User",
      },
      date: {
        type: Date,
        default: null,
      },
    },

    prev: {
      type: Types.ObjectId,
      ref: "Membership",
    },

    next: {
      type: Types.ObjectId,
      ref: "Membership",
    },
  },
  { timestamps: true }
);

function getNote(note: string) {
  return validator.unescape(note);
}

MembershipSchema.virtual("balance.totalBookedCost").get(function () {
  let totalBookedCost = 0;

  this.booked.forEach((bookingCard) => {
    totalBookedCost += bookingCard.cost;
  });

  return totalBookedCost;
});

MembershipSchema.virtual("balance.totalConfirmedCost").get(function () {
  let totalConfirmedCost = 0;

  this.confirmed.forEach((bookingCard) => {
    totalConfirmedCost += bookingCard.cost;
  });

  return totalConfirmedCost;
});

MembershipSchema.virtual("balance.available").get(function () {
  let totalCost = 0;

  totalCost = this.balance.totalBookedCost + this.balance.totalConfirmedCost;

  return (
    this.balance.additional +
    this.balance.transferIn -
    (totalCost + this.balance.transferOut)
  );
});

MembershipSchema.set("toJSON", { virtuals: true });
MembershipSchema.set("toObject", { virtuals: true });

export const MembershipModel =
  (models.Membership as Model<Membership>) ||
  model("Membership", MembershipSchema);
