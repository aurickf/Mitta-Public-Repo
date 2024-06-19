import {
  CounterModel,
  FeatureModel,
  LogModel,
  MembershipModel,
  MembershipPackageModel,
  MessageModel,
  PaymentMethodModel,
  UserModel,
} from "@/models/index";
import { deleteS3Objects, presignS3Url, s3client } from "@/utils/aws";
import { membershipCounterString } from "@/utils/counter";
import {
  DataException,
  InputException,
  RuleException,
  membershipError,
  membershipPackageError,
  paymentMethodError,
  userError,
} from "@/utils/error_message";
import {
  EmailParams,
  formatTable,
  sendNotificationEmail,
} from "@/utils/mailer";
import { sortByCreatedAtAsc } from "@/utils/sort";
import { CopyObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import GraphQLUpload from "graphql-upload/public/GraphQLUpload.js";
import { Upload as UploadType } from "graphql-upload/public/Upload.js";
import { DateTime } from "luxon";
import { ObjectId } from "mongodb";
import { HydratedDocument, PopulatedDoc, Types } from "mongoose";
import path from "path";
import { BookingCard, User } from "src/generated/graphql";
import { AWSPrefix } from "src/schema/file";
import { Arg, Args, Authorized, Mutation, Query, Resolver } from "type-graphql";
import { v4 as uuidv4 } from "uuid";
import validator from "validator";
import { BookingStatusValue } from "./bookingCard";
import { cancelBookingCard } from "./bookingCard.resolver";
import { Feature } from "./feature";
import { uploadToAWS } from "./file.resolver";
import { CategoryValue, SubCategoryValue } from "./log";
import {
  EditMembershipInput,
  MarkMembershipAsInvalidInput,
  Membership,
  NewMembershipInput,
} from "./membership";

const bucket = process.env.AWS_BUCKET;
const bucketArchive = process.env.AWS_BUCKET_ARCHIVE;

const archiveProofOfTransfer = async ({
  url,
  user,
  note,
}: {
  url: string;
  user: string;
  note: string;
}) => {
  /**
   * Copy to archive bucket
   */
  await s3client.send(
    new CopyObjectCommand({
      CopySource: `${bucket}/payment/${url}`,
      Bucket: bucketArchive,
      Key: `payment/${user}-${note}-${DateTime.now().toFormat(
        "yyyy-LL-dd"
      )}-${path.extname(url)}`,
    })
  );

  /**
   * Delete from primary bucket
   */
  return await s3client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: `payment/${url}`,
    })
  );
};

const transferRemainingBalance = async (
  prevMembership: Types.ObjectId,
  currentMembership: Types.ObjectId
) => {
  try {
    return;
  } catch (error) {
    return error;
  }
};

@Resolver(() => Membership)
export class MembershipResolver {
  @Authorized(["ADMIN"])
  @Query(() => [Membership])
  async memberships() {
    try {
      return;
    } catch (error) {
      return error;
    }
  }

  @Authorized()
  @Query(() => Membership)
  async membership(@Arg("_id") _id: Types.ObjectId) {
    try {
      return;
    } catch (error) {
      return error;
    }
  }

  @Authorized()
  @Query(() => Membership)
  async latestUserMembership(@Arg("_id") _id: Types.ObjectId) {
    try {
      return;
    } catch (error) {
      return error;
    }
  }

