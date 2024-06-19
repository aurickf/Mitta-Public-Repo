import { Model, model, models, Schema, Types } from "mongoose";
import { Feature } from "src/generated/graphql";

const FeatureSchema = new Schema<Feature>(
  {
    isEnabled: {
      type: Boolean,
      default: false,
    },

    featureKey: {
      type: String,
      required: true,
    },

    by: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const FeatureModel =
  (models.Feature as Model<Feature>) || model("Feature", FeatureSchema);
