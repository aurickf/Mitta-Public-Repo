import {
  CalendarPropsInterface,
  CheckboxPropsInterface,
  ChipPropsInterface,
  DropdownPropsInterface,
  InputNumberPropsInterface,
  InputSwitchPropsInterface,
  InputTextareaPropsInterface,
  InputTextPropsInterface,
  MultiSelectPropsInterface,
  RadioButtonPropsInterface,
  SelectButtonPropsInterface,
  TwoLabelSwitchInterface,
} from "interface/InputForm";
import { Calendar } from "primereact/calendar";
import { Checkbox } from "primereact/checkbox";
import { Chips } from "primereact/chips";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { MultiSelect } from "primereact/multiselect";
import { RadioButton } from "primereact/radiobutton";
import { classNames } from "primereact/utils";
import { Controller, useFormContext } from "react-hook-form";
import { SelectButton } from "primereact/selectbutton";

export const CalendarForm = (props: CalendarPropsInterface) => {
  const { control } = useFormContext();
  const { name, label, rules } = props;

  return (
    <Controller
      control={control}
      name={name}
      rules={{ ...rules }}
      render={({ field, fieldState }) => (
        <span className="p-float-label">
          <Calendar
            {...field}
            {...props}
            className={classNames(
              { "inputfield w-full p-invalid": fieldState.error },
              { "inputfield w-full ": true }
            )}
          />
          <label
            htmlFor={name}
            className={classNames({ "p-error": fieldState.error })}
          >
            {!fieldState.error ? label : fieldState.error.message}
          </label>
        </span>
      )}
    />
  );
};

export const CheckBoxForm = (props: CheckboxPropsInterface) => {
  const { control } = useFormContext();
  const { name, label, rules } = props;

  return (
    <Controller
      control={control}
      name={name}
      rules={{ ...rules }}
      render={({ field, fieldState }) => (
        <div className="flex gap-2">
          <div>
            <Checkbox
              {...field}
              {...props}
              checked={field.value}
              className={classNames(
                { "inputfield w-full p-invalid": fieldState.error },
                { "inputfield w-full ": true }
              )}
            />
          </div>
          <div>
            <label
              htmlFor={name}
              className={classNames({ "p-error": fieldState.error })}
            >
              {!fieldState.error ? label : fieldState.error.message}
            </label>
          </div>
        </div>
      )}
    />
  );
};

export const ChipsForm = (props: ChipPropsInterface) => {
  const { control } = useFormContext();
  const { name, label, rules } = props;

  return (
    <Controller
      control={control}
      name={name}
      rules={{ ...rules }}
      render={({ field, fieldState }) => (
        <span className="p-float-label">
          <Chips
            {...field}
            {...props}
            onChange={(e) => field.onChange(e.value)}
            className={classNames(
              { "inputfield w-full p-invalid": fieldState.error },
              { "inputfield w-full ": true }
            )}
          />
          <label
            htmlFor={name}
            className={classNames({ "p-error": fieldState.error })}
          >
            {!fieldState.error ? label : fieldState.error.message}
          </label>
        </span>
      )}
    />
  );
};

export const DropdownForm = (props: DropdownPropsInterface) => {
  const { control } = useFormContext();
  const { name, label, rules } = props;

  return (
    <Controller
      control={control}
      name={name}
      rules={{ ...rules }}
      render={({ field, fieldState }) => (
        <span className="p-float-label">
          <Dropdown
            {...field}
            {...props}
            className={classNames(
              { "inputfield w-full p-invalid": fieldState.error },
              { "inputfield w-full ": true }
            )}
          />
          <label
            htmlFor={name}
            className={classNames({ "p-error": fieldState.error })}
          >
            {!fieldState.error ? label : fieldState.error.message}
          </label>
        </span>
      )}
    />
  );
};

