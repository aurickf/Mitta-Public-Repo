import { Types } from "mongoose";
import { ArgsType, Field } from "type-graphql";
import { ObjectIdScalar } from "./scalar";

@ArgsType()
export class ClassesQueryArgs {
  @Field({ nullable: true })
  from: Date;

  @Field({ nullable: true })
  to: Date;

  @Field({ nullable: true })
  online: Boolean;

  @Field({ nullable: true })
  offline: Boolean;

  @Field(() => [ObjectIdScalar], { nullable: "itemsAndList" })
  instructors?: Types.ObjectId[];
}
