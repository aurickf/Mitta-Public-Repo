import { HolidayModel } from "@/models/index";
import {
  DataException,
  holidayError,
  InputException,
} from "@/utils/error_message";
import { ObjectId } from "mongodb";
import { HydratedDocument } from "mongoose";
import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import { Holiday, HolidayInput } from "./holiday";

@Resolver(Holiday)
export class HolidayResolver {
  @Authorized(["INSTRUCTOR"])
  @Query(() => [Holiday])
  async activeHolidays() {
    try {
      return await HolidayModel.find({ isEnabled: true }).sort({ start: 1 });
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Query(() => [Holiday])
  async holidays() {
    try {
      return await HolidayModel.find().sort({ start: 1 });
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Mutation(() => Holiday)
  async addHoliday(@Arg("input") input: HolidayInput) {
    try {
      if (input.end !== null && input.end < input.start)
        throw new InputException(holidayError.ENDDATE_IS_EARLY);

      input.title = input.title.trim();

      const holiday = new HolidayModel(input);

      return await holiday.save();
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Mutation(() => Holiday)
  async editHoliday(@Arg("input") input: HolidayInput) {
    try {
      const result: HydratedDocument<Holiday> = await HolidayModel.findById(
        input._id
      );
      if (!result) throw new DataException(holidayError.NOT_FOUND);

      if (input.end !== null && input.end < input.start)
        throw new InputException(holidayError.ENDDATE_IS_EARLY);

      result.isEnabled = input.isEnabled ?? result.isEnabled;
      result.start = input.start ?? result.start;
      result.title = input.title?.trim() ?? result.title;

      if (typeof input.end !== "undefined") result.end = input.end;

      return await result.save();
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Mutation(() => Holiday)
  async deleteHoliday(@Arg("_id") _id: ObjectId) {
    try {
      return await HolidayModel.findByIdAndDelete(_id).orFail();
    } catch (error) {
      return error;
    }
  }
}
