import { LevelModel } from "@/models/index";
import { DataException, levelError } from "@/utils/error_message";
import { ObjectId } from "mongodb";
import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import { Level, LevelInput } from "./level";

@Resolver(Level)
export class LevelResolver {
  @Query(() => [Level])
  @Authorized(["ADMIN"])
  async activeLevels() {
    try {
      return await LevelModel.find({ isEnabled: true }).sort({ code: 1 });
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Query(() => [Level])
  async levels() {
    try {
      return await LevelModel.find().sort({ code: 1 });
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Query(() => Level)
  async level(@Arg("_id") _id: ObjectId) {
    try {
      return await LevelModel.findById(_id);
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Mutation(() => Level)
  async addLevel(@Arg("input") input: LevelInput) {
    try {
      input.code = input.code.trim();
      input.description = input.description.trim();

      const doc = new LevelModel(input);
      return await doc.save();
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Mutation(() => Level)
  async editLevel(@Arg("input") input: LevelInput) {
    try {
      const result = await LevelModel.findById(input._id);
      if (!result) throw new DataException(levelError.NOT_FOUND);

      result.isEnabled = input.isEnabled;
      if (input.code) result.code = input.code.trim();
      if (input.description) result.description = input.description.trim();

      return await result.save();
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Mutation(() => Level)
  async deleteLevel(@Arg("_id") _id: ObjectId) {
    try {
      return await LevelModel.findByIdAndDelete(_id).orFail();
    } catch (error) {
      return error;
    }
  }
}
