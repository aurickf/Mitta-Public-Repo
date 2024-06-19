import { Schema, model, models, Types, Model } from "mongoose";
import { User } from "src/generated/graphql";
import crypto from "crypto";

const url = process.env.AWS_AVATAR;

const randomId = crypto.randomBytes(3).toString("hex");

const UserSchema = new Schema<User>({
  name: {
    type: String,
    default: "New User",
  },

  username: {
    type: String,
    required: true,
    default: "user" + randomId,
  },

  email: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    get: getImage,
  },

  phone: {
    type: String,
  },

  emailVerified: {
    type: Date,
  },

  role: {
    isInstructor: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isSuperAdmin: {
      type: Boolean,
      default: false,
    },
  },
  access: {
    register: {
      date: {
        type: Date,
        default: new Date(),
      },
    },
    approval: {
      isApproved: {
        type: Boolean,
        default: true,
      },
      date: {
        type: Date,
      },
      by: {
        type: Types.ObjectId,
        ref: "User",
      },
    },
    ban: {
      isBanned: {
        type: Boolean,
        default: false,
      },
      date: {
        type: Date,
      },
      by: {
        type: Types.ObjectId,
        ref: "User",
      },
      reason: {
        type: String,
      },
    },
    lastLoggedIn: {
      type: Date,
      default: new Date(),
    },
  },
  membership: {
    isVIP: {
      type: Boolean,
      default: false,
    },

    latest: {
      type: Types.ObjectId,
      ref: "Membership",
    },
  },
});

function getImage(image: string) {
  if (image) return url + image;
  return "";
}

export const UserModel =
  (models.User as Model<User>) || model("User", UserSchema);
