import {
  MembershipModel,
  SessionModel,
  UserModel,
  BookingCardModel,
} from "@/models/index";
import { s3client } from "@/utils/aws";
import {
  DataException,
  InputException,
  userError,
} from "@/utils/error_message";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { parseUrl } from "@smithy/url-parser";
import { HydratedDocument, Types } from "mongoose";
import path from "path";
import { Arg, Args, Authorized, Mutation, Query, Resolver } from "type-graphql";
import validator from "validator";
import {
  User,
  UserAccessInput,
  UserProfileImageUploadArgs,
  UserProfileInputArgs,
  UserRoleInput,
} from "./user";

@Resolver(User)
export class UserResolver {
  @Authorized(["ADMIN"])
  @Query(() => [User])
  async users() {
    try {
      const res = await UserModel.find()
        .populate([
          {
            path: "access.approval.by",
            select: "name",
          },
          {
            path: "access.ban.by",
            select: "name",
          },
          {
            path: "membership.latest",
            model: "Membership",
            populate: ["booked", "confirmed", "cancelled"],
          },
        ])
        .sort({
          name: 1,
        });

      return res;
    } catch (error) {
      return error;
    }
  }

  @Authorized()
  @Query(() => User)
  async user(@Arg("_id") _id: Types.ObjectId) {
    try {
      return await UserModel.findById(_id).orFail();
    } catch (error) {
      return error;
    }
  }

  @Authorized()
  @Query(() => [User])
  async instructors() {
    try {
      return await UserModel.find({ "role.isInstructor": true }).sort({
        name: 1,
      });
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Query(() => [User])
  async admins() {
    try {
      return await UserModel.find({
        "role.isAdmin": true,
      }).sort({ name: 1 });
    } catch (error) {
      return error;
    }
  }

  @Authorized()
  @Query(() => Boolean)
  async isUsernameAvailable(@Arg("username") username: string) {
    try {
      if (!validator.isAlphanumeric(username)) return false;
      const result = await UserModel.findOne({ username });
      return !result;
    } catch (error) {
      return error;
    }
  }

  @Authorized()
  @Mutation(() => User)
  async editUser(@Arg("input") input: UserProfileInputArgs) {
    const { _id, name, phone, username } = input;

    try {
      const user: HydratedDocument<User> = await UserModel.findById(_id);
      if (!user) throw new DataException(userError.NOT_FOUND);

      if (name.length === 0) throw new InputException(userError.NAME_IS_EMPTY);
      if (username.length === 0)
        throw new InputException(userError.USERNAME_IS_EMPTY);

      if (!validator.isAlpha(name, "en-US", { ignore: " " }))
        throw new InputException(userError.NAME_CONTAINS_NON_ALPHA);
      if (!validator.isAlphanumeric(username))
        throw new InputException(userError.USERNAME_CONTAINS_NON_ALPHANUMERIC);
      if (!validator.isMobilePhone(phone))
        throw new InputException(userError.PHONE_FORMAT_INVALID);

      user.username = validator.escape(username.trim().toLowerCase());
      user.name = validator.escape(name.trim());
      user.phone = validator.escape(phone.trim());

      return await user.save();
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Mutation(() => User)
  async editUserRoleAndAccess(
    @Arg("_id") _id: Types.ObjectId,
    @Arg("updaterId") updaterId: Types.ObjectId,
    @Arg("role") role: UserRoleInput,
    @Arg("access") access: UserAccessInput,
    @Arg("isVIP") isVIP: boolean
  ) {
    try {
      const user: HydratedDocument<User> = await UserModel.findById(_id);
      if (!user) throw new DataException(userError.NOT_FOUND);

      const updater = await UserModel.findById(updaterId);
      if (!updater) throw new DataException(userError.UPDATER_NOT_FOUND);

      user.role = {
        ...user.role,
        ...role,
      };
      user.membership.isVIP = isVIP;

      // access.approval is being updated
      if (!user.access.approval.isApproved && access.approval.isApproved) {
        user.access.approval = {
          isApproved: access.approval.isApproved,
          by: updaterId,
          date: new Date(),
        };
      }

      // access.ban is being updated
      if (Number(user.access.ban.isBanned) !== Number(access.ban.isBanned)) {
        // Update user to be banned
        if (access.ban.isBanned) {
          user.access.ban = {
            isBanned: true,
            reason: access.ban.reason.trim(),
            by: updaterId,
            date: new Date(),
          };

          // Delete session in db to instantly ends user's session
          await SessionModel.findOneAndDelete({ userId: _id });
        }
        // Unban user
        else {
          user.access.ban = {
            isBanned: false,
            reason: null,
            by: updaterId,
            date: new Date(),
          };
        }
      }
      return await user.save();
    } catch (error) {
      return error;
    }
  }

  @Authorized()
  @Mutation(() => Boolean)
  async uploadProfileImage(
    @Args() { _id, image }: UserProfileImageUploadArgs
  ): Promise<Boolean> {
    try {
      const { createReadStream, filename } = await image;

      const ext = path.extname(filename);

      const user: HydratedDocument<User> = await UserModel.findById({ _id });

      const bucketParams = {
        Bucket: process.env.AWS_BUCKET,
        Key: `avatar/${_id}${ext}`,
        Body: createReadStream(),
      };

      if (user.image) {
        const existingImage = parseUrl(user.image).path.substring(1);

        if (existingImage !== `${_id}${ext}`) {
          await s3client.send(
            new DeleteObjectCommand({
              Bucket: process.env.AWS_BUCKET,
              Key: existingImage,
            })
          );
        }
      }

      const imageUpload = new Upload({
        client: s3client,
        params: bucketParams,
      });

      user.image = `${_id}${ext}`;

      await imageUpload.done();
      await user.save();

      return true;
    } catch (error) {
      return error;
    }
  }

  @Authorized()
  @Mutation(() => Boolean)
  async deleteProfileImage(@Arg("_id") _id: Types.ObjectId): Promise<Boolean> {
    try {
      const user: HydratedDocument<User> = await UserModel.findById(_id);

      const { path } = parseUrl(user.image);

      await s3client.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET,
          Key: path.substring(1),
        })
      );

      user.image = "";

      await user.save();
      return true;
    } catch (error) {
      return error;
    }
  }

  @Authorized("super")
  @Mutation(() => Boolean)
  async cleanUpUserData(@Arg("_id") _id: Types.ObjectId) {
    try {
      if (process.env.NODE_ENV !== "development")
        throw new DataException("This feature only available on development");

      const user = await UserModel.findById(_id);
      const memberships = await MembershipModel.find({ user: _id });
      const bookings = await BookingCardModel.find({ user: _id });

      memberships.forEach(
        async (membership) =>
          await MembershipModel.findByIdAndDelete(membership._id)
      );
      bookings.forEach(
        async (booking) => await BookingCardModel.findByIdAndDelete(booking._id)
      );

      user.membership.latest = null;

      await user.save();

      return true;
    } catch (error) {
      return error;
    }
  }
}
