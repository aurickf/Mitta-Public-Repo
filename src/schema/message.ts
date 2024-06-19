import { Types } from "mongoose";
import { Field, ObjectType } from "type-graphql";
import { ObjectIdScalar } from "./scalar";
import { User } from "./user";
import type { PopulatedDoc } from "mongoose";

@ObjectType({ description: "Message model" })
export class Message {
  @Field(() => ObjectIdScalar)
  _id: Types.ObjectId;

  @Field({ defaultValue: false })
  isRead: boolean;

  @Field(() => User)
  user: PopulatedDoc<User>;

  @Field()
  title: String;

  @Field()
  message: String;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}
