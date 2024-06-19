import React from "react";
import { MultiSelectForm } from "../InputForm";

const EventInstructors = (props) => {
  return (
    <div>
      <MultiSelectForm
        name="instructors"
        label="Instructor"
        options={props.options}
        optionLabel="name"
        optionValue="_id"
        rules={{ required: "Instructor* (mandatory field)" }}
      />
    </div>
  );
};

export default EventInstructors;
