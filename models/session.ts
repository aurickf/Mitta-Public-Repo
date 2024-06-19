import { ObjectId } from "mongodb";
import { model, Model, models, Schema } from "mongoose";
import { Session } from "src/generated/graphql";

const SessionSchema = new Schema<Session>({
  sessionToken: {
    type: String,
  },

  userId: {
    type: ObjectId,
    ref: "User",
  },

  expires: {
    type: Date,
  },
});

export const SessionModel =
  (models.Session as Model<Session>) || model("Session", SessionSchema);
