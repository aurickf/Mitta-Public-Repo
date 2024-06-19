import { SessionModel } from "@/models/index";
import { Authorized, Query, Resolver } from "type-graphql";
import { Session } from "./session";

@Resolver(Session)
export class SessionResolver {
  @Authorized(["ADMIN"])
  @Query(() => [Session])
  async sessions() {
    try {
      return await SessionModel.find({});
    } catch (error) {
      return error;
    }
  }
}
