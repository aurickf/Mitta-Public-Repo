import { PaymentMethodModel } from "@/models/index";
import { DataException, paymentMethodError } from "@/utils/error_message";
import { ObjectId } from "mongodb";
import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import { PaymentMethod, Payment_MethodInput } from "./paymentMethod";

@Resolver(PaymentMethod)
export class PaymentMethodResolver {
  @Authorized()
  @Query(() => [PaymentMethod])
  async activePaymentMethods() {
    try {
      return await PaymentMethodModel.find({ isEnabled: true }).sort({
        via: 1,
      });
    } catch (error) {
      return error;
    }
  }

  @Authorized()
  @Query(() => [PaymentMethod])
  async activePaymentMethodsMembership() {
    try {
      return await PaymentMethodModel.find({
        isEnabled: true,
        isEnabledForMembership: true,
      }).sort({
        via: 1,
      });
    } catch (error) {
      return error;
    }
  }

  @Authorized()
  @Query(() => [PaymentMethod])
  async activePaymentMethodsSpecialEvent() {
    try {
      return await PaymentMethodModel.find({
        isEnabled: true,
        isEnabledForSpecialEvent: true,
      }).sort({
        via: 1,
      });
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Query(() => [PaymentMethod])
  async paymentMethods() {
    try {
      return await PaymentMethodModel.find().sort({ via: 1 });
    } catch (error) {
      return error;
    }
  }

  @Authorized()
  @Query(() => PaymentMethod)
  async paymentMethod(@Arg("_id") _id: ObjectId) {
    try {
      return await PaymentMethodModel.findById(_id);
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Mutation(() => PaymentMethod)
  async addPaymentMethod(@Arg("input") input: Payment_MethodInput) {
    try {
      const doc = new PaymentMethodModel(input);
      return await doc.save();
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Mutation(() => PaymentMethod)
  async editPaymentMethod(@Arg("input") input: Payment_MethodInput) {
    try {
      const result = await PaymentMethodModel.findById(input._id);

      if (!result) throw new DataException(paymentMethodError.NOT_FOUND);

      result.isEnabled = input.isEnabled ?? result.isEnabled;
      result.isEnabledForMembership =
        input.isEnabledForMembership ?? result.isEnabledForMembership;
      result.isEnabledForSpecialEvent =
        input.isEnabledForSpecialEvent ?? result.isEnabledForSpecialEvent;
      result.requireProof = input.requireProof ?? result.requireProof;

      if (input.via) result.via = input.via;
      return await result.save();
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Mutation(() => PaymentMethod)
  async deletePaymentMethod(@Arg("_id") _id: ObjectId) {
    try {
      return await PaymentMethodModel.findByIdAndDelete(_id).orFail();
    } catch (error) {
      return error;
    }
  }
}
