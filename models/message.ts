import { Model, model, models, Schema, Types } from "mongoose";
import { Message } from "src/schema/message";

const MessageSchema = new Schema<Message>(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const MessageModel =
  (models.Message as Model<Message>) || model("Message", MessageSchema);
