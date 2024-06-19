import { Model, model, models, Schema } from "mongoose";
import { MembershipPackage } from "src/generated/graphql";

const MembershipPackageSchema = new Schema<MembershipPackage>({
  isEnabled: {
    type: Boolean,
    default: false,
  },

  name: {
    type: String,
    required: true,
  },

  additional: {
    type: Number,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  validity: {
    type: Number,
    required: true,
  },
});

export const MembershipPackageModel =
  (models.Membership_Package as Model<MembershipPackage>) ||
  model("Membership_Package", MembershipPackageSchema);
