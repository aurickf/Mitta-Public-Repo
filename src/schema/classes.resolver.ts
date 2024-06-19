import { RegularClassModel, SpecialEventModel } from "@/models/index";
import { sortDate } from "@/utils/sort";
import { DateTime } from "luxon";
import {
  Arg,
  Args,
  Authorized,
  createUnionType,
  Query,
  Resolver,
} from "type-graphql";
import { ClassesQueryArgs } from "./classes";
import { RegularClass } from "./regularClass";
import { SpecialEvent } from "./specialEvent";

const SearchResultUnion = createUnionType({
  name: "SearchResult",
  types: () => [RegularClass, SpecialEvent] as const,
  resolveType: (value) => {
    if ("level" in value.details) {
      return RegularClass;
    }
    return SpecialEvent;
  },
});

@Resolver()
export class ClassesResolver {
  @Authorized()
  @Query(() => [SearchResultUnion])
  async searchClassesQuery(
    @Args() { from, to, online, offline, instructors }: ClassesQueryArgs
  ): Promise<Array<typeof SearchResultUnion>> {
    try {
      /**
       * Filter query to disallow past date classes to be retrieved
       */
      const earlierToday = DateTime.now().startOf("day").toJSDate();

      if (from < earlierToday) {
        from = earlierToday;
      }

      /**
       * Provide default values when no params sent from front end
       */
      const query = {
        "schedule.date": {
          $gte: from ?? DateTime.now().startOf("day").toJSDate(),
          $lte: to ?? DateTime.now().endOf("month").toJSDate(),
        },
        "status.isPublished": true,
        "status.isRunning": null,
      };

      let regularClassResult = [],
        specialEventResult = [],
        allResults = [];

      if (!instructors || instructors.length === 0) {
        regularClassResult = await RegularClassModel.find(query)
          .populate({
            path: "instructors",
            select: "name image",
          })
          .populate("details.level")
          .sort({ "schedule.date": 1 });
        specialEventResult = await SpecialEventModel.find(query)
          .populate("online.booked")
          .populate("online.confirmed")
          .populate("online.rejected")
          .populate("offline.booked")
          .populate("offline.confirmed")
          .populate("offline.rejected")
          .sort({
            "schedule.date": 1,
          });
      } else {
        regularClassResult = await RegularClassModel.find(query)
          .where("instructors")
          .in(instructors)
          .populate("details.level")
          .populate("instructors")
          .sort({ "schedule.date": 1 });
        specialEventResult = await SpecialEventModel.find(query)
          .populate("online.booked")
          .populate("online.confirmed")
          .populate("online.rejected")
          .populate("offline.booked")
          .populate("offline.confirmed")
          .populate("offline.rejected")
          .sort({
            "schedule.date": 1,
          });
      }

      allResults = [...specialEventResult, ...regularClassResult].sort(
        sortDate
      );

      /**
       * User does not specify searched class type or choose both online and offline
       */
      if ((online && offline) || (!online && !offline))
        return allResults.filter((event) => {
          return (
            event.online.availability > 0 || event.offline.availability > 0
          );
        });

      /**
       * Online available only
       */
      if (online && !offline)
        return allResults.filter((event) => event.online.availability > 0);

      /**
       * Offline available only
       */
      if (!online && offline)
        return allResults.filter((event) => event.offline.availability > 0);
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Query(() => [SearchResultUnion])
  async searchAllClassesQuery(
    @Args() { from, to, online, offline, instructors }: ClassesQueryArgs
  ): Promise<Array<typeof SearchResultUnion>> {
    try {
      /**
       * Provide default values when no params sent from front end
       */
      const query = {
        "schedule.date": {
          $gte: from ?? DateTime.now().startOf("day").toJSDate(),
          $lte: to ?? DateTime.now().endOf("month").toJSDate(),
        },
        "status.isPublished": true,
        "status.isRunning": {
          $ne: false,
        },
      };

      let regularClassResult = [],
        specialEventResult = [],
        allResults = [];

      if (!instructors || instructors.length === 0) {
        regularClassResult = await RegularClassModel.find(query)
          .populate({
            path: "instructors",
            select: "name image",
          })
          .populate("details.level")
          .sort({ "schedule.date": 1 });
        specialEventResult = await SpecialEventModel.find(query)
          .populate("online.booked")
          .populate("online.confirmed")
          .populate("online.rejected")
          .populate("offline.booked")
          .populate("offline.confirmed")
          .populate("offline.rejected")
          .sort({
            "schedule.date": 1,
          });
      } else {
        regularClassResult = await RegularClassModel.find(query)
          .where("instructors")
          .in(instructors)
          .populate("details.level")
          .populate("instructors")
          .sort({ "schedule.date": 1 });
        specialEventResult = await SpecialEventModel.find(query)
          .populate("online.booked")
          .populate("online.confirmed")
          .populate("online.rejected")
          .populate("offline.booked")
          .populate("offline.confirmed")
          .populate("offline.rejected")
          .sort({
            "schedule.date": 1,
          });
      }

      allResults = [...specialEventResult, ...regularClassResult].sort(
        sortDate
      );

      return allResults;
    } catch (error) {
      return error;
    }
  }

  @Query(() => [SearchResultUnion])
  async searchClassTitleAndDate(
    @Arg("classTitle") classTitle: string,
    @Arg("date") date: string
  ): Promise<Array<typeof SearchResultUnion>> {
    let result: Array<typeof SearchResultUnion>;

    const title = classTitle.split("_").join(" ");

    const _date = date.split("_");
    const from = _date[0];
    const to = _date[1] ?? from;

    try {
      const specialEvents = await SpecialEventModel.find({
        "details.title": title,
        "schedule.date": {
          $gte: DateTime.fromISO(from).startOf("day").toJSDate(),
          $lte: DateTime.fromISO(to).endOf("day").toJSDate(),
        },
        "status.isPublished": true,
      })
        .populate("online.booked")
        .populate("online.confirmed")
        .populate("online.rejected")
        .populate("offline.booked")
        .populate("offline.confirmed")
        .populate("offline.rejected");

      const regularClasses = await RegularClassModel.find({
        "details.title": title,
        "schedule.date": {
          $gte: DateTime.fromISO(from).startOf("day").toJSDate(),
          $lte: DateTime.fromISO(to).endOf("day").toJSDate(),
        },
        "status.isPublished": true,
      })
        .populate("details.level")
        .populate("instructors");

      // @ts-expect-error
      result = [...specialEvents, ...regularClasses].sort(sortDate);

      return result;
    } catch (error) {
      return error;
    }
  }
}
