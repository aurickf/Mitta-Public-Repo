import { CalendarProps } from "primereact/calendar";
import { CheckboxProps } from "primereact/checkbox";
import { ChipsProps } from "primereact/chips";
import { DropdownProps } from "primereact/dropdown";
import { InputNumberProps } from "primereact/inputnumber";
import { InputSwitchProps } from "primereact/inputswitch";
import { InputTextProps } from "primereact/inputtext";
import { InputTextareaProps } from "primereact/inputtextarea";
import { MultiSelectProps } from "primereact/multiselect";
import { RadioButtonProps } from "primereact/radiobutton";
import { SelectButtonProps } from "primereact/selectbutton";

export interface RequiredInterface {
  required: string;
}

export interface InputFormTemplateInterface {
  label?: string;
  rules?: RequiredInterface | any;
}

export interface CalendarPropsInterface
  extends InputFormTemplateInterface,
    CalendarProps {}

export interface CheckboxPropsInterface
  extends InputFormTemplateInterface,
    CheckboxProps {}

export interface ChipPropsInterface
  extends InputFormTemplateInterface,
    ChipsProps {
  name?: string;
}

export interface DropdownPropsInterface
  extends SelectPropsTemplate,
    DropdownProps {}

export interface MultiSelectPropsInterface
  extends SelectPropsTemplate,
    MultiSelectProps {}

export interface InputNumberPropsInterface
  extends InputFormTemplateInterface,
    InputNumberProps {}

export interface InputSwitchPropsInterface
  extends InputFormTemplateInterface,
    InputSwitchProps {}

export interface InputTextPropsInterface
  extends InputFormTemplateInterface,
    InputTextProps {}

export interface InputTextareaPropsInterface
  extends InputFormTemplateInterface,
    InputTextareaProps {}

export interface RadioButtonPropsInterface
  extends InputFormTemplateInterface,
    RadioButtonProps {}

export interface SelectPropsTemplate {
  label: string;
  rules?: RequiredInterface | any;
}

export interface SelectButtonPropsInterface
  extends InputFormTemplateInterface,
    SelectButtonProps {
  name?: string;
}

export interface TwoLabelSwitchInterface {
  name: string;
  left: string;
  right: string;
}
