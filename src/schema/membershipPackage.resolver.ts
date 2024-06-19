import { MembershipPackageModel } from "@/models/index";
import { DataException, membershipPackageError } from "@/utils/error_message";
import { ObjectId } from "mongodb";
import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import { MembershipPackage, MembershipPackageInput } from "./membershipPackage";

@Resolver(MembershipPackage)
export class MembershipPackageResolver {
  @Authorized()
  @Query(() => [MembershipPackage])
  async activeMembershipPackages() {
    try {
      return await MembershipPackageModel.find({ isEnabled: true }).sort({
        additional: 1,
      });
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Query(() => [MembershipPackage])
  async membershipPackages() {
    try {
      return await MembershipPackageModel.find().sort({ additional: 1 });
    } catch (error) {
      return error;
    }
  }

  @Authorized()
  @Query(() => MembershipPackage)
  async membershipPackage(@Arg("_id") _id: ObjectId) {
    try {
      return await MembershipPackageModel.findById(_id);
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Mutation(() => MembershipPackage)
  async addMembershipPackage(@Arg("input") input: MembershipPackageInput) {
    try {
      input.name = input.name.trim();

      const doc = new MembershipPackageModel(input);
      return await doc.save();
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Mutation(() => MembershipPackage)
  async editMembershipPackage(@Arg("input") input: MembershipPackageInput) {
    try {
      const result = await MembershipPackageModel.findById(input._id);
      if (!result) throw new DataException(membershipPackageError.NOT_FOUND);

      result.isEnabled = input.isEnabled;
      if (input.name) result.name = input.name.trim();
      if (input.additional) result.additional = input.additional;
      if (input.price) result.price = input.price;
      if (input.validity) result.validity = input.validity;

      return await result.save();
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Mutation(() => MembershipPackage)
  async deleteMembershipPackage(@Arg("_id") _id: ObjectId) {
    try {
      return await MembershipPackageModel.findByIdAndDelete(_id).orFail();
    } catch (error) {
      return error;
    }
  }
}
