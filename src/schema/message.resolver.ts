import { MessageModel } from "@/models/index";
import { ObjectId } from "mongodb";
import { HydratedDocument } from "mongoose";
import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import { Message } from "./message";

@Resolver(Message)
export class MessageResolver {
  @Authorized()
  @Query(() => [Message])
  async getMessagesForUser(@Arg("_id") _id: ObjectId) {
    try {
      return await MessageModel.find({ user: _id }).sort({ createdAt: -1 });
    } catch (error) {
      return error;
    }
  }

  @Authorized()
  @Query(() => Number)
  async getUnreadNumberForUser(@Arg("_id") _id: ObjectId) {
    try {
      const result = await MessageModel.find({ user: _id, isRead: false });
      return result.length;
    } catch (error) {
      return error;
    }
  }

  @Authorized()
  @Query(() => Message)
  async getMessage(@Arg("_id") _id: ObjectId) {
    try {
      const result = await MessageModel.findById({ _id });
      result.isRead = true;
      return await result.save();
    } catch (error) {
      return error;
    }
  }

  @Authorized()
  @Mutation(() => Number)
  async markAllMessagesAsReadForUser(@Arg("_id") _id: ObjectId) {
    try {
      const result = await MessageModel.find({ user: _id, isRead: false });
      const allMessage = await Promise.all(
        result.map(async (message) => {
          message.isRead = true;
          return await message.save();
        })
      );
      return allMessage.length;
    } catch (error) {
      return error;
    }
  }

  @Authorized()
  @Mutation(() => Number)
  async deleteAllReadMessagesForUser(@Arg("_id") _id: ObjectId) {
    try {
      const result: HydratedDocument<Message>[] = await MessageModel.find({
        user: _id,
        isRead: true,
      });
      await Promise.all(
        result.map(async (res) =>
          MessageModel.findByIdAndDelete(res._id).orFail()
        )
      );
      return result.length;
    } catch (error) {
      return error;
    }
  }
}
