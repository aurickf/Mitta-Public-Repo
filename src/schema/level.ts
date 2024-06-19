import { Types } from "mongoose";
import { Field, InputType, ObjectType } from "type-graphql";
import { ObjectIdScalar } from "./scalar";

@ObjectType({ description: "Class level model" })
export class Level {
  @Field(() => ObjectIdScalar)
  _id: Types.ObjectId;

  @Field({ defaultValue: false })
  isEnabled: boolean;

  @Field()
  code: string;

  @Field()
  description: string;
}

@InputType({ description: "Class level input model" })
export class LevelInput implements Partial<Level> {
  @Field(() => ObjectIdScalar, { nullable: true })
  _id?: Types.ObjectId;

  @Field({ nullable: true })
  isEnabled?: boolean;

  @Field({ nullable: true })
  code?: string;

  @Field({ nullable: true })
  description?: string;
}
