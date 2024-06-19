import { Model, model, models, Schema, Types } from "mongoose";
import { RegularClassTemplate } from "src/generated/graphql";

const TemplateSchema = new Schema<RegularClassTemplate>({
  instructors: {
    type: [Types.ObjectId],
    ref: "User",
    required: true,
  },

  details: {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    level: {
      type: Types.ObjectId,
      ref: "Level",
      required: true,
    },

    tags: {
      type: [String],
    },
  },

  online: {
    capacity: {
      type: Number,
      default: 0,
    },

    bookingTimeLimit: {
      type: Number,
      default: 1,
    },

    cancelTimeLimit: {
      type: Number,
      default: 1,
    },

    cost: {
      type: Number,
      default: 100,
    },
  },

  offline: {
    capacity: {
      type: Number,
      default: 0,
    },

    bookingTimeLimit: {
      type: Number,
      default: 12,
    },

    cancelTimeLimit: {
      type: Number,
      default: 24,
    },
    cost: {
      type: Number,
      default: 100,
    },
  },

  schedule: {
    day: {
      type: [Number],
      default: [0, 1, 2, 3, 4, 5, 6],
    },

    startTime: {
      type: Date,
    },

    duration: {
      type: Number,
      default: 0,
    },
  },
});

export const ClassTemplateModel =
  (models.Template as Model<RegularClassTemplate>) ||
  model("Template", TemplateSchema);
