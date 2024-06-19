import { InputNumberPropsInterface } from "@/interface/InputForm";
import React from "react";
import { InputNumberForm } from "../InputForm";

const EventCost = (props: InputNumberPropsInterface) => {
  const { mode, currency, step, minFractionDigits, min, prefix, suffix } =
    props;

  return (
    <>
      <InputNumberForm
        label="Online"
        name="online.cost"
        min={min}
        size={12}
        prefix={prefix}
        suffix={suffix}
        mode={mode}
        currency={currency}
        minFractionDigits={minFractionDigits}
        step={step}
        showButtons
      />
      <div className="my-3 md:hidden" />
      <InputNumberForm
        label="Offline"
        name="offline.cost"
        min={min}
        size={12}
        prefix={prefix}
        suffix={suffix}
        mode={mode}
        currency={currency}
        minFractionDigits={minFractionDigits}
        step={step}
        showButtons
      />
    </>
  );
};

export default EventCost;
