import React from "react";
import { DropdownForm } from "../InputForm";
import { levelItemTemplate, selectedLevelTemplate } from "../../Template";

const EventLevel = (props) => {
  return (
    <>
      <DropdownForm
        name="details.level"
        label="Level"
        options={props.options}
        optionLabel="code"
        optionValue="_id"
        itemTemplate={levelItemTemplate}
        valueTemplate={selectedLevelTemplate}
        rules={{ required: "Level* (mandatory field)" }}
      />
    </>
  );
};

export default EventLevel;
