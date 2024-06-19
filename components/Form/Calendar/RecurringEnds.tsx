import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import { RadioButton } from "primereact/radiobutton";
import React from "react";

const RecurringEnds = (props) => {
  const { dispatch, endsRecurring, until, count, disabled } = props;

  return (
    <div>
      <h4>Ends</h4>
      <div className="my-2 flex">
        <div className="w-3/12 my-auto justify-start">
          <RadioButton
            id="rbOn"
            name="ends"
            value="until"
            className="mr-1"
            onChange={(e) => dispatch({ type: "endsRecurring", val: e.value })}
            checked={endsRecurring === "until"}
            disabled={disabled}
          />
          <label htmlFor="rbOn" className="mr-3">
            On
          </label>
        </div>
        <Calendar
          name="until"
          value={until}
          onChange={(e) => dispatch({ type: "until", val: e.value })}
          dateFormat="D, dd M yy"
          className="inputfield w-full"
          disabled={disabled}
        />
      </div>
      <div className="my-2 flex ">
        <div className="w-3/12 my-auto justify-start">
          <RadioButton
            id="rbAfter"
            name="ends"
            value="count"
            className="mr-1"
            onChange={(e) => {
              dispatch({ type: "endsRecurring", val: e.value });
            }}
            checked={endsRecurring === "count"}
            disabled={disabled}
          />
          <label htmlFor="rbAfter" className="mr-3">
            After
          </label>
        </div>
        <InputNumber
          name="count"
          value={count}
          onChange={(e) => dispatch({ type: "count", val: e.value })}
          suffix=" occurrence"
          showButtons
          mode="decimal"
          min={1}
          size={8}
          className="inputfield w-full"
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default RecurringEnds;
