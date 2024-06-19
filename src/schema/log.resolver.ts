import { LogModel } from "@/models/index";
import { Authorized, Query, Resolver } from "type-graphql";
import { Log } from "./log";

@Resolver(Log)
export class LogResolver {
  @Authorized(["ADMIN"])
  @Query(() => [Log])
  async getAllLogs() {
    return await LogModel.find({})
      .populate({ path: "user", select: "name" })
      .sort({ createdAt: -1 });
  }
}
