import { Toast } from "primereact/toast";
import { MutableRefObject } from "react";
import { RegularClass, SpecialEvent } from "src/generated/graphql";

export interface IShareClassProps {
  event: RegularClass | SpecialEvent;
  toast: MutableRefObject<Toast>;
}
