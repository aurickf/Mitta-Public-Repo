import { ColumnProps } from "primereact/column";
import { KeyFilterType } from "primereact/keyfilter";
interface RequiredInterface {
  required: string;
}

export interface CustomColumn extends ColumnProps {
  defaultValue?: string | number;
  filter?: boolean;
  keyfilter?: KeyFilterType;
  label?: string;
  preselected?: boolean;
  required?: boolean;
  rules?: RequiredInterface | any;
}
