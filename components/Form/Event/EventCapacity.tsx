import React from "react";
import { InputNumberForm } from "../InputForm";

const EventCapacity = () => {
  return (
    <>
      <InputNumberForm
        name="online.capacity"
        label="Online"
        showButtons
        min={0}
        size={12}
      />
      <div className="my-3 md:hidden" />
      <InputNumberForm
        name="offline.capacity"
        label="Offline"
        showButtons
        min={0}
        size={12}
      />
    </>
  );
};

export default EventCapacity;
