import React from "react";
import { ChipsForm } from "../InputForm";

const SpecialEventInstructors = () => {
  return (
    <ChipsForm
      name="instructors"
      label="Instructors"
      rules={{ required: "Instructors *mandatory" }}
      addOnBlur
    />
  );
};

export default SpecialEventInstructors;
