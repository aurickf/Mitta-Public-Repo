import { Button } from "primereact/button";
import { FormProvider, useForm } from "react-hook-form";
import { MutationFunction, useMutation } from "react-query";
import { CustomColumn } from "../../interface/CustomColumn";
import {
  CalendarForm,
  InputNumberForm,
  InputSwitchForm,
  InputTextForm,
} from "./InputForm";

interface SettingProps {
  columns: CustomColumn[];
  onSubmitSuccess: () => void;
  onError: Function;
  addMutation: MutationFunction;
}

export const SettingForm = (props: SettingProps) => {
  const { addMutation } = props;

  const addSetting = useMutation(addMutation);

  const methods = useForm({
    defaultValues: {
      isEnabled: false,
      isPublic: false,
      isPrivate: false,
    },
  });

  const dynamicForm = props.columns.map((column) => {
    switch (column.dataType) {
      case "boolean": {
        return (
          <div className="w-full my-4 flex gap-3" key={column.field}>
            <div>
              <InputSwitchForm name={column.field} />
            </div>
            <div>{column.label}</div>
          </div>
        );
      }
      case "date": {
        return (
          <div className="w-full my-4" key={column.field}>
            <CalendarForm
              name={column.field}
              label={column.label}
              rules={column.rules}
              dateFormat="D, dd M yy"
              showButtonBar
            />
          </div>
        );
      }
      case "numeric": {
        return (
          <div className="w-full my-4" key={column.field}>
            <InputNumberForm
              name={column.field}
              label={column?.label}
              rules={{ required: `${column?.label}* (mandatory field)` }}
            />
          </div>
        );
      }
      default: {
        return (
          <div className="w-full my-4" key={column.field}>
            <InputTextForm
              name={column.field}
              label={column?.label}
              keyfilter={column?.keyfilter}
              rules={{ required: `${column?.label}* (mandatory field)` }}
            />
          </div>
        );
      }
    }
  });

  const onSubmit = async () => {
    const values = methods.getValues();

    try {
      await addSetting.mutateAsync(values);
      props.onSubmitSuccess();
    } catch (error) {
      error.response.errors.forEach((err) => props.onError(err));
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="">
          {dynamicForm}
          <div className="text-right">
            <Button
              loading={addSetting.isLoading}
              onSubmit={onSubmit}
              label="Save"
              icon="pi pi-save"
            />
          </div>
        </div>
      </form>
    </FormProvider>
  );
};