  /**
   * To query memberships per user
   * Being used to in Membership History
   * @param _id
   * @returns
   */
  @Authorized()
  @Query(() => [Membership])
  async membershipsByUser(@Arg("_id") _id: Types.ObjectId) {
    try {
      const result = await MembershipModel.find({ user: _id }).sort({
        "payment.date": -1,
      });

      const res = await Promise.all(
        result.map(async (membership) => {
          if (membership.payment.url)
            membership.payment.url = await presignS3Url(
              process.env.AWS_PAYMENT + membership.payment.url
            );
          return membership;
        })
      );

      return res;
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Mutation(() => Membership)
  async markThisAndFollowingMembershipAsInvalid(
    @Args() { _id, updatedBy }: MarkMembershipAsInvalidInput
  ) {
    try {
      const currentMembership = await MembershipModel.findById(_id).populate<
        PopulatedDoc<BookingCard>
      >("booked");
      if (!currentMembership)
        throw new DataException(membershipError.NOT_FOUND);

      /**
       * Skip this step if membership is not verified or already invalidated
       */

      if (currentMembership.verified.isVerified) {
        /**
         * If this membership is not latest
         * Invalidate next membership first
         */
        if (currentMembership.next)
          await this.markThisAndFollowingMembershipAsInvalid({
            _id: currentMembership.next,
            updatedBy,
          });
        await cancelInvalidBookings(_id, updatedBy);
        await updateInvalidMembershipValues(_id, updatedBy);
      }

      return currentMembership;
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Mutation(() => Membership)
  async markThisMembershipAsInvalid(
    @Args() { _id, updatedBy }: MarkMembershipAsInvalidInput
  ) {
    try {
      const invalidMembership = await MembershipModel.findById(_id)
        .populate("user")
        .orFail();
      const latestMembership = await MembershipModel.findById(
        invalidMembership.user.membership.latest
      );
      const previousMembership = await MembershipModel.findById(
        invalidMembership.prev
      );

      const activeBookingsInInvalidMembershipAmount =
        invalidMembership.booked.length;

      /**
       * If Invalid membership is not latest, move bookings to latest
       */
      if (invalidMembership._id.toString() != latestMembership._id.toString()) {
        await copyBookingCards({
          source: invalidMembership._id,
          target: latestMembership._id,
        });

        await updateThisMembershipValues({ _id, updatedBy });

        await updateMembershipLink(_id);

        await updateMembershipTransferInOut(
          // @ts-ignore
          invalidMembership.next
        );

        await checkBalanceAndCancelBookings(latestMembership._id, updatedBy);
      } else {
        /**
         * Invalid membership is latest, and has previous
         */
        if (invalidMembership.prev) {
          await copyBookingCards({
            source: invalidMembership._id,
            target: previousMembership._id,
          });

          await updateThisMembershipValues({ _id, updatedBy });

          await updateMembershipLink(_id);

          await updatePreviousTransferOut(previousMembership._id);

          await updateUserLatestMembership({
            userId: invalidMembership.user._id,
            membershipId: previousMembership._id,
          });

          await checkBalanceAndCancelBookings(
            previousMembership._id,
            updatedBy
          );
        } else {
          /**
           * Invalid membership is latest but has no previous
           */

          for (let i = 0; i < activeBookingsInInvalidMembershipAmount; i++) {
            await cancelBookingCard({
              _id: invalidMembership.booked[i]._id,
              updatedBy: updatedBy,
              bookingStatus: BookingStatusValue.BOOKING_CANCELLED,
            });
          }

          await updateThisMembershipValues({ _id, updatedBy });

          await updateUserLatestMembership({
            userId: invalidMembership.user._id,
            membershipId: null,
          });
        }
      }
      return invalidMembership;
    } catch (error) {
      return error;
    }
  }

  @Authorized()
  @Mutation(() => Membership)
  async addMembership(
    @Args()
    { user: _id, membershipPackageId, note, payment, image }: NewMembershipInput
  ) {
    try {
      const membershipPackage = await MembershipPackageModel.findById(
        membershipPackageId
      );
      if (!membershipPackage)
        throw new DataException(membershipPackageError.NOT_FOUND);

      const paymentMethod = await PaymentMethodModel.findById(payment.method);
      if (!paymentMethod) throw new DataException(paymentMethodError.NOT_FOUND);

      if (paymentMethod.requireProof && !image)
        throw new InputException(paymentMethodError.REQUIRE_PROOF);

      const user = await UserModel.findById(_id);
      if (!user) throw new DataException(userError.NOT_FOUND);

      const _paymentDate = DateTime.fromJSDate(payment.date);

      const paymentDate = _paymentDate.toISO();
      const validUntil = _paymentDate
        .plus({ days: membershipPackage.validity })
        .endOf("day")
        .toISO();

      let _input = {
        user: _id,
        note: `[ ${membershipPackage.name} ] ${validator.escape(note.trim())}`,
        balance: {
          additional: membershipPackage.additional,
          validUntil,
        },
        payment: {
          amount: membershipPackage.price,
          method: paymentMethod.via,
          date: paymentDate,
          url: payment.url,
        },
      };

      const doc = new MembershipModel(_input);

      const paidAmount = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(membershipPackage.price);

      const formattedPaymentDate = DateTime.fromJSDate(payment.date).toFormat(
        "dd LLL yyyy"
      );

      const tableRows = [
        { label: "Requestor", content: user.name },
        { label: "Payment method", content: paymentMethod.via },
        {
          label: "Payment date",
          content: formattedPaymentDate,
        },
        {
          label: "Paid amount",
          content: paidAmount,
        },
      ];

      const emailParams = {
        identifier: process.env.EMAIL_ADMIN,
        subject: `New Membership Request for ${process.env.NEXT_PUBLIC_STUDIO_NAME} from ${user.name}`,
        header: `Notification`,
        htmlMessage: formatTable(tableRows),
        plainTextMessage: `You have pending membership request from ${user.name}.`,
      };

      // start upload here

      if (image) {
        // update doc here
        const newFileName = await uploadToAWS(image, "payment");
        doc.payment.url = newFileName;
      }

      await doc.save();

      const newLog = new LogModel({
        user: _id,
        category: CategoryValue.MEMBERSHIP,
        subCategory: SubCategoryValue.NEW,
        message: `Paid ${paidAmount} on ${formattedPaymentDate} via ${paymentMethod.via}. Notes from user : ${note}`,
      });

      await Promise.all([sendNotificationEmail(emailParams), newLog.save()]);

      /**
       * Auto approval check
       */
      const feature: HydratedDocument<Feature> = await FeatureModel.findOne({
        featureKey: "FEATURE_AUTO_APPROVE_MEMBERSHIP",
      });

      if (feature.isEnabled) {
        await this.editMembership({
          _id: doc._id,
          balance: doc.balance,
          payment: doc.payment,
          verified: {
            isVerified: true,
            reason: "Automatic Approval",
            by: feature.by as Types.ObjectId,
            date: new Date(),
          },
        });
      }

      return doc;
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Mutation(() => Membership)
  async editMembership(
    @Args() { _id, balance, payment, verified }: EditMembershipInput
  ) {
    const now = DateTime.now();
    const year = now.toFormat("yy");

    try {
      /**
       * Fetch membership data
       */
      const membership: HydratedDocument<Membership> =
        await MembershipModel.findById(_id).populate<PopulatedDoc<User>>(
          "user"
        );
      if (!membership) throw new DataException(membershipError.NOT_FOUND);

      /**
       * Fetch user data
       */
      const user: HydratedDocument<
        User,
        { membership: { latest: Types.ObjectId } }
      > = await UserModel.findById(membership.user);
      if (!user) throw new DataException(userError.NOT_FOUND);

      user.membership.latest;
      /**
       * Fetch updater data
       */
      const updater: HydratedDocument<User> = await UserModel.findById(
        verified.by
      );
      if (!updater) throw new DataException(userError.NOT_FOUND);

      /**
       * Fetch counter data
       */
      let membershipCounter = await CounterModel.findOne({
        keyword: "membership",
        prefix: year,
      });
      if (!membershipCounter) {
        membershipCounter = new CounterModel({
          keyword: "membership",
          prefix: year,
          counter: 0,
        });
      }

      /**
       * Fetch latest membership
       * If no latest (haven't purchased any), skip this step
       */
      let latestMembership: HydratedDocument<Membership>;
      if (user.membership?.latest) {
        latestMembership = await MembershipModel.findById(
          user.membership.latest
        );
        if (!latestMembership)
          throw new DataException(membershipError.NOT_FOUND);
      }

      membership.payment.method = payment.method;
      membership.payment.date = payment.date;
      membership.payment.amount = payment.amount;

      membership.balance.additional = balance.additional;
      membership.balance.validUntil = DateTime.fromJSDate(balance.validUntil)
        .endOf("day")
        .toJSDate();

      let title: string, notificationMessage: string, logMessage: string;
      let category: CategoryValue, subCategory: SubCategoryValue;
      let tableRows: Array<{ label: string; content: string }>;

      const verificationStatusIsUpdating =
        membership.verified.isVerified === null && verified.isVerified !== null;

      if (verificationStatusIsUpdating) {
        /**
         * If verification status is being updated
         */
        membership.verified.isVerified = verified.isVerified;
        membership.verified.date = now.toJSDate();
        membership.verified.by = updater._id;
        membership.verified.reason = verified?.reason;

        /**
         * If currently is not verified and input is to be verified
         */
        if (verified.isVerified) {
          /**
           * Approve membership request
           */
          membershipCounter.counter++;

          membership.note = membershipCounterString(membershipCounter);

          /**
           * If user uploaded an image
           */
          if (membership.payment.url) {
            /**
             * Move image to archive folder
             */
            await archiveProofOfTransfer({
              url: membership.payment.url,
              user: user.name,
              note: membership.note,
            });

            /**
             * Remove url from db
             */
            membership.payment.url = "";
          }

          /**
           * If user has latest membership, transfer remaining balance this to new membership
           */
          if (user.membership?.latest)
            transferRemainingBalance(user.membership.latest, membership._id);

          // TS warning due to intersection with Types.ObjectId introduced in user fetching
          // @ts-ignore
          user.membership.latest = _id;

          title = "New Membership Request Approval";
          notificationMessage = `Your request on new membership as been approved. New membership id : ${membership.note} `;

          category = CategoryValue.MEMBERSHIP;
          subCategory = SubCategoryValue.APPROVED;
          logMessage = `Membership ${membership.note} approved by ${updater.name}.`;

          tableRows = [
            { label: "Membership #", content: membership.note },
            {
              label: "Approval date",
              content: DateTime.fromJSDate(membership.verified.date).toFormat(
                "dd LLL yyyy"
              ),
            },
            { label: "Approved by", content: updater.name },
            {
              label: "Purchased balance",
              content: membership.balance.additional.toString(),
            },
          ];
        } else {
          /**
           * Reject membership request
           */
          membership.note = `Rejected - ${membership.note}`;

          if (membership.payment.url) {
            await deleteS3Objects(AWSPrefix.PAYMENT, [membership.payment.url]);
            membership.payment.url = "";
          }

          title = "Membership Verification Request Rejected";
          notificationMessage = `Your membership verification request submitted on ${DateTime.fromJSDate(
            membership.createdAt
          )
            .setZone("Asia/Jakarta")
            .toFormat(
              "dd LLL yyyy HH:mm"
            )} Jakarta time (UTC+7), has been rejected by ${
            updater.name
          } due to ${membership.verified.reason}`;

          category = CategoryValue.MEMBERSHIP;
          subCategory = SubCategoryValue.REJECTED;
          logMessage = `Membership submitted on ${DateTime.fromJSDate(
            membership.createdAt
          )
            .setZone("Asia/Jakarta")
            .toFormat(
              "dd LLL yyyy HH:mm"
            )} Jakarta time (UTC+7) - rejected by ${updater.name}. Reason : ${
            membership.verified.reason
          }`;

          tableRows = [
            {
              label: "Request date",
              content: DateTime.fromJSDate(membership.createdAt)
                .setZone("Asia/Jakarta")
                .toFormat("dd LLL yyyy HH:mm"),
            },
            {
              label: "",
              content: "Jakarta time (UTC+7)",
            },
            {
              label: "Rejected by",
              content: updater.name,
            },
            {
              label: "Reason",
              content: membership.verified.reason,
            },
          ];
        }
      }

      /**
       * Save changes
       */
      await Promise.all([
        membershipCounter.save(),
        ...(latestMembership ? [latestMembership.save()] : []),
        membership.save(),
        user.save(),
      ]);

      if (verificationStatusIsUpdating) {
        /**
         * Notifications
         */
        /**
         * Audit log
         */
        const newLog = new LogModel({
          user: user.id,
          category,
          subCategory,
          message: logMessage,
        });

        /**
         * In app notif
         */
        const newMessage = new MessageModel({
          user: user._id,
          title,
          message: notificationMessage,
        });

        /**
         * Email
         */
        const emailParams = {
          subject: title,
          header: `Notification`,
          htmlMessage: formatTable(tableRows),
          plainTextMessage: notificationMessage,
        };

        await Promise.all([
          newMessage.save(),
          newLog.save(),
          sendNotificationEmail({
            identifier: process.env.EMAIL_ADMIN,
            ...emailParams,
          }),
          sendNotificationEmail({
            identifier: user.email,
            ...emailParams,
          }),
        ]);
      }

      return membership;
    } catch (error) {
      return error;
    }
  }

  @Authorized(["ADMIN"])
  @Mutation(() => Membership)
  async deleteMembership(@Arg("_id") _id: Types.ObjectId) {
    try {
      const membership: HydratedDocument<Membership> =
        await MembershipModel.findById(_id);
      if (!membership) throw new DataException(membershipError.NOT_FOUND);

      const user: HydratedDocument<
        User,
        { membership: { latest: Types.ObjectId } }
      > = await UserModel.findById(membership.user);
      if (!user) throw new DataException(userError.NOT_FOUND);

      /**
       * Validation
       * - Verified membership may not be deleted
       * - Latest membership may not be deleted
       */
      if (membership.verified.isVerified)
        throw new RuleException(membershipError.DELETE_VERIFIED);

      if (user.membership.latest == _id)
        throw new RuleException(membershipError.DELETE_LATEST);

      return await MembershipModel.findByIdAndDelete(_id).orFail();
    } catch (error) {
      return error;
    }
  }

  @Authorized()
  @Mutation(() => String)
  async uploadProofOfPayment(
    @Arg("image", () => GraphQLUpload)
    image: UploadType
  ): Promise<string> {
    const { createReadStream, filename } = image;

    const ext = path.extname(filename);
    const newFileName = uuidv4() + ext;

    try {
      const bucketParams = {
        Bucket: process.env.AWS_BUCKET,
        Key: `payment/${newFileName}`,
        Body: createReadStream(),
      };

      const imageUpload = new Upload({
        client: s3client,
        params: bucketParams,
      });

      await imageUpload.done();

      return newFileName;
    } catch (error) {
      return error;
    }
  }

  @Authorized()
  @Mutation(() => Membership)
  async deleteProofOfPayment(@Arg("_id") _id: ObjectId) {
    try {
      const membership = await MembershipModel.findById(_id);

      await deleteS3Objects(AWSPrefix.PAYMENT, [membership.payment.url]);

      membership.payment.url = "";

      return await membership.save();
    } catch (error) {
      return error;
    }
  }
}

async function updateUserLatestMembership({
  userId,
  membershipId,
}: {
  userId: Types.ObjectId;
  membershipId: Types.ObjectId;
}) {
  try {
    const user = await UserModel.findById(userId);
    // @ts-ignore
    user.membership.latest = membershipId;

    await user.save();
  } catch (error) {
    return error;
  }
}

/**
 * Cancel if balance in target membership is not enough
 */
async function checkBalanceAndCancelBookings(
  _id: Types.ObjectId,
  updatedBy: Types.ObjectId
) {
  try {
    const currentMembership = await MembershipModel.findById(_id)
      .populate("booked")
      .populate("confirmed");

    const activeBookingLength = currentMembership.booked.length;
    let currentAvailableBalance = currentMembership.balance.available;

    for (
      let i = 0;
      i < activeBookingLength && currentAvailableBalance < 0;
      i++
    ) {
      await cancelBookingCard({
        _id: currentMembership.booked[activeBookingLength - (i + 1)]._id,
        updatedBy: updatedBy,
        bookingStatus: BookingStatusValue.BOOKING_CANCELLED,
      });
      currentAvailableBalance +=
        currentMembership.booked[activeBookingLength - i].cost;
    }
  } catch (error) {
    return error;
  }
}

/**
 * Cancel bookings made after this membership submitted
 */
async function cancelInvalidBookings(
  _id: Types.ObjectId,
  updatedBy: Types.ObjectId
) {
  try {
    const currentMembership = await MembershipModel.findById(_id).populate(
      "booked"
    );

    const bookingAmount = currentMembership.booked.length;

    for (let i = 0; i < bookingAmount; i++) {
      if (currentMembership.booked[i].createdAt > currentMembership.createdAt) {
        await cancelBookingCard({
          _id: currentMembership.booked[i]._id,
          updatedBy: updatedBy,
          bookingStatus: BookingStatusValue.BOOKING_CANCELLED,
        });
      }
    }
  } catch (error) {
    return error;
  }
}

/**
 * Adjust current membership values and move bookings to previous one
 */
async function updateInvalidMembershipValues(
  _id: Types.ObjectId,
  updatedBy: Types.ObjectId
) {
  try {
    const currentMembership = await MembershipModel.findById(_id).orFail();
    const user = await UserModel.findById(currentMembership.user).orFail();
    const updater = await UserModel.findById(updatedBy).orFail();

    /**
     * If membership has previous one to revert
     */
    if (currentMembership.prev) {
      /*
       * Update user latest to prev
       */
      user.membership.latest = currentMembership.prev;

      const previousMembership = await MembershipModel.findById(
        currentMembership.prev
      );

      /**
       * Move booked arrays to previous membership
       */
      previousMembership.booked = [
        ...previousMembership.booked,
        ...currentMembership.booked,
      ];

      previousMembership.confirmed = [
        ...previousMembership.confirmed,
        ...currentMembership.confirmed,
      ];

      previousMembership.cancelled = [
        ...previousMembership.cancelled,
        ...currentMembership.cancelled,
      ];

      previousMembership.balance.transferOut = 0;

      await previousMembership.save();
    } else {
      user.membership.latest = null;
    }

    /**
     * Update current membership values
     */
    currentMembership.payment.amount = 0;
    currentMembership.balance.additional = 0;
    currentMembership.balance.transferIn = 0;
    currentMembership.balance.transferOut = 0;
    currentMembership.note = `Invalid - ${currentMembership.note}`;
    currentMembership.verified = {
      isVerified: false,
      reason: `Invalid Request`,
      // @ts-ignore
      by: updatedBy,
      date: new Date(),
    };

    currentMembership.booked = [];
    currentMembership.confirmed = [];
    currentMembership.cancelled = [];

    const membershipNumber = currentMembership.note.split(" ")[2];

    const tableRows = [
      {
        label: "Membership #",
        content: membershipNumber,
      },
      {
        label: "Status",
        content: "Invalid Request",
      },
      {
        label: "Note",
        content: "Please kindly contact our admins if this is a mistake",
      },
    ];

    const notificationMessage = `Your membership ${membershipNumber} has been rejected. Some of your bookings status might be adjusted. If you believe this is a mistake please kindly contact our administrators.`;

    const emailParams: EmailParams = {
      identifier: user.email,
      header: `Notification`,
      subject: `Your Membership Has Been Rejected`,
      htmlMessage: formatTable(tableRows),
      plainTextMessage: notificationMessage,
    };

    const newLog = new LogModel({
      user: user._id,
      category: CategoryValue.MEMBERSHIP,
      subCategory: SubCategoryValue.CANCELLED,
      message: `Membership ${membershipNumber} marked as invalid by ${updater.name}`,
    });

    const newNotification = new MessageModel({
      user: user._id,
      title: `Membership ${membershipNumber} Rejected`,
      message: notificationMessage,
    });

    await Promise.all([user.save(), currentMembership.save()]);
    await Promise.all([
      sendNotificationEmail(emailParams),
      newNotification.save(),
      newLog.save(),
    ]);
  } catch (error) {
    return error;
  }
}

/**
 * Move booking cards to target membership,then delete from source membership
 * Active booking will be sorted by createdAt
 */
async function copyBookingCards({
  source,
  target,
}: {
  source: Types.ObjectId;
  target: Types.ObjectId;
}) {
  try {
    const sourceMembership = await MembershipModel.findById(source)
      .populate("user")
      .orFail();
    const targetMembership = await MembershipModel.findById(target);

    targetMembership.booked = [
      ...targetMembership.booked,
      ...sourceMembership.booked,
    ];
    targetMembership.confirmed = [
      ...targetMembership.confirmed,
      ...sourceMembership.confirmed,
    ];
    targetMembership.cancelled = [
      ...targetMembership.cancelled,
      ...sourceMembership.cancelled,
    ];

    targetMembership.booked.sort(sortByCreatedAtAsc);
    targetMembership.confirmed.sort(sortByCreatedAtAsc);
    targetMembership.cancelled.sort(sortByCreatedAtAsc);

    await targetMembership.save();
  } catch (error) {
    return error;
  }
}

/**
 * Update current membership values
 * @param param0
 * @returns void
 */
async function updateThisMembershipValues({
  _id,
  updatedBy,
}: {
  _id: Types.ObjectId;
  updatedBy: Types.ObjectId;
}) {
  try {
    const invalidMembership = await MembershipModel.findById(_id)
      .populate("user")
      .orFail();
    const user = await UserModel.findById(invalidMembership.user);
    const updater = await UserModel.findById(updatedBy);

    invalidMembership.booked = [];
    invalidMembership.confirmed = [];
    invalidMembership.cancelled = [];
    invalidMembership.payment.amount = 0;
    invalidMembership.balance.additional = 0;
    invalidMembership.balance.transferIn = 0;
    invalidMembership.balance.transferOut = 0;
    invalidMembership.note = `Invalid - ${invalidMembership.note}`;
    invalidMembership.verified = {
      isVerified: false,
      reason: `Invalid Request`,
      // @ts-ignore
      by: updatedBy,
      date: new Date(),
    };

    const membershipNumber = invalidMembership.note.split(" ")[2];

    const tableRows = [
      {
        label: "Membership #",
        content: membershipNumber,
      },
      {
        label: "Status",
        content: "Invalid Request",
      },
      {
        label: "Note",
        content: "Please kindly contact our admins if this is a mistake",
      },
    ];

    const notificationMessage = `Your membership ${membershipNumber} has been rejected. Some of your bookings status might be adjusted. If you believe this is a mistake please kindly contact our administrators.`;

    const emailParams: EmailParams = {
      identifier: user.email,
      header: `Notification`,
      subject: `Your Membership Has Been Rejected`,
      htmlMessage: formatTable(tableRows),
      plainTextMessage: notificationMessage,
    };

    const newLog = new LogModel({
      user: user._id,
      category: CategoryValue.MEMBERSHIP,
      subCategory: SubCategoryValue.CANCELLED,
      message: `Membership ${membershipNumber} marked as invalid by ${updater.name}`,
    });

    const newNotification = new MessageModel({
      user: user._id,
      title: `Membership ${membershipNumber} Rejected`,
      message: notificationMessage,
    });

    await invalidMembership.save();

    await Promise.all([
      sendNotificationEmail(emailParams),
      newNotification.save(),
      newLog.save(),
    ]);
  } catch (error) {
    return error;
  }
}

/**
 * Update current membership's previous and next link
 */
async function updateMembershipLink(_id: Types.ObjectId) {
  try {
    const invalidMembership = await MembershipModel.findById(_id);
    const nextMembership = await MembershipModel.findById(
      invalidMembership.next
    );
    const prevMembership = await MembershipModel.findById(
      invalidMembership.prev
    );

    if (nextMembership) nextMembership.prev = invalidMembership.prev ?? null;
    if (prevMembership) prevMembership.next = invalidMembership.next ?? null;

    invalidMembership.prev = null;
    invalidMembership.next = null;

    await Promise.all([
      invalidMembership.save(),
      ...[prevMembership && prevMembership.save()],
      ...[nextMembership && nextMembership.save()],
    ]);
  } catch (error) {
    return error;
  }
}

async function updatePreviousTransferOut(_id: Types.ObjectId) {
  try {
    const previousMembership = await MembershipModel.findById(_id);

    previousMembership.balance.transferOut = 0;

    await previousMembership.save();
  } catch (error) {
    return error;
  }
}

/**
 * Update memberships transfer in and transfer out
 * @param _id Membership's Object ID which values to be updated
 * @returns void
 */
async function updateMembershipTransferInOut(_id: Types.ObjectId) {
  try {
    const currentMembership: HydratedDocument<
      Membership,
      { next: Types.ObjectId }
    > = await MembershipModel.findById(_id)
      .populate("booked")
      .populate("confirmed")
      .populate("cancelled");

    const prevMembership: HydratedDocument<Membership> =
      await MembershipModel.findById(currentMembership.prev)
        .populate("booked")
        .populate("confirmed")
        .populate("cancelled");

    if (prevMembership) {
      currentMembership.balance.transferIn = prevMembership.balance.transferOut;
    } else currentMembership.balance.transferIn = 0;

    if (currentMembership?.next) {
      currentMembership.balance.transferOut =
        currentMembership.balance.additional +
        currentMembership.balance.transferIn;
    }

    await currentMembership.save();

    if (currentMembership.next)
      await updateMembershipTransferInOut(currentMembership.next);
  } catch (error) {
    console.error(error);
    return error;
  }
}
