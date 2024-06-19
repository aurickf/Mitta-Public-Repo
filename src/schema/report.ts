import { ArgsType, Field, ObjectType } from "type-graphql";

@ObjectType()
class BookingReportId {
  @Field({ nullable: true })
  classType?: string;

  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  week?: number;

  @Field({ nullable: true })
  user?: string;

  @Field({ nullable: true })
  instructor?: string;
}

@ObjectType()
export class BookingReport {
  @Field({ nullable: true })
  _id?: BookingReportId;

  @Field({ nullable: true })
  totalSeat?: number;

  @Field({ nullable: true })
  count?: number;

  @Field({ nullable: true })
  totalCost?: number;
}
