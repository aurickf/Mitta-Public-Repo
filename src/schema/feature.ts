import type { PopulatedDoc } from "mongoose";

import { Types } from "mongoose";
import { Field, ObjectType } from "type-graphql";
import { ObjectIdScalar } from "./scalar";
import { User } from "./user";

@ObjectType({ description: "Feature model" })
export class Feature {
  @Field(() => ObjectIdScalar)
  _id: Types.ObjectId;

  @Field({ defaultValue: false })
  isEnabled: boolean;

  @Field()
  featureKey: String;

  @Field(() => User, { nullable: true })
  by?: PopulatedDoc<User>;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}
