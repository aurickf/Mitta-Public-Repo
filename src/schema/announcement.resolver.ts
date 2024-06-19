import { AnnouncementModel } from "@/models/index";
import {
  announcementError,
  DataException,
  InputException,
} from "@/utils/error_message";
import { DateTime } from "luxon";
import { ObjectId } from "mongodb";
import { HydratedDocument } from "mongoose";
import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import { Announcement, AnnouncementInput } from "./announcement";

const now = DateTime.now().toJSDate();

@Resolver(Announcement)
export class AnnouncementResolver {
  @Authorized(["ADMIN"])
  @Query(() => [Announcement])
  async activeAnnouncements() {
    try {
      return await AnnouncementModel.find({ isEnabled: true }).sort({
        start: 1,
      });
    } catch (error) {
      return error;
    }
  }

  @Query(() => [Announcement])
  async activePublicAnnouncements() {
    try {
      return await AnnouncementModel.find({
        isEnabled: true,
        isPublic: true,
        start: {
          $lte: now,
        },
        $or: [
          {
            end: {
              $gte: now,
            },
          },
          {
            end: null,
          },
        ],
      }).sort({
        start: 1,
      });
    } catch (error) {
      return error;
    }
  }

  @Authorized()
  @Query(() => [Announcement])
  async activePrivateAnnouncements() {
    try {
      return await AnnouncementModel.find({
        isEnabled: true,
        isPrivate: true,
        start: {
          $lte: now,
        },
        $or: [
          {
            end: {
              $gte: now,
            },
          },
          {
            end: null,
          },
        ],
      }).sort({
        start: 1,
      });
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Query(() => [Announcement])
  async announcements() {
    try {
      return await AnnouncementModel.find().sort({ start: 1 });
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Mutation(() => Announcement)
  async addAnnouncement(@Arg("input") input: AnnouncementInput) {
    try {
      if (input.end !== null && input.end < input.start)
        throw new InputException(announcementError.ENDDATE_IS_EARLY);

      input.text = input.text.trim();

      const holiday = new AnnouncementModel(input);

      return await holiday.save();
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Mutation(() => Announcement)
  async editAnnouncement(@Arg("input") input: AnnouncementInput) {
    try {
      const result: HydratedDocument<Announcement> =
        await AnnouncementModel.findById(input._id);
      if (!result) throw new DataException(announcementError.NOT_FOUND);

      if (input.end !== null && input.end < input.start)
        throw new InputException(announcementError.ENDDATE_IS_EARLY);

      result.isEnabled = input.isEnabled ?? result.isEnabled;
      result.isPrivate = input.isPrivate ?? result.isPrivate;
      result.isPublic = input.isPublic ?? result.isPublic;

      result.start = input.start ?? result.start;
      result.text = input.text?.trim() ?? result.text;

      /*
       * Allows end to be blank
       */
      if (typeof input.end !== "undefined") result.end = input.end;
      return await result.save();
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Mutation(() => Announcement)
  async deleteAnnouncement(@Arg("_id") _id: ObjectId) {
    try {
      return await AnnouncementModel.findByIdAndDelete(_id).orFail();
    } catch (error) {
      return error;
    }
  }
}
