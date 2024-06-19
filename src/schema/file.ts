import { DeleteObjectCommandOutput, RequestCharged } from "@aws-sdk/client-s3";
import type { ResponseMetadata } from "@aws-sdk/types";
import { Field, InputType, ObjectType } from "type-graphql";

export enum AWSPrefix {
  PAYMENT = "payment/",
  AVATAR = "avatar/",
  EVENT = "event/",
}

@InputType()
export class AWSFileArrayInput {
  @Field()
  prefix: AWSPrefix;

  @Field(() => [String])
  fileNames: String[];
}

@ObjectType()
class ResponseMetadataClass implements ResponseMetadata {
  @Field({ nullable: true })
  httpStatusCode?: number;

  @Field({ nullable: true })
  requestId?: string;

  @Field({ nullable: true })
  extendedRequestId?: string;

  @Field({ nullable: true })
  cfId?: string;

  @Field({ nullable: true })
  attempts?: number;

  @Field({ nullable: true })
  totalRetryDelay?: number;
}

@ObjectType()
export class DeleteObject implements Partial<DeleteObjectCommandOutput> {
  @Field({ nullable: true })
  DeleteMarker?: boolean;

  @Field({ nullable: true })
  VersionId?: string;

  // @Field({ nullable: true })
  // RequestCharged?: RequestCharged;

  @Field(() => ResponseMetadataClass, { name: "Metadata" })
  $metadata: ResponseMetadata;
}

@ObjectType()
export class AWSFile {
  @Field({ nullable: true })
  Key: String;

  @Field({ nullable: true })
  FileName: String;

  @Field({ nullable: true })
  Size: Number;

  @Field({ nullable: true })
  LastModified: Date;
}

@ObjectType({ description: "File model" })
export class AWSBucket {
  @Field()
  Name: String;

  @Field()
  KeyCount: Number;

  @Field()
  MaxKeys: Number;

  @Field()
  Prefix: String;

  @Field()
  IsTruncated: Boolean;

  @Field(() => [AWSFile])
  Contents: AWSFile[];
}
