import { SpecialEvent } from "src/generated/graphql";
import { RegularClassDataView } from "./RegularClassDataView";

export interface SpecialEventDataView
  extends Omit<RegularClassDataView, "value"> {
  value: SpecialEvent;
}
