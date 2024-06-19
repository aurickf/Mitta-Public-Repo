import { PopulatedDoc, Types } from "mongoose";
import { Field, InputType, Int, ObjectType } from "type-graphql";
import { EventBookingCard } from "./eventBookingCard";
import { ClassZoom } from "./regularClass";
import { ObjectIdScalar } from "./scalar";

@ObjectType()
class EventInstructor {
  @Field()
  name: String;
}

@ObjectType()
class EventDetails {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [String], { nullable: "itemsAndList" })
  tags?: string[];
}

@InputType()
class EventDetailsInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [String], { nullable: "itemsAndList" })
  tags?: string[];
}

@ObjectType()
class EventStatus {
  @Field({ nullable: true })
  isRunning?: boolean;

  @Field({ defaultValue: false })
  isPublished: boolean;

  @Field({ defaultValue: false })
  isVIPOnly: boolean;
}

@InputType()
class EventStatusInput {
  @Field({ nullable: true })
  isRunning?: boolean;

  @Field({ defaultValue: false })
  isPublished: boolean;

  @Field({ defaultValue: false })
  isVIPOnly: boolean;
}

@ObjectType()
class EventCapacity {
  @Field(() => Int, { nullable: true })
  availability?: number;

  @Field(() => Int, { defaultValue: 0 })
  capacity: number;

  @Field(() => [EventBookingCard], { nullable: "itemsAndList" })
  booked?: EventBookingCard[] | Types.ObjectId[];

  @Field()
  bookedSeat: Number;

  @Field(() => [EventBookingCard], { nullable: "itemsAndList" })
  confirmed?: EventBookingCard[] | Types.ObjectId[];

  @Field()
  confirmedSeat: Number;

  @Field(() => [EventBookingCard], { nullable: "itemsAndList" })
  rejected?: EventBookingCard[] | Types.ObjectId[];

  @Field()
  rejectedSeat: Number;

  @Field(() => Int, { defaultValue: 1 })
  bookingTimeLimit: number;

  @Field(() => Int, { defaultValue: 10 })
  cost: Number;
}

@InputType()
class EventCapacityInput implements Partial<EventCapacity> {
  @Field(() => Int, { defaultValue: 0 })
  capacity: number;

  @Field(() => Int, { defaultValue: 1 })
  bookingTimeLimit: number;

  @Field(() => Int, { defaultValue: 10 })
  cost: Number;
}

@ObjectType()
class EventSchedule {
  @Field({ defaultValue: new Date() })
  date: Date;

  @Field({ defaultValue: false })
  isAllDay: boolean;

  @Field(() => Int, { defaultValue: 100 })
  duration: number;

  @Field({ nullable: true })
  rString?: string;
}

@InputType()
class EventScheduleInput implements EventSchedule {
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
export class SpecialEvent {
  @Field(() => ObjectIdScalar)
  _id: Types.ObjectId;

  @Field()
  recurrenceId: string;

  @Field(() => [EventInstructor])
  instructors: Array<EventInstructor>;

  @Field(() => EventDetails)
  details: EventDetails;

  @Field(() => EventCapacity)
  online: EventCapacity;

  @Field(() => EventCapacity)
  offline: EventCapacity;

  @Field(() => EventSchedule)
  schedule: EventSchedule;

  @Field(() => EventStatus)
  status: EventStatus;

  @Field(() => ClassZoom, { nullable: true })
  zoom?: ClassZoom;
}

@InputType()
export class SpecialEventInput {
  @Field(() => ObjectIdScalar, { nullable: true })
  _id?: Types.ObjectId;

  @Field(() => [String])
  instructors: Array<String>;

  @Field(() => EventDetailsInput)
  details: EventDetailsInput;

  @Field(() => EventCapacityInput)
  online: EventCapacityInput;

  @Field(() => EventCapacityInput)
  offline: EventCapacityInput;

  @Field(() => EventScheduleInput)
  schedule: EventScheduleInput;

  @Field(() => EventStatusInput)
  status: EventStatusInput;

  @Field({ nullable: true })
  createZoomMeeting?: boolean;
}
