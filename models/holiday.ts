import { Model, model, models, Schema } from "mongoose";
import { Holiday } from "src/generated/graphql";

const HolidaySchema = new Schema<Holiday>({
  isEnabled: {
    type: Boolean,
    default: false,
  },

  start: {
    type: Date,
    required: true,
  },

  end: {
    type: Date,
  },

  title: {
    type: String,
    required: true,
  },
});

export const HolidayModel =
  (models.Holiday as Model<Holiday>) || model("Holiday", HolidaySchema);
