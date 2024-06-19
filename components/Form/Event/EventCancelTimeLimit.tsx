import React from "react";
import { InputNumberForm } from "../InputForm";

const EventCancelTimeLimit = () => {
  return (
    <>
      <InputNumberForm
        label="Online"
        name="online.cancelTimeLimit"
        min={0}
        size={12}
        suffix=" hours"
        mode="decimal"
        showButtons
      />
      <div className="my-3 md:hidden" />
      <InputNumberForm
        label="Offline"
        name="offline.cancelTimeLimit"
        min={0}
        size={12}
        suffix=" hours"
        mode="decimal"
        showButtons
      />
    </>
  );
};

export default EventCancelTimeLimit;
