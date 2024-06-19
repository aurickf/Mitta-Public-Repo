import { Field, InputType, Int, ObjectType } from "type-graphql";

import { RegularClass } from "./regularClass";
import { User } from "./user";

import { registerEnumType } from "type-graphql";
import { ObjectIdScalar } from "./scalar";
import { Types } from "mongoose";
import type { PopulatedDoc } from "mongoose";

export enum BookingStatusValue {
  SCHEDULED = "Scheduled",
  CONFIRMED = "Confirmed",
  BOOKING_CANCELLED = "Booking Cancelled",
  CLASS_CANCELLED = "Class Cancelled",
}

export enum ClassTypeValue {
  ONLINE = "online",
  OFFLINE = "offline",
}

registerEnumType(BookingStatusValue, {
  name: "BookingStatusValue",
  description: "Booking card status possible values",
});

@ObjectType()
class BookingCardStatus {
  @Field({ defaultValue: "Scheduled" })
  value: BookingStatusValue;

  @Field()
  lastUpdateOn: Date;

  @Field(() => User, { nullable: true })
  updatedBy?: PopulatedDoc<User>;
}

@ObjectType({
  description: "Booking card model",
})
export class BookingCard {
  @Field(() => ObjectIdScalar)
  _id: Types.ObjectId;

  @Field()
  bookingCode: string;

  @Field(() => RegularClass, { nullable: true })
  regularClass?: PopulatedDoc<RegularClass>;

  @Field()
  classType: ClassTypeValue;

  @Field(() => Int)
  cost: Number;

  @Field(() => User, { nullable: true })
  user?: PopulatedDoc<User>;

  @Field(() => User, { nullable: true })
  booker?: PopulatedDoc<User>;

  @Field()
  status: BookingCardStatus;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}

@InputType()
class BookingCardStatusInput implements Partial<BookingCardStatus> {
  @Field()
  value: BookingStatusValue;

  @Field({ defaultValue: new Date() })
  lastUpdateOn: Date;

  @Field(() => ObjectIdScalar)
  updatedBy: Types.ObjectId;
}

@InputType({ description: "Booking card input model" })
export class BookingCardInput implements Partial<BookingCard> {
  @Field(() => ObjectIdScalar, { nullable: true })
  _id?: Types.ObjectId;

  @Field({ nullable: true })
  bookingCode?: string;

  @Field()
  regularClass: Types.ObjectId;

  @Field()
  classType: ClassTypeValue;

  @Field(() => ObjectIdScalar)
  user: Types.ObjectId;

  @Field(() => ObjectIdScalar)
  booker: Types.ObjectId;

  @Field()
  status: BookingCardStatusInput;

  @Field(() => Int)
  seat: number;
}
