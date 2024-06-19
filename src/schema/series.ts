import { PopulatedDoc, Types } from "mongoose";
import { Field, InputType, ObjectType } from "type-graphql";
import { ObjectIdScalar } from "./scalar";
import { RegularClass } from "./regularClass";
import { SpecialEvent } from "./specialEvent";

@ObjectType({ description: "Series model" })
export class Series {
  @Field(() => ObjectIdScalar)
  _id: Types.ObjectId;

  @Field({ nullable: true })
  isPublished?: boolean;

  @Field()
  title: string;

  @Field({ nullable: true })
  description: string;

  @Field(() => [RegularClass], { nullable: true })
  regularClass?: Array<PopulatedDoc<RegularClass>>;

  @Field(() => [SpecialEvent], { nullable: true })
  specialEvent?: Array<PopulatedDoc<SpecialEvent>>;
}

@InputType()
export class SeriesInput implements Partial<Series> {
  @Field(() => ObjectIdScalar, { nullable: true })
  _id?: Types.ObjectId;

  @Field({ nullable: true })
  isPublished?: boolean;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [ObjectIdScalar], { nullable: "items" })
  regularClass?: Array<Types.ObjectId>;

  @Field(() => [ObjectIdScalar], { nullable: "items" })
  specialEvent?: Array<Types.ObjectId>;
}
