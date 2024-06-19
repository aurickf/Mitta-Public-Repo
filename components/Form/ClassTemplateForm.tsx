import { localeOptions } from "primereact/api";
import { ConfirmDialog } from "primereact/confirmdialog";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import {
  AddTemplate,
  DeleteTemplate,
  EditTemplate,
  Instructors,
  Levels,
} from "src/api";
import {
  RegularClassTemplate,
  RegularClassTemplateInput,
} from "src/generated/graphql";
import { DeleteButton, ResetButton, SaveButton } from "../UI/Buttons";
import { levelItemTemplate, selectedLevelTemplate } from "../Template";
import {
  CalendarForm,
  ChipsForm,
  DropdownForm,
  InputNumberForm,
  InputTextareaForm,
  InputTextForm,
  MultiSelectForm,
} from "./InputForm";
import { Types } from "mongoose";

const dayArray = localeOptions("en")["dayNamesShort"].map((day, i) => ({
  label: day,
  code: i,
}));

const ClassTemplateForm = (props: {
  data: RegularClassTemplate;
  onSubmitSuccess: (string) => void;
  onSubmitError: (any) => void;
}) => {
  const { data } = props;

  const levelOptions = useQuery(["levels"], () => Levels());
  const instructorOptions = useQuery(["instructors"], () => Instructors());

  let defaultValues: RegularClassTemplate | RegularClassTemplateInput = {
    _id: null,
    instructors: [],
    details: {
      title: "",
      description: "",
      level: null,
    },
    offline: {
      capacity: 0,
      bookingTimeLimit: 2,
      cancelTimeLimit: 1,
      cost: 100,
    },
    online: {
      capacity: 0,
      bookingTimeLimit: 1,
      cancelTimeLimit: 1,
      cost: 100,
    },
    schedule: {
      day: [],
      startTime: new Date(),
      duration: 75,
    },
  };

  if (data) {
    defaultValues = {
      _id: data._id,
      instructors: data?.instructors.map((instructor) => {
        return instructor?._id;
      }),
      details: data.details,
      offline: {
        capacity: data.offline.capacity,
        bookingTimeLimit: data.offline.bookingTimeLimit,
        cancelTimeLimit: data.offline.cancelTimeLimit,
        cost: data.offline.cost,
      },
      online: {
        capacity: data.online.capacity,
        bookingTimeLimit: data.online.bookingTimeLimit,
        cancelTimeLimit: data.online.cancelTimeLimit,
        cost: data.online.cost,
      },
      schedule: {
        day: data.schedule?.day,
        startTime: new Date(data.schedule?.startTime),
        duration: data.schedule?.duration,
      },
    };
  }

  const methods = useForm({
    defaultValues: defaultValues,
  });

  const [showConfirmation, setShowConfirmation] = useState(false);

  const addMutation = useMutation(AddTemplate);
  const editMutation = useMutation(EditTemplate);
  const deleteMutation = useMutation(DeleteTemplate);

  // Forms
  const onSubmit = async () => {
    let inputValues = methods.getValues();
    inputValues.details.level = inputValues.details.level._id;
    inputValues.schedule.day.sort();

    try {
      if (!data) {
        // Add new template
        await addMutation.mutateAsync(inputValues as RegularClassTemplateInput);
        props.onSubmitSuccess("Template added");
      } else {
        // Edit current template
        await editMutation.mutateAsync(
          inputValues as Omit<RegularClassTemplateInput, "_id"> & {
            _id: Types.ObjectId;
          }
        );
        props.onSubmitSuccess("Template updated");
      }
    } catch (error) {
      props.onSubmitError(error);
    }
  };

  const onDelete = async () => {
    try {
      await deleteMutation.mutateAsync({ _id: data._id });
      props.onSubmitSuccess("Deletion confirmed");
    } catch (error) {
      props.onSubmitError(error);
    }
  };

  return (
    <>
      <ConfirmDialog
        header="Delete Confirmation"
        icon="pi pi-trash"
        visible={showConfirmation}
        onHide={() => setShowConfirmation(false)}
        message="Confirm to Delete?"
        accept={onDelete}
        reject={() => setShowConfirmation(false)}
      />
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="text-xl font-bold my-3">Details</div>
          <div id="details">
            <InputTextForm
              name="details.title"
              label="Class Title"
              rules={{ required: "Class Title* (mandatory field)" }}
            />

            <div className="grid md:grid-cols-2 gap-3 my-2">
              <MultiSelectForm
                name="instructors"
                label="Instructor"
                options={instructorOptions.data?.instructors}
                optionLabel="name"
                optionValue="_id"
              />

              <DropdownForm
                name="details.level._id"
                label="Level"
                rules={{ required: "Level* (mandatory field)" }}
                options={levelOptions.data?.levels}
                optionLabel="code"
                optionValue="_id"
                itemTemplate={levelItemTemplate}
                valueTemplate={selectedLevelTemplate}
                placeholder="Select class level"
              />
            </div>

            <InputTextareaForm name="details.description" label="Description" />

            <ChipsForm name="details.tags" label="Tag" addOnBlur />
          </div>

          <div className="text-xl font-bold my-3">Schedule</div>
          <div id="schedule">
            <div className="grid md:grid-cols-3 gap-3">
              <MultiSelectForm
                name="schedule.day"
                label="Day"
                rules={{ required: "Day* (mandatory field)" }}
                options={dayArray}
                optionLabel="label"
                optionValue="code"
                display="chip"
              />
              <CalendarForm
                name="schedule.startTime"
                label="Start Time"
                showTime
                timeOnly
                hourFormat="24"
                stepMinute={5}
              />
              <InputNumberForm
                name="schedule.duration"
                label="Duration"
                suffix=" minutes"
                step={5}
                showButtons
              />
            </div>
          </div>

          <div className="text-xl font-bold my-3">Capacity</div>
          <div id="capacity" className="grid md:grid-cols-2 gap-3">
            <InputNumberForm
              label="Online Capacity"
              name="online.capacity"
              min={0}
              suffix=" person"
              mode="decimal"
              showButtons
            />
            <InputNumberForm
              label="Offline Capacity"
              name="offline.capacity"
              min={0}
              suffix=" person"
              mode="decimal"
              showButtons
            />
          </div>

          <div className="text-xl font-bold my-3">Booking Time Limit</div>
          <div id="bookingTimeLimit" className="grid md:grid-cols-2 gap-3">
            <InputNumberForm
              label="Online Time Limit"
              name="online.bookingTimeLimit"
              min={0}
              suffix=" hour"
              mode="decimal"
              showButtons
            />
            <InputNumberForm
              label="Offline Time Limit"
              name="offline.bookingTimeLimit"
              min={0}
              suffix=" hour"
              mode="decimal"
              showButtons
            />
          </div>

          <div className="text-xl font-bold my-3">Cancel Time Limit</div>
          <div id="cancelTimeLimit" className="grid md:grid-cols-2 gap-3">
            <InputNumberForm
              label="Online Time Limit"
              name="online.cancelTimeLimit"
              min={0}
              suffix=" hour"
              mode="decimal"
              showButtons
            />
            <InputNumberForm
              label="Offline Time Limit"
              name="offline.cancelTimeLimit"
              min={0}
              suffix=" hour"
              mode="decimal"
              showButtons
            />
          </div>

          <div className="text-xl font-bold my-3">Cost</div>
          <div id="Cost" className="grid md:grid-cols-2 gap-3">
            <div className="field col">
              <InputNumberForm
                label="Online Cost"
                name="online.cost"
                min={0}
                suffix=" points"
                mode="decimal"
                showButtons
              />
            </div>
            <div className="field col">
              <InputNumberForm
                label="Offline Cost"
                name="offline.cost"
                min={0}
                suffix=" points"
                mode="decimal"
                showButtons
              />
            </div>
          </div>

          <div className="flex my-4 gap-3">
            <div className="mr-auto">
              <DeleteButton
                type="button"
                disabled={!data ? true : false}
                onClick={() => setShowConfirmation(true)}
                loading={deleteMutation.isLoading}
              />
            </div>
            <ResetButton type="button" onClick={() => methods.reset()} />

            <SaveButton
              onSubmit={onSubmit}
              loading={addMutation.isLoading || editMutation.isLoading}
            />
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default ClassTemplateForm;
