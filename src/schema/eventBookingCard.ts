import { ArgsType, Field, InputType, Int, ObjectType } from "type-graphql";

import { User } from "./user";

import type { PopulatedDoc } from "mongoose";
import { Types } from "mongoose";
import { registerEnumType } from "type-graphql";
import { ClassTypeValue } from "./bookingCard";
import { ObjectIdScalar } from "./scalar";
import { SpecialEvent } from "./specialEvent";

import { GraphQLUpload } from "graphql-upload";
import { Upload as UploadType } from "graphql-upload/public/Upload.js";

export enum EventBookingStatusValue {
  PENDING = "Pending",
  REJECTED = "Rejected",
  CONFIRMED = "Confirmed",
}

registerEnumType(EventBookingStatusValue, {
  name: "EventBookingStatusValue",
  description: "EventBooking card status possible values",
});

@ObjectType()
class EventBookingCardStatus {
  @Field({ defaultValue: "Pending" })
  value?: EventBookingStatusValue;

  @Field({ nullable: true })
  lastUpdateOn?: Date;

  @Field(() => User, { nullable: true })
  updatedBy?: PopulatedDoc<User>;

  @Field({ nullable: true })
  reason?: string;
}

@InputType()
export class EventBookingCardStatusInput
  implements Partial<EventBookingCardStatus>
{
  @Field({ nullable: true })
  value?: EventBookingStatusValue;

  @Field(() => ObjectIdScalar)
  updatedBy: Types.ObjectId;

  @Field({ nullable: true })
  reason?: string;
}

@ObjectType()
class EventPayment {
  @Field()
  date: Date;

  @Field()
  method: string;

  @Field({ nullable: true })
  amount?: number;

  @Field({ nullable: true })
  image?: string;
}

@InputType()
class EventPaymentInput implements Partial<EventPayment> {
  @Field()
  date: Date;

  @Field()
  method: string;

  @Field({ nullable: true })
  image?: string;
}

@ObjectType({
  description: "Event booking card model",
})
export class EventBookingCard {
  @Field(() => ObjectIdScalar)
  _id: Types.ObjectId;

  @Field()
  bookingCode: string;

  @Field(() => Int)
  seat: Number;

  @Field()
  payment: EventPayment;

  @Field(() => SpecialEvent)
  event: PopulatedDoc<SpecialEvent>;

  @Field(() => String)
  classType: ClassTypeValue;

  @Field(() => User)
  user: PopulatedDoc<User>;

  @Field(() => User)
  booker: PopulatedDoc<User>;

  @Field(() => [String])
  participants: Array<String>;

  @Field()
  status: EventBookingCardStatus;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}

@InputType({
  description: "Event booking card model input",
})
export class EventBookingCardInput implements Partial<EventBookingCard> {
  @Field(() => ObjectIdScalar, { nullable: true })
  _id?: Types.ObjectId;

  @Field(() => Int)
  seat: number;

  @Field()
  payment: EventPaymentInput;

  @Field(() => ObjectIdScalar)
  event: Types.ObjectId;

  @Field(() => String)
  classType: ClassTypeValue;

  @Field(() => ObjectIdScalar)
  user: Types.ObjectId;

  @Field(() => ObjectIdScalar)
  booker: Types.ObjectId;

  @Field(() => [String])
  participants: Array<String>;

  @Field()
  status: EventBookingCardStatusInput;

  @Field(() => GraphQLUpload, { nullable: true })
  image?: UploadType;
}

@ArgsType()
export class EventStatusUpdateArgs {
  @Field(() => ObjectIdScalar)
  _id: Types.ObjectId;

  @Field()
  status: EventBookingCardStatusInput;
}

@ArgsType()
export class EventParticipantsUpdateArgs {
  @Field(() => ObjectIdScalar)
  _id: Types.ObjectId;

  @Field(() => [String])
  participants: Array<String>;
}
