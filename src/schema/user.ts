import GraphQLUpload from "graphql-upload/public/GraphQLUpload.js";
import Upload from "graphql-upload/public/Upload.js";
import { Types } from "mongoose";
import { ArgsType, Field, InputType, ObjectType } from "type-graphql";
import { Membership } from "./membership";
import { ObjectIdScalar } from "./scalar";
import type { PopulatedDoc } from "mongoose";

@ObjectType()
class UserAccessRegister {
  @Field({ defaultValue: new Date() })
  date?: Date;
}

@ObjectType()
class UserAccessApproval {
  @Field({ defaultValue: false })
  isApproved?: boolean;

  @Field({ nullable: true })
  date?: Date;

  @Field(() => User, { nullable: true })
  by?: PopulatedDoc<User>;
}

@ObjectType()
class UserAccessBan {
  @Field()
  isBanned: boolean;

  @Field({ nullable: true })
  date?: Date;

  @Field(() => User, { nullable: true })
  by?: PopulatedDoc<User>;

  @Field({ nullable: true })
  reason?: string;
}

@ObjectType()
class UserAccess {
  @Field({ nullable: true })
  register?: UserAccessRegister;

  @Field(() => UserAccessApproval)
  approval: UserAccessApproval;

  @Field()
  ban: UserAccessBan;

  @Field({ defaultValue: new Date() })
  lastLoggedIn: Date;
}

@ObjectType()
export class UserMembership {
  @Field({ defaultValue: false })
  isVIP: boolean;

  @Field(() => Membership, { nullable: true })
  latest?: PopulatedDoc<Membership>;
}

@ObjectType()
class UserRole {
  @Field()
  isInstructor: boolean;

  @Field()
  isAdmin: boolean;

  @Field({ nullable: true })
  isSuperAdmin?: boolean;
}

@ObjectType()
export class User {
  @Field(() => ObjectIdScalar)
  _id: Types.ObjectId;

  @Field()
  name: string;

  @Field({ nullable: true })
  username?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  image?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field()
  emailVerified: Date;

  @Field()
  role: UserRole;

  @Field()
  access: UserAccess;

  @Field()
  membership: UserMembership;
}

@InputType()
class UserAccessRegisterInput {
  @Field()
  date: Date;
}

@InputType()
class UserAccessApprovalInput implements Partial<UserAccessApproval> {
  @Field()
  isApproved: boolean;

  @Field({ nullable: true })
  date?: Date;

  @Field(() => ObjectIdScalar, { nullable: true })
  by?: Types.ObjectId;
}

@InputType()
class UserAccessBanInput implements Partial<UserAccessBan> {
  @Field()
  isBanned: boolean;

  @Field({ nullable: true })
  date?: Date;

  @Field(() => ObjectIdScalar, { nullable: true })
  by?: Types.ObjectId;

  @Field({ nullable: true })
  reason?: string;
}

@InputType()
export class UserRoleInput implements Partial<UserRole> {
  @Field()
  isInstructor: boolean;

  @Field()
  isAdmin: boolean;
}

@InputType()
export class UserAccessInput implements Partial<UserAccess> {
  @Field({ nullable: true })
  register?: UserAccessRegisterInput;

  @Field()
  approval: UserAccessApprovalInput;

  @Field()
  ban: UserAccessBanInput;

  @Field({ nullable: true })
  lastLoggedIn?: Date;
}

@InputType()
export class UserProfileInputArgs {
  @Field(() => ObjectIdScalar)
  _id: Types.ObjectId;

  @Field()
  name: string;

  @Field()
  phone: string;

  @Field()
  username: string;

  @Field({ nullable: true })
  image?: string;
}

@ArgsType()
export class UserProfileImageUploadArgs {
  @Field(() => ObjectIdScalar)
  _id: Types.ObjectId;

  @Field(() => GraphQLUpload)
  image: Upload;
}
