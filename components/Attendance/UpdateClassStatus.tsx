import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Divider } from "primereact/divider";
import { classNames } from "primereact/utils";
import React, { useState } from "react";
import { InputTextForm } from "../Form/InputForm";

const UpdateClassStatus = ({
  isAdmin,
  classStatus,
  isLoading,
  methods,
  ...props
}: {
  isAdmin: boolean;
  classStatus: boolean;
  isLoading: boolean;
  methods: {
    setValue: Function;
  };
}) => {
  const [checkboxCancelClass, setCheckboxCancelClass] = useState(false);
  const [override, setOverride] = useState(false);

  return (
    <div className="text-center">
      <Divider />
      {classStatus !== null && isAdmin && (
        <Button
          className="p-button-text p-button-danger"
          label="Override Status"
          visible={!override}
          onClick={() => setOverride(!override)}
        />
      )}
      {(classStatus === null || override) && (
        <>
          <div className="mt-3 text-right">
            <Button
              label="Confirm Class Running"
              icon="pi pi-check"
              className="w-full"
              loading={isLoading}
              onClick={() => methods.setValue("action", "confirm")}
              disabled={checkboxCancelClass}
            />
          </div>
          <div className="my-5">
            <div>
              <Checkbox
                onChange={(e) => setCheckboxCancelClass(e.checked)}
                checked={checkboxCancelClass}
                inputId="cb"
              />
              <label htmlFor="cb" className="ml-2">
                I wish to cancel this class and all bookings within.
              </label>
            </div>

            <div
              className={classNames({
                "my-3 text-center hidden": !checkboxCancelClass,
                "my-3 text-center": checkboxCancelClass,
              })}
            >
              <div className="my-3">
                <InputTextForm
                  name="reason"
                  label="Cancellation Reason"
                  className="w-full"
                  rules={{
                    ...(checkboxCancelClass && {
                      required: "Cancellation Reason* (mandatory field)",
                    }),
                  }}
                />
              </div>

              <div className="my-3">
                <Button
                  label="Cancel Class and Bookings Within"
                  icon="pi pi-times"
                  className="p-button-danger p-button-outlined w-full"
                  loading={isLoading}
                  onClick={() => methods.setValue("action", "cancel")}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UpdateClassStatus;
