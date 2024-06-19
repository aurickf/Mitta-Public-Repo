import { Types } from "mongoose";
import { Field, ID, InputType, Int, ObjectType } from "type-graphql";
import { ObjectIdScalar } from "./scalar";

@ObjectType({ description: "Membership package model" })
export class MembershipPackage {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field({ defaultValue: false })
  isEnabled: boolean;

  @Field()
  name: string;

  @Field(() => Int)
  additional: number;

  @Field(() => Int)
  price: number;

  @Field(() => Int)
  validity: number;
}

@InputType()
export class MembershipPackageInput implements Partial<MembershipPackage> {
  @Field(() => ObjectIdScalar, { nullable: true })
  _id?: Types.ObjectId;

  @Field()
  isEnabled: boolean;

  @Field({ nullable: true })
  name?: string;

  @Field(() => Int, { nullable: true })
  additional?: number;

  @Field(() => Int, { nullable: true })
  price?: number;

  @Field(() => Int, { nullable: true })
  validity?: number;
}
