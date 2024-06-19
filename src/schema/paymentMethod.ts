import { Types } from "mongoose";
import { Field, InputType, ObjectType } from "type-graphql";
import { ObjectIdScalar } from "./scalar";

@ObjectType({ description: "Payment method model" })
export class PaymentMethod {
  @Field(() => ObjectIdScalar)
  _id: Types.ObjectId;

  @Field({ defaultValue: false })
  isEnabled: boolean;

  @Field({ defaultValue: false })
  isEnabledForMembership: boolean;

  @Field({ defaultValue: false })
  isEnabledForSpecialEvent: boolean;

  @Field({ defaultValue: false })
  requireProof: boolean;

  @Field()
  via: string;
}

@InputType({ description: "Payment method input model" })
export class Payment_MethodInput implements Partial<PaymentMethod> {
  @Field(() => ObjectIdScalar, { nullable: true })
  _id: Types.ObjectId;

  @Field({ nullable: true })
  isEnabled: boolean;

  @Field({ nullable: true })
  isEnabledForMembership?: boolean;

  @Field({ nullable: true })
  isEnabledForSpecialEvent?: boolean;

  @Field({ nullable: true })
  requireProof: boolean;

  @Field({ nullable: true })
  via?: string;
}
