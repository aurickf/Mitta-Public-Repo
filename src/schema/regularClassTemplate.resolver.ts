import { ClassTemplateModel } from "@/models/index";
import { DataException, templateError } from "@/utils/error_message";
import { ObjectId } from "mongodb";
import { HydratedDocument } from "mongoose";
import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import {
  RegularClassTemplate,
  RegularClassTemplateInput,
} from "./regularClassTemplate";

@Resolver(RegularClassTemplate)
export class RegularClassTemplateResolver {
  @Authorized(["ADMIN"])
  @Query(() => [RegularClassTemplate])
  async classTemplates() {
    try {
      return await ClassTemplateModel.find()
        .populate({
          path: "instructors",
          select: "name image",
        })
        .populate("details.level")
        .sort({ "details.title": 1 });
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Query(() => RegularClassTemplate)
  async classTemplate(@Arg("_id") _id: ObjectId) {
    try {
      const result = await ClassTemplateModel.findById(_id)
        .populate("instructors")
        .populate("details.level");

      if (!result) throw new DataException(templateError.NOT_FOUND);

      return result;
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Query(() => RegularClassTemplate)
  async classTemplatePriceList(@Arg("title") title: String) {
    try {
      const result = await ClassTemplateModel.findOne({
        "details.title": title,
      })
        .populate("instructors")
        .populate("details.level");
      if (!result) throw new DataException(templateError.NOT_FOUND);

      return result;
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Mutation(() => RegularClassTemplate)
  async addTemplate(@Arg("input") input: RegularClassTemplateInput) {
    try {
      input.details = {
        ...input.details,
        title: input.details.title.trim(),
        description: input.details.description.trim(),
      };
      const doc = new ClassTemplateModel(input);
      return await doc.save();
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Mutation(() => RegularClassTemplate)
  async editTemplate(@Arg("input") input: RegularClassTemplateInput) {
    try {
      const result: HydratedDocument<RegularClassTemplate> =
        await ClassTemplateModel.findById(input._id);
      if (!result) throw new DataException(templateError.NOT_FOUND);

      result.instructors = input.instructors;

      result.details = {
        ...input.details,
        title: input.details.title.trim(),
        description: input.details.description.trim(),
      };

      result.schedule = input.schedule;
      result.online = input.online;
      result.offline = input.offline;

      return await result.save();
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Mutation(() => RegularClassTemplate)
  async deleteTemplate(@Arg("_id") _id: ObjectId) {
    try {
      return await ClassTemplateModel.findByIdAndDelete(_id).orFail();
    } catch (error) {
      return error;
    }
  }
}
