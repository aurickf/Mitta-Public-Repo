import { Types } from "mongoose";
import { Field, InputType, Int, ObjectType } from "type-graphql";
import { Level } from "./level";
import { ObjectIdScalar } from "./scalar";
import { User } from "./user";

import type { PopulatedDoc } from "mongoose";

@ObjectType()
class ClassTemplateDetails {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Level)
  level: PopulatedDoc<Level>;

  @Field(() => [String], { nullable: "itemsAndList" })
  tags?: string[];
}

@ObjectType()
class ClassTemplateCapacity {
  @Field(() => Int, { defaultValue: 0 })
  capacity: number;

  @Field(() => Int, { defaultValue: 1 })
  bookingTimeLimit: number;

  @Field(() => Int, { defaultValue: 1 })
  cancelTimeLimit: number;

  @Field(() => Int, { defaultValue: 10 })
  cost: Number;
}

@ObjectType()
class ClassTemplateSchedule {
  @Field()
  startTime: Date;

  @Field(() => [Int], { defaultValue: [0, 1, 2, 3, 4, 5, 6] })
  day: number[];

  @Field(() => Int, { defaultValue: 0 })
  duration: number;
}

@ObjectType({ description: "Class template model" })
export class RegularClassTemplate {
  @Field(() => ObjectIdScalar)
  _id: Types.ObjectId;

  @Field(() => [User], { nullable: "itemsAndList" })
  instructors?: Array<PopulatedDoc<User>>;

  @Field(() => ClassTemplateDetails)
  details: ClassTemplateDetails;

  @Field(() => ClassTemplateCapacity)
  online: ClassTemplateCapacity;

  @Field(() => ClassTemplateCapacity)
  offline: ClassTemplateCapacity;

  @Field(() => ClassTemplateSchedule)
  schedule: ClassTemplateSchedule;
}

@InputType()
class ClassTemplateDetailsInput implements Partial<ClassTemplateDetails> {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => ObjectIdScalar)
  level: Types.ObjectId;

  @Field(() => [String], { nullable: true })
  tags?: string[];
}

@InputType()
class ClassTemplateCapacityInput implements Partial<ClassTemplateCapacity> {
  @Field(() => Int)
  capacity: number;

  @Field(() => Int)
  bookingTimeLimit: number;

  @Field(() => Int)
  cancelTimeLimit: number;

  @Field(() => Int, { defaultValue: 10 })
  cost: Number;
}

@InputType()
class ClassTemplateScheduleInput implements Partial<ClassTemplateSchedule> {
  @Field()
  startTime: Date;

  @Field(() => [Int])
  day: number[];

  @Field(() => Int)
  duration: number;
}

@InputType({ description: "Class template input model" })
export class RegularClassTemplateInput
  implements Partial<RegularClassTemplate>
{
  @Field(() => ObjectIdScalar, { nullable: true })
  _id?: Types.ObjectId;

  @Field(() => [ObjectIdScalar], { nullable: "itemsAndList" })
  instructors?: Types.ObjectId[];

  @Field(() => ClassTemplateDetailsInput)
  details: ClassTemplateDetailsInput;

  @Field(() => ClassTemplateCapacityInput)
  online: ClassTemplateCapacityInput;

  @Field(() => ClassTemplateCapacityInput)
  offline: ClassTemplateCapacityInput;

  @Field(() => ClassTemplateScheduleInput)
  schedule: ClassTemplateScheduleInput;
}
