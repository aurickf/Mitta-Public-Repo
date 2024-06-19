import { Types } from "mongoose";
import { Field, InputType, ObjectType } from "type-graphql";
import { ObjectIdScalar } from "./scalar";

@ObjectType({ description: "Announcement model" })
export class Announcement {
  @Field(() => ObjectIdScalar)
  _id: Types.ObjectId;

  @Field({ defaultValue: false })
  isEnabled: boolean;

  @Field({ nullable: true })
  isPrivate?: boolean;

  @Field({ nullable: true })
  isPublic?: boolean;

  @Field()
  start: Date;

  @Field({ nullable: true })
  end?: Date;

  @Field()
  text: string;
}

@InputType()
export class AnnouncementInput implements Partial<Announcement> {
  @Field(() => ObjectIdScalar, { nullable: true })
  _id?: Types.ObjectId;

  @Field({ nullable: true })
  isEnabled?: boolean;

  @Field({ nullable: true })
  isPrivate?: boolean;

  @Field({ nullable: true })
  isPublic?: boolean;

  @Field({ nullable: true })
  start?: Date;

  @Field({ nullable: true })
  end?: Date;

  @Field({ nullable: true })
  text?: string;
}
