import { ArgsType, Field, InputType, Int, ObjectType } from "type-graphql";

import { BookingCard, BookingCardInput } from "./bookingCard";
import { Level } from "./level";
import { User } from "./user";

import type { PopulatedDoc } from "mongoose";
import { Types } from "mongoose";
import { ObjectIdScalar } from "./scalar";

@ObjectType()
export class ClassZoom {
  @Field(() => String, { nullable: true })
  meetingId: string;

  @Field(() => String, { nullable: true })
  password: string;

  @Field(() => String, { nullable: true })
  joinUrl?: string;
}

@ObjectType()
class ClassDetails {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Level)
  level: Level | Types.ObjectId;

  @Field(() => [String], { nullable: "itemsAndList" })
  tags?: string[];
}

@ObjectType()
class ClassCapacity {
  @Field(() => Int, { nullable: true })
  availability?: number;

  @Field(() => Int, { defaultValue: 0 })
  capacity: number;

  @Field(() => [BookingCard], { nullable: "itemsAndList" })
  booked?: BookingCard[] | Types.ObjectId[];

  @Field(() => Int, { defaultValue: 1 })
  bookingTimeLimit: number;

  @Field(() => Int, { defaultValue: 1 })
  cancelTimeLimit?: number;

  @Field(() => Int, { defaultValue: 10 })
  cost: Number;
}

@ObjectType()
class ClassSchedule {
  @Field({ defaultValue: new Date() })
  date: Date;

  @Field({ defaultValue: false })
  isAllDay: boolean;

  @Field(() => Int, { defaultValue: 100 })
  duration: number;

  @Field({ nullable: true })
  rString?: string;
}

@ObjectType()
class ClassStatus {
  @Field({ nullable: true })
  isRunning?: boolean;

  @Field({ defaultValue: false })
  isPublished: boolean;

  @Field({ defaultValue: false })
  isVIPOnly: boolean;
}

@ObjectType({ description: "Regular class model" })
export class RegularClass {
  @Field(() => ObjectIdScalar)
  _id: Types.ObjectId;

  @Field()
  recurrenceId: string;

  @Field(() => [User])
  instructors: Array<PopulatedDoc<User>>;

  @Field(() => ClassDetails)
  details: ClassDetails;

  @Field(() => ClassCapacity)
  online: ClassCapacity;

  @Field(() => ClassCapacity)
  offline: ClassCapacity;

  @Field(() => ClassSchedule)
  schedule: ClassSchedule;

  @Field(() => ClassStatus)
  status: ClassStatus;

  @Field(() => ClassZoom, { nullable: true })
  zoom?: ClassZoom;
}

@InputType()
class ClassZoomInput implements Partial<ClassZoom> {
  @Field(() => String, { nullable: true })
  meetingId: string;

  @Field(() => String, { nullable: true })
  password: string;

  @Field(() => String, { nullable: true })
  joinUrl?: string;
}

@InputType()
class ClassDetailsInput implements Partial<ClassDetails> {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => ObjectIdScalar)
  level: Types.ObjectId;

  @Field(() => [String], { nullable: "itemsAndList" })
  tags?: string[];
}
@InputType()
class ClassCapacityInput {
  @Field(() => Int, { defaultValue: 0 })
  capacity: number;

  @Field(() => [ObjectIdScalar], { nullable: "itemsAndList" })
  booked?: Types.ObjectId[];

  @Field(() => Int, { defaultValue: 1 })
  bookingTimeLimit: number;

  @Field(() => Int, { defaultValue: 1 })
  cancelTimeLimit: number;

  @Field(() => Int, { defaultValue: 10 })
  cost: Number;
}
@InputType()
class ClassScheduleInput implements Partial<ClassSchedule> {
  @Field()
  date: Date;

  @Field()
  isAllDay: boolean;

  @Field(() => Int)
  duration: number;

  @Field()
  rString: string;
}
@InputType()
class ClassStatusInput implements Partial<ClassStatus> {
  @Field({ nullable: true })
  isRunning?: boolean;

  @Field()
  isPublished: boolean;

  @Field()
  isVIPOnly: boolean;
}

@InputType({ description: "Regular class input model" })
export class RegularClassInput implements Partial<RegularClass> {
  @Field(() => ObjectIdScalar, { nullable: true })
  _id?: Types.ObjectId;

  @Field({ nullable: true })
  recurrenceId?: string;

  @Field(() => [ObjectIdScalar])
  instructors: Types.DocumentArray<User>;

  @Field(() => ClassDetailsInput)
  details: ClassDetailsInput;

  @Field(() => ClassCapacityInput)
  online: ClassCapacityInput;

  @Field(() => ClassCapacityInput)
  offline: ClassCapacityInput;

  @Field(() => ClassScheduleInput)
  schedule: ClassScheduleInput;

  @Field(() => ClassStatusInput)
  status: ClassStatusInput;

  @Field(() => ClassZoomInput, { nullable: true })
  zoom?: ClassZoomInput;

  @Field({ nullable: true })
  createZoomMeeting?: Boolean;
}

@ArgsType()
export class UpdateClassMutationArgs {
  @Field(() => ObjectIdScalar)
  _id: Types.ObjectId;

  @Field(() => ObjectIdScalar)
  updatedBy: Types.ObjectId;

  @Field()
  action: string;

  @Field({ nullable: true })
  reason?: string;
}
