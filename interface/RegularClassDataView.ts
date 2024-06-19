import { RegularClass, RegularClassTemplate } from "src/generated/graphql";

export interface RegularClassDataView {
  value: RegularClass | RegularClassTemplate;
  schedule?: any;
  time?: any;
  label?: string;
  buttonLabel?: string;
  buttonDisabled?: boolean;
  valueOnline?: number;
  valueOffline?: number;
  onButtonClick?: () => void;
  bookingLabelOnline?: string;
  bookingLabelOffline?: string;
  cancelLabelOffline?: string;
  cancelLabelOnline?: string;
}
