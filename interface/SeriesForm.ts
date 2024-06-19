import { Types } from "mongoose";

export interface ISeriesFormProps {
  selectedSeriesId?: Types.ObjectId;
  onSuccess: Function;
  onError: Function;
}
