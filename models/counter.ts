import { Model, model, models, Schema } from "mongoose";
import { Counter } from "src/generated/graphql";

const CounterSchema = new Schema<Counter>({
  keyword: {
    type: String,
    required: true,
  },

  prefix: {
    type: String,
  },

  counter: {
    type: Number,
  },
});

export const CounterModel =
  (models.Counter as Model<Counter>) || model("Counter", CounterSchema);
