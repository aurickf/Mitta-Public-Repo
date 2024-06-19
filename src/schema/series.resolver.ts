import { SeriesModel } from "@/models/series";
import { InputException, seriesError } from "@/utils/error_message";
import { ObjectId } from "mongodb";
import { HydratedDocument, Types } from "mongoose";
import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import validator from "validator";
import { Series, SeriesInput } from "./series";

function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}
function removeDuplicates(eventArray: Array<Types.ObjectId>) {
  let _array = eventArray.map((_id) => _id.toString());
  return _array.filter(onlyUnique);
}

function mapUserInput(input) {
  const { isPublished, title, description, regularClass, specialEvent } = input;

  let _title = validator.escape(title.trim());
  _title = _title.split(" ").join("_");
  const _regularClass = removeDuplicates(regularClass);
  const _specialEvent = removeDuplicates(specialEvent);

  const _description = description.trim();

  return {
    isPublished,
    title: _title,
    description: _description,
    regularClass: _regularClass,
    specialEvent: _specialEvent,
  };
}

@Resolver(Series)
export class SeriesResolver {
  // @Authorized(["ADMIN"])
  @Query(() => [Series])
  async allPublishedSeries() {
    try {
      return await SeriesModel.find({ isPublished: true })
        .populate("regularClass")
        .populate("specialEvent")
        .sort({ title: 1 });
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Query(() => [Series])
  async allSeries() {
    try {
      return await SeriesModel.find()
        .populate("regularClass")
        .populate("specialEvent");
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Query(() => Series)
  async series(@Arg("_id") _id: Types.ObjectId) {
    try {
      return await SeriesModel.findOne(_id)
        .populate({
          path: "regularClass",
          select: "details.title schedule.date",
          populate: {
            path: "instructors",
            select: "name",
          },
        })
        .populate("specialEvent");
    } catch (error) {
      return error;
    }
  }

  @Query(() => Series)
  async seriesTitle(@Arg("title") title: String) {
    try {
      const res = await SeriesModel.findOne({ title })
        .populate({
          path: "regularClass",
          populate: {
            path: "instructors details.level",
          },
        })
        .populate({
          path: "specialEvent",
          populate: {
            path: "online.booked online.confirmed online.rejected offline.booked offline.confirmed offline.rejected",
          },
        });

      return res;
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Query(() => Boolean)
  async isSeriesTitleExist(@Arg("title") title: String) {
    try {
      let _title = validator.escape(title.trim());
      _title = _title.split(" ").join("_");

      const res = await SeriesModel.findOne({ title: _title });

      return !!res;
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Mutation(() => Series)
  async addSeries(@Arg("input") input: SeriesInput) {
    try {
      const _input = mapUserInput(input);
      const isTitleExist = await this.isSeriesTitleExist(_input.title);

      if (isTitleExist) {
        throw new InputException(seriesError.ALREADY_EXIST);
      }

      const newSeries = new SeriesModel(_input);

      return await newSeries.save();
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Mutation(() => Series)
  async editSeries(@Arg("input") input: SeriesInput) {
    try {
      const _input = mapUserInput(input);

      const isTitleExist = await this.isSeriesTitleExist(_input.title);

      // @ts-ignore
      const series: HydratedDocument<
        Series,
        {
          regularClass: Array<Types.ObjectId>;
          specialEvent: Array<Types.ObjectId>;
        }
      > = await SeriesModel.findById(input._id).orFail();

      if (_input.title !== series.title && isTitleExist)
        throw new InputException(seriesError.ALREADY_EXIST);

      series.isPublished = _input.isPublished;
      series.title = _input.title;
      series.description = _input.description;
      // @ts-expect-error
      series.regularClass = _input.regularClass;
      // @ts-expect-error
      series.specialEvent = _input.specialEvent;

      return await series.save();
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Mutation(() => Series)
  async deleteSeries(@Arg("_id") _id: ObjectId) {
    try {
      return await SeriesModel.findByIdAndDelete(_id).orFail();
    } catch (error) {
      return error;
    }
  }
}
