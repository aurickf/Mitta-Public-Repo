import { Model, model, models, Schema } from "mongoose";
import { Level } from "src/generated/graphql";

const LevelSchema = new Schema<Level>({
  isEnabled: {
    type: Boolean,
    default: false,
  },

  code: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },
});

export const LevelModel =
  (models.Level as Model<Level>) || model("Level", LevelSchema);
