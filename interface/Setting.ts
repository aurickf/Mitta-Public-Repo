import { MutationFunction } from "react-query";

interface IColumnSetting {
  field: string;
  header: string;
  label: string;
  defaultValue?: string | number;
  dataType?: string;
  sortable?: boolean;
  rules?: {
    required?: string;
  };
  keyfilter?: any;
}

export interface ISettingProps {
  title: string;
  columns: Array<IColumnSetting>;
  query: Function;
  datakey: string;
  onSuccess: Function;
  onError: Function;
  mutation: {
    addMutation: MutationFunction;
    editMutation: MutationFunction;
    deleteMutation: MutationFunction;
  };
}
