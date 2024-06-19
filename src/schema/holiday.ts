import { Types } from "mongoose";
import { Field, InputType, ObjectType } from "type-graphql";
import { ObjectIdScalar } from "./scalar";

@ObjectType({ description: "Holiday model" })
export class Holiday {
  @Field(() => ObjectIdScalar)
  _id: Types.ObjectId;

  @Field({ defaultValue: false })
  isEnabled: boolean;

  @Field()
  start: Date;

  @Field({ nullable: true })
  end?: Date;

  @Field()
  title: string;
}

@InputType()
export class HolidayInput implements Partial<Holiday> {
  @Field(() => ObjectIdScalar, { nullable: true })
  _id?: Types.ObjectId;

  @Field({ nullable: true })
  isEnabled?: boolean;

  @Field({ nullable: true })
  start?: Date;

  @Field({ nullable: true })
  end?: Date;

  @Field({ nullable: true })
  title?: string;
}
