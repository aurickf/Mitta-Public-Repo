import { Types } from "mongoose";
import { Field, ObjectType, registerEnumType } from "type-graphql";
import { ObjectIdScalar } from "./scalar";
import { User } from "./user";

import type { PopulatedDoc } from "mongoose";

export enum CategoryValue {
  CLASS = "Class",
  BOOKING = "Booking",
  MEMBERSHIP = "Membership",
}

export enum SubCategoryValue {
  APPROVED = "Approved",
  CANCELLED = "Cancelled",
  CONFIRMED = "Confirmed",
  REJECTED = "Rejected",
  NEW = "New",
  DELETED = "Deleted",
}

registerEnumType(CategoryValue, {
  name: "CategoryValue",
  description: "Category possible values",
});

registerEnumType(SubCategoryValue, {
  name: "SubCategoryValue",
  description: "SubCategory possible values",
});

@ObjectType({ description: "Log model" })
export class Log {
  @Field(() => ObjectIdScalar)
  _id: Types.ObjectId;

  @Field(() => User, { nullable: true })
  user?: PopulatedDoc<User>;

  @Field()
  category: CategoryValue;

  @Field()
  subCategory: SubCategoryValue;

  @Field()
  message: String;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}
