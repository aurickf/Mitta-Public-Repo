import { Types } from "mongoose";
import { Field, Int, ObjectType } from "type-graphql";
import { ObjectIdScalar } from "./scalar";

@ObjectType()
export class Counter {
  @Field(() => ObjectIdScalar)
  _id: Types.ObjectId;

  @Field()
  keyword: string;

  @Field()
  prefix: string;

  @Field(() => Int)
  counter: number;
}
