import { Model, model, models, Schema, Types } from "mongoose";
import { Series } from "src/generated/graphql";

const SeriesSchema = new Schema<Series>({
  isPublished: {
    type: Boolean,
    default: false,
  },

  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  regularClass: {
    type: [Types.ObjectId],
    ref: "Regular_Class",
  },

  specialEvent: {
    type: [Types.ObjectId],
    ref: "Special_Event",
  },
});

export const SeriesModel =
  (models.Series as Model<Series>) || model("Series", SeriesSchema);
