import { CounterModel } from "@/models/index";
import { Authorized, Query, Resolver } from "type-graphql";
import { Counter } from "./counter";

@Resolver(Counter)
export class CounterResolver {
  @Authorized(["ADMIN"])
  @Query(() => [Counter])
  async counters() {
    try {
      return await CounterModel.find({});
    } catch (error) {
      return error;
    }
  }
}
