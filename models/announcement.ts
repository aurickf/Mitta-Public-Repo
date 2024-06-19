import { Model, model, models, Schema } from "mongoose";
import { Announcement } from "src/generated/graphql";

const AnnouncementSchema = new Schema<Announcement>({
  isEnabled: {
    type: Boolean,
    default: false,
  },

  isPrivate: {
    type: Boolean,
  },

  isPublic: {
    type: Boolean,
  },

  start: {
    type: Date,
    required: true,
  },

  end: {
    type: Date,
  },

  text: {
    type: String,
    required: true,
  },
});

export const AnnouncementModel =
  (models.Announcement as Model<Announcement>) ||
  model("Announcement", AnnouncementSchema);
