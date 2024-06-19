import { Model, model, models, Schema } from "mongoose";
import { PaymentMethod } from "src/generated/graphql";

const PaymentMethodSchema = new Schema<PaymentMethod>({
  isEnabled: {
    type: Boolean,
    default: false,
  },

  isEnabledForMembership: {
    type: Boolean,
    default: false,
  },

  isEnabledForSpecialEvent: {
    type: Boolean,
    default: false,
  },

  requireProof: {
    type: Boolean,
    default: false,
  },

  via: {
    type: String,
    required: true,
  },
});

export const PaymentMethodModel =
  (models.Payment_Method as Model<PaymentMethod>) ||
  model("Payment_Method", PaymentMethodSchema);
