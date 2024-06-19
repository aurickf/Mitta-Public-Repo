import { Info } from "luxon";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import React, { useState } from "react";
import { RRule } from "rrule";

const CustomRecurringForm = (props) => {
  let arr = [false, false, false, false, false, false, false];

  const { dispatch, rvalues } = props;

  if (rvalues.byweekday) {
    for (let i = 0; i < rvalues.byweekday.length; i++) {
      arr[rvalues.byweekday[i]] = true;
    }
  }

  const [weeklyRecurring, setWeeklyRecurring] = useState(arr);

  const customRecurringOptions = [
    {
      label: "days",
      value: RRule.DAILY,
    },
    {
      label: "weeks",
      value: RRule.WEEKLY,
    },
    {
      label: "months",
      value: RRule.MONTHLY,
    },
  ];

  const onWeeklyRecurringChange = (e) => {
    if (rvalues.freq === RRule.WEEKLY) {
      let selection = [...weeklyRecurring];

      selection[e.value] = e.checked;
      setWeeklyRecurring(selection);

      const _s = selection
        .map((item, i) => {
          if (item) return i;
        })
        .filter((item) => item !== undefined);

      dispatch({ type: "rvalues", val: { ...rvalues, byweekday: _s } });
    }
  };

  const weeklyRecurringOptions = () => {
    if (rvalues.freq === RRule.WEEKLY) {
      return (
        <div className="my-3 flex flex-wrap gap-4">
          {Info.weekdays("short").map((item, i) => {
            return (
              <div key={i} className="flex gap-2 mr-2 text-center">
                <Checkbox
                  name={`cb_${item}`}
                  value={i}
                  checked={weeklyRecurring[i]}
                  onChange={onWeeklyRecurringChange}
                />
                <label htmlFor={`cb_${item}`}>{item}</label>
              </div>
            );
          })}
        </div>
      );
    }
  };

  const changeHandler = (e, key) => {
    dispatch({ type: "rvalues", val: { ...rvalues, [key]: e.value } });
  };

  return (
    <div>
      <div>
        <h4>Custom Recurrence</h4>
        <div className="mt-3">
          <InputNumber
            mode="decimal"
            showButtons={true}
            min={1}
            className="md:mr-2 md:mb-2"
            value={rvalues.interval}
            onValueChange={(e) => changeHandler(e, "interval")}
          />
          <Dropdown
            options={customRecurringOptions}
            value={rvalues.freq}
            optionLabel="label"
            optionValue="value"
            onChange={(e) => changeHandler(e, "freq")}
          />
        </div>
        <div className="w-full">{weeklyRecurringOptions()}</div>
      </div>
      <div className="my-3 text-right">
        <Button label="Cancel" className="p-button-text" />
        <Button label="OK" onClick={() => props.onHide()} />
      </div>
    </div>
  );
};

export default CustomRecurringForm;
