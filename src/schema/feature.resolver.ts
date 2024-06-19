import { FeatureModel } from "@/models/index";
import { RuleException, featureError } from "@/utils/error_message";
import { HydratedDocument, Types } from "mongoose";
import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import { Feature } from "./feature";

@Resolver(Feature)
export class FeatureResolver {
  @Authorized(["ADMIN"])
  @Query(() => Feature)
  async featureTemplate() {
    try {
      const res = await FeatureModel.findOne({
        featureKey: "FEATURE_TEMPLATE",
      });

      if (!res) {
        const newFeature = new FeatureModel({
          isEnabled: false,
          featureKey: "FEATURE_TEMPLATE",
        });
        return await newFeature.save();
      }

      return res;
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Query(() => Feature)
  async featureSeries() {
    try {
      const res = await FeatureModel.findOne({ featureKey: "FEATURE_SERIES" });

      if (!res) {
        const newFeature = new FeatureModel({
          isEnabled: false,
          featureKey: "FEATURE_SERIES",
        });
        return await newFeature.save();
      }

      return res;
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Query(() => Feature)
  async featureAnalytics() {
    try {
      const res = await FeatureModel.findOne({
        featureKey: "FEATURE_ANALYTICS",
      });

      if (!res) {
        const newFeature = new FeatureModel({
          isEnabled: false,
          featureKey: "FEATURE_ANALYTICS",
        });

        return await newFeature.save();
      }

      return res;
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Query(() => Feature)
  async featureAutoApproveMembership() {
    try {
      const res = await FeatureModel.findOne({
        featureKey: "FEATURE_AUTO_APPROVE_MEMBERSHIP",
      }).populate("by");

      if (!res) {
        const newFeature = new FeatureModel({
          isEnabled: false,
          featureKey: "FEATURE_AUTO_APPROVE_MEMBERSHIP",
        });

        return await newFeature.save();
      }

      return res;
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Mutation(() => Feature)
  async setAutoApproverAdmin(@Arg("_id") _id: Types.ObjectId) {
    try {
      const res: HydratedDocument<Feature> = await FeatureModel.findOne({
        featureKey: "FEATURE_AUTO_APPROVE_MEMBERSHIP",
      });

      res.by = _id;

      return await res.save();
    } catch (error) {
      return error;
    }
  }

  @Authorized(["SUPER"])
  @Mutation(() => Feature)
  async toggleFeature(@Arg("featureKey") featureKey: String) {
    try {
      const res = await FeatureModel.findOne({ featureKey });

      if (featureKey === "FEATURE_AUTO_APPROVE_MEMBERSHIP" && !res.by)
        throw new RuleException(featureError.NO_UPDATER);

      res.isEnabled = !res.isEnabled;

      return await res.save();
    } catch (error) {
      return error;
    }
  }
}
