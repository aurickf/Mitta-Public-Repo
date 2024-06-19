import { Model, model, models, Schema, Types } from "mongoose";
import { Log } from "src/schema/log";

const LogSchema = new Schema<Log>(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    category: {
      type: String,
      enum: ["Booking", "Membership", "Class"],
    },

    subCategory: {
      type: String,
      enum: [
        "Approved",
        "Cancelled",
        "Confirmed",
        "New",
        "Rejected",
        "Deleted",
      ],
    },

    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const LogModel = (models.Log as Model<Log>) || model("Log", LogSchema);
