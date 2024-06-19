import React from "react";
import { InputNumberForm } from "../InputForm";

const EventBookingTimeLimit = () => {
  return (
    <>
      <InputNumberForm
        label="Online"
        name="online.bookingTimeLimit"
        min={0}
        size={12}
        suffix=" hours"
        mode="decimal"
        showButtons
      />
      <div className="my-3 md:hidden" />
      <InputNumberForm
        label="Offline"
        name="offline.bookingTimeLimit"
        min={0}
        size={12}
        suffix=" hours"
        mode="decimal"
        showButtons
      />
    </>
  );
};

export default EventBookingTimeLimit;