export const InputNumberForm = (props: InputNumberPropsInterface) => {
  const { control } = useFormContext();
  const { name, label, rules } = props;

  return (
    <Controller
      control={control}
      name={name}
      rules={{ ...rules }}
      render={({ field, fieldState }) => (
        <span className="p-float-label">
          <InputNumber
            {...field}
            {...props}
            onChange={(e) => field.onChange(e.value)}
            className={classNames(
              { "inputfield w-full p-invalid": fieldState.error },
              { "inputfield w-full ": true }
            )}
          />
          <label
            htmlFor={name}
            className={classNames({ "p-error": fieldState.error })}
          >
            {!fieldState.error ? label : fieldState.error.message}
          </label>
        </span>
      )}
    />
  );
};

export const InputSwitchForm = (props: InputSwitchPropsInterface) => {
  const { control } = useFormContext();
  const { name, label } = props;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div>
          <InputSwitch
            checked={field.value}
            {...field}
            {...props}
            onChange={(e) => field.onChange(e.value)}
            className={classNames({
              "inputfield w-full p-invalid": fieldState.error,
            })}
          />
          <label htmlFor={name} className="pl-3">
            {label}
          </label>
        </div>
      )}
    />
  );
};

export const InputSwitchForm2 = (props: TwoLabelSwitchInterface) => {
  const { control } = useFormContext();
  const { name, left, right } = props;

  return (
    <span>
      <label htmlFor={name} className="mr-3">
        {left}
      </label>
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <InputSwitch checked={field.value} {...field} {...props} />
        )}
      />
      <label htmlFor={name} className="ml-3">
        {right}
      </label>
    </span>
  );
};

export const InputTextForm = (props: InputTextPropsInterface) => {
  const { control } = useFormContext();
  const { name, label, rules } = props;

  return (
    <Controller
      control={control}
      name={name}
      defaultValue=""
      rules={{ ...rules }}
      render={({ field, fieldState }) => (
        <span className="p-float-label">
          <InputText
            {...field}
            {...props}
            className={classNames(
              { "inputfield w-full p-invalid": fieldState.error },
              { "inputfield w-full ": true }
            )}
          />
          <label
            htmlFor={name}
            className={classNames({ "p-error": fieldState.error })}
          >
            {!fieldState.error ? label : fieldState.error.message}
          </label>
        </span>
      )}
    />
  );
};

export const InputTextareaForm = (props: InputTextareaPropsInterface) => {
  const { control } = useFormContext();
  const { name, label, rules } = props;

  return (
    <Controller
      control={control}
      name={name}
      rules={{ ...rules }}
      render={({ field, fieldState }) => (
        <span className="p-float-label">
          <InputTextarea
            {...field}
            {...props}
            className={classNames(
              { "inputfield w-full p-invalid": fieldState.error },
              { "inputfield w-full ": true }
            )}
          />
          <label
            htmlFor={name}
            className={classNames({ "p-error ": fieldState.error })}
          >
            {!fieldState.error ? label : fieldState.error.message}
          </label>
        </span>
      )}
    />
  );
};

export const MultiSelectForm = (props: MultiSelectPropsInterface) => {
  const { control } = useFormContext();
  const { name, label, rules } = props;

  return (
    <Controller
      control={control}
      name={name}
      rules={{ ...rules }}
      render={({ field, fieldState }) => (
        <span className="p-float-label">
          <MultiSelect
            {...field}
            {...props}
            className={classNames(
              { "inputfield w-full p-invalid": fieldState.error },
              { "inputfield w-full ": true }
            )}
            onChange={(e) => field.onChange(e.value)}
          />

          <label
            htmlFor={name}
            className={classNames({ "p-error": fieldState.error })}
          >
            {!fieldState.error ? label : fieldState.error.message}
          </label>
        </span>
      )}
    />
  );
};

export const RadioButtonForm = (props: RadioButtonPropsInterface) => {
  const { control } = useFormContext();
  const { name, label } = props;
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div>
          <RadioButton {...field} {...props} />
          <label htmlFor={name} className="ml-2">
            {label}
          </label>
        </div>
      )}
    />
  );
};

export const SelectButtonForm = (props: SelectButtonPropsInterface) => {
  const { control } = useFormContext();
  const { name, label } = props;
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div>
          <label htmlFor={name} className="ml-2">
            {label}
          </label>
          <SelectButton {...field} {...props} />
        </div>
      )}
    />
  );
};
