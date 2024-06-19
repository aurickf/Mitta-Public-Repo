import { ArgsType, Field, InputType, Int, ObjectType } from "type-graphql";

import { BookingCard } from "./bookingCard";
import { User } from "./user";

import { ObjectIdScalar } from "./scalar";
import { Types } from "mongoose";
import type { PopulatedDoc } from "mongoose";

import { GraphQLUpload } from "graphql-upload";
import { Upload as UploadType } from "graphql-upload/public/Upload.js";
@ObjectType()
class MembershipBalance {
  @Field(() => Int, { nullable: true })
  available?: number;

  @Field(() => Int)
  totalBookedCost: number;

  @Field(() => Int)
  totalConfirmedCost: number;

  @Field(() => Int)
  additional: number;

  @Field(() => Int, { defaultValue: 0 })
  transferIn: number;

  @Field(() => Int, { defaultValue: 0 })
  transferOut: number;

  @Field(() => Date)
  validUntil: Date;
}

@ObjectType()
class MembershipPayment {
  @Field(() => Int)
  amount: number;

  @Field()
  method: string;

  @Field()
  date: Date;

  @Field({ nullable: true })
  url?: string;
}

@ObjectType()
class MembershipVerified {
  @Field({ nullable: true })
  isVerified?: boolean;

  @Field({ nullable: true })
  reason?: string;

  @Field(() => User, { nullable: true })
  by?: PopulatedDoc<User>;

  @Field({ nullable: true })
  date?: Date;
}

@ObjectType()
export class Membership {
  @Field(() => ObjectIdScalar)
  _id: Types.ObjectId;

  @Field(() => User, { nullable: true })
  user?: PopulatedDoc<User>;

  @Field({ nullable: true })
  note?: string;

  @Field(() => [BookingCard], { nullable: "items" })
  booked?: Array<PopulatedDoc<BookingCard>>;

  @Field(() => [BookingCard], { nullable: "items" })
  confirmed?: Array<PopulatedDoc<BookingCard>>;

  @Field(() => [BookingCard], { nullable: "items" })
  cancelled?: Array<PopulatedDoc<BookingCard>>;

  @Field(() => MembershipBalance)
  balance: MembershipBalance;

  @Field(() => MembershipPayment)
  payment?: MembershipPayment;

  @Field(() => MembershipVerified)
  verified?: MembershipVerified;

  @Field(() => Membership, { nullable: true })
  prev?: PopulatedDoc<Membership>;

  @Field(() => Membership, { nullable: true })
  next?: PopulatedDoc<Membership>;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}

@InputType()
class MembershipBalanceInput implements Partial<MembershipBalance> {
  @Field(() => Int, { nullable: true })
  additional?: number;

  @Field(() => Int, { nullable: true })
  transferIn?: number;

  @Field(() => Int, { nullable: true })
  transferOut?: number;

  @Field(() => Date, { nullable: true })
  validUntil?: Date;
}

@InputType()
class MembershipPaymentInput implements Partial<MembershipPayment> {
  @Field(() => Int, { nullable: true })
  amount?: number;

  @Field({ nullable: true })
  method?: string;

  @Field({ nullable: true })
  date?: Date;

  @Field({ nullable: true })
  url?: string;
}
@InputType()
class MembershipVerifiedInput implements Partial<MembershipVerified> {
  @Field({ nullable: true })
  isVerified?: boolean;

  @Field({ nullable: true })
  reason?: string;

  @Field(() => ObjectIdScalar, { nullable: true })
  by?: Types.ObjectId;

  @Field({ nullable: true })
  date?: Date;
}

@ArgsType()
export class NewMembershipInput {
  @Field()
  user: Types.ObjectId;

  @Field()
  membershipPackageId: Types.ObjectId;

  @Field()
  note: String;

  @Field()
  payment: MembershipPaymentInput;

  @Field(() => GraphQLUpload, { nullable: true })
  image?: UploadType;
}

@ArgsType()
export class EditMembershipInput {
  @Field()
  _id: Types.ObjectId;

  @Field()
  balance: MembershipBalanceInput;

  @Field()
  payment: MembershipPaymentInput;

  @Field()
  verified: MembershipVerifiedInput;
}

@ArgsType()
export class MarkMembershipAsInvalidInput {
  @Field()
  _id: Types.ObjectId;

  @Field()
  updatedBy: Types.ObjectId;
}
