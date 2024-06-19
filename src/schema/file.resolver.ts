import { EventBookingCardModel, MembershipModel } from "@/models/index";
import { deleteS3Objects, presignS3Url, s3client } from "@/utils/aws";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import { AWSBucket, AWSFileArrayInput, DeleteObject } from "./file";
import { Upload } from "@aws-sdk/lib-storage";
import { GraphQLUpload } from "graphql-upload";
import { Upload as UploadType } from "graphql-upload/public/Upload.js";
import { v4 as uuidv4 } from "uuid";
import path from "path";

export async function uploadToAWS(image: UploadType, folder: string) {
  const { createReadStream, filename } = await image;

  const ext = path.extname(filename);
  const newFileName = uuidv4() + ext;

  const bucketParams = {
    Bucket: process.env.AWS_BUCKET,
    Key: `${folder}/${newFileName}`,
    Body: createReadStream(),
  };

  const imageUpload = new Upload({
    client: s3client,
    params: bucketParams,
  });

  await imageUpload.done();
  return newFileName;
}

export async function listS3Content(mode, Prefix) {
  const bucket = process.env.AWS_BUCKET;
  const bucketArchive = process.env.AWS_BUCKET_ARCHIVE;

  return await s3client.send(
    new ListObjectsV2Command({
      Bucket: mode === "CLEAN_UP" ? bucket : bucketArchive,
      Prefix,
    })
  );
}

@Resolver(AWSBucket)
export class FileResolver {
  @Authorized(["ADMIN"])
  @Query(() => AWSBucket)
  async listMembershipBucketObjects(
    @Arg("mode")
    mode: "CLEAN_UP" | "ARCHIVE"
  ) {
    /**
     * Mode :
     * Clean Up
     * Find orphaned images which somehow detached from request, but stays in AWS and needs to be deleted manually
     *
     * Archive
     * Find images in archive folder
     *
     */

    let membershipPaymentUrlArray = [];
    let membershipPaymentUrl = process.env.AWS_PAYMENT_ARCHIVE;

    try {
      const resultMembershipPayment = await listS3Content(mode, "payment/");

      if (mode === "CLEAN_UP") {
        /**
         * Membership
         */
        membershipPaymentUrl = process.env.AWS_PAYMENT;
        const unverifiedMembershipRequests = await MembershipModel.find({
          "verified.isVerified": false,
          "payment.url": {
            $ne: "",
          },
        });
        unverifiedMembershipRequests.forEach((membership) =>
          membershipPaymentUrlArray.push(membership.payment.url)
        );
      }

      /**
       * Remove leading folder name
       */
      resultMembershipPayment.Contents.forEach((Content) => {
        Content.Key = Content.Key.split("/")[1];
      });

      /**
       * Filter results
       */
      let filteredResultMembership, filteredResultEvent;

      if (mode === "CLEAN_UP") {
        // Filter result to only Keys without membership request
        filteredResultMembership = resultMembershipPayment.Contents.filter(
          (Content) =>
            !membershipPaymentUrlArray.some((url) => Content.Key === url)
        );
      } else if (mode === "ARCHIVE") {
        filteredResultMembership = resultMembershipPayment.Contents.filter(
          (Content) => Content.Key
        );
      }

      /**
       * Presigned images
       */
      const signedMembershipPaymentContents = await Promise.all(
        filteredResultMembership.map(async (Content) => {
          Content.FileName = Content.Key;
          Content.Key = await presignS3Url(membershipPaymentUrl + Content.Key);
          return Content;
        })
      );

      resultMembershipPayment.Contents = signedMembershipPaymentContents;

      return resultMembershipPayment;
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Query(() => AWSBucket)
  async listEventBucketObjects(
    @Arg("mode")
    mode: "CLEAN_UP" | "ARCHIVE"
  ) {
    /**
     * Mode :
     * Clean Up
     * Find orphaned images which somehow detached from request, but stays in AWS and needs to be deleted manually
     *
     * Archive
     * Find images in archive folder
     *
     */

    let eventPaymentUrlArray = [];

    let eventPaymentUrl = process.env.AWS_SPECIAL_EVENT_ARCHIVE;

    try {
      const resultEventPayment = await listS3Content(mode, "event/");

      if (mode === "CLEAN_UP") {
        /**
         * Event
         */
        eventPaymentUrl = process.env.AWS_SPECIAL_EVENT;
        const unverifiedEventRegistrationRequests =
          await EventBookingCardModel.find({
            "status.value": {
              $eq: "Pending",
            },
            "payment.image": {
              $ne: "",
            },
          });

        unverifiedEventRegistrationRequests.forEach((booking) =>
          eventPaymentUrlArray.push(booking.payment.image)
        );
      }

      /**
       * Remove leading folder name
       */

      resultEventPayment.Contents.forEach((Content) => {
        Content.Key = Content.Key.split("/")[1];
      });

      /**
       * Filter results
       */
      let filteredResultMembership, filteredResultEvent;

      if (mode === "CLEAN_UP") {
        // Filter result to only Keys without membership request

        filteredResultEvent = resultEventPayment.Contents.filter(
          (Content) => !eventPaymentUrlArray.some((url) => Content.Key === url)
        );
      } else if (mode === "ARCHIVE") {
        filteredResultEvent = resultEventPayment.Contents.filter(
          (Content) => Content.Key
        );
      }

      /**
       * Presigned images
       */

      const signedEventPaymentContents = await Promise.all(
        filteredResultEvent.map(async (Content) => {
          Content.FileName = Content.Key;
          Content.Key = await presignS3Url(eventPaymentUrl + Content.Key);
          return Content;
        })
      );

      resultEventPayment.Contents = signedEventPaymentContents;

      return resultEventPayment;
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Mutation(() => DeleteObject)
  async deleteUnusedImages(
    @Arg("input") input: AWSFileArrayInput
  ): Promise<DeleteObject> {
    try {
      const { prefix, fileNames } = input;

      return await deleteS3Objects(prefix, fileNames);
    } catch (error) {
      return error;
    }
  }
}
