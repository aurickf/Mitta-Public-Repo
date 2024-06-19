import { Types } from "mongoose";
import { Field, ObjectType } from "type-graphql";
import { ObjectIdScalar } from "./scalar";

@ObjectType()
export class Session {
  @Field(() => ObjectIdScalar)
  _id: Types.ObjectId;

  @Field()
  sessionToken: string;

  @Field()
  userId: Types.ObjectId;

  @Field()
  expires: Date;
}
