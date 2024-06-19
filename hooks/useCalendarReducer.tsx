import { DateTime } from "luxon";
import { useReducer } from "react";
import { RRule, Frequency } from "rrule";
import { __spreadArray } from "tslib";

const DAILY = {
  label: "Daily",
  value: { freq: Frequency.DAILY, interval: 1 },
};

export const WEEKLY = {
  label: "Weekly",
  value: { freq: Frequency.WEEKLY, interval: 1 },
};

const MONTHLY = {
  label: "Monthly on same date",
  value: { freq: Frequency.MONTHLY, interval: 1 },
};

export const CUSTOMIZE = {
  label: "...",
  value: { freq: -1, interval: -1 },
};

export const staticOptions = [DAILY, WEEKLY, MONTHLY];

const countDuration = (startTime: Date, endTime: Date) => {
  let _startTime: DateTime, _endTime: DateTime;

  _startTime = DateTime.fromJSDate(startTime);
  _endTime = DateTime.fromJSDate(endTime);

  return _endTime.diff(_startTime, "minutes").toObject().minutes;
};

const updateRuleAndLabel = (inputRule, key: String, value) => {
  const { dtstart, until, count, endsRecurring, rvalues } = inputRule;

  let _rule, _ruleLabel;

  if (key === "rvalues") {
    switch (endsRecurring) {
      case "until":
        _rule = {
          ...value,
          dtstart,
          until,
        };
        break;

      case "count":
        _rule = {
          ...value,
          dtstart,
          count,
        };
        break;

      default:
        throw new Error("Invalid recurring keyword");
    }

    _ruleLabel = { ...value, dtstart };
  } else {
    switch (endsRecurring) {
      case "until":
        _rule = {
          ...rvalues,
          dtstart,
          until,
          [`${key}`]: value,
        };
        break;

      case "count":
        _rule = {
          ...rvalues,
          dtstart,
          count,
          [`${key}`]: value,
        };
        break;

      default:
        throw new Error("Invalid recurring keyword");
    }

    _ruleLabel = { ...rvalues, dtstart };
  }

  delete _rule.endsRecurring;

  const rString = new RRule(_rule).toString();
  const label = new RRule(_ruleLabel).toText();

  return {
    rString,
    label,
  };
};

const validateIfCustom = (rvalues) => {
  if ((rvalues.byweekday || []).length > 0 || rvalues.interval > 1) return true;
  return false;
};

export interface stateInterface {
  schedule: {
    date: Date;
    duration: Number;
    isAllDay: Boolean;
    rString: String;
  };
  rule: {
    dtstart: Date;
    endsRecurring: String;
    until: Date;
    count: Number;
    rvalues: any;
    options: any;
  };
  time: {
    startTime: Date;
    endTime: Date;
  };
  custom: {
    isEnabled: Boolean;
  };
  showOptionAllOcurrence: Boolean;
  selectionMode: "single" | "following" | "all";
  firstRDate: Date;
}

interface actionInterface {
  type: String;
  val: any;
}

const useCalendarReducer = (initialState) => {
  const init = (initialState) => {
    return initialState;
  };

  const reducer = (state: stateInterface, action: actionInterface) => {
    const adjustDateTime = (
      inputDate: Date,
      inputTime: Date = state.time.startTime
    ) => {
      const _startTime = DateTime.fromJSDate(inputTime);

      return DateTime.fromJSDate(inputDate)
        .set({
          hour: _startTime.hour,
          minute: _startTime.minute,
        })
        .toJSDate();
    };

    let _dt, _rule;

    switch (action.type) {
      case "isAllDay":
        return {
          ...state,
          schedule: {
            ...state.schedule,
            isAllDay: action.val,
          },
        };

      case "startTime":
        _dt = adjustDateTime(state.schedule.date, action.val);
        _rule = updateRuleAndLabel(state.rule, "dtstart", _dt);

        return {
          ...state,
          time: {
            ...state.time,
            startTime: action.val,
          },
          schedule: {
            ...state.schedule,
            date: _dt,
            duration: countDuration(action.val, state.time.endTime),
            rString: _rule.rString,
          },
          rule: {
            ...state.rule,
            dtstart: _dt,
          },
        };

      case "endTime":
        return {
          ...state,
          time: {
            ...state.time,
            endTime: action.val,
          },
          schedule: {
            ...state.schedule,
            duration: countDuration(state.time.startTime, action.val),
          },
        };

      case "dtstart":
        _dt = adjustDateTime(action.val);
        _rule = updateRuleAndLabel(state.rule, "dtstart", _dt);

        const initialDate = DateTime.fromJSDate(initialState.schedule.date)
          .startOf("day")
          .toISO();

        const firstRDate = DateTime.fromJSDate(state.firstRDate)
          .startOf("day")
          .toISO();

        const newDate = DateTime.fromJSDate(action.val).startOf("day").toISO();

        return {
          ...state,
          schedule: {
            ...state.schedule,
            date: _dt,
            rString: _rule.rString,
          },
          rule: {
            ...state.rule,
            dtstart: _dt,
          },
          showOptionAllOcurrence: [initialDate, firstRDate].includes(newDate)
            ? true
            : false,
        };

      case "until":
        _rule = updateRuleAndLabel(state.rule, "until", action.val);

        return {
          ...state,
          schedule: {
            ...state.schedule,
            rString: _rule.rString,
          },
          rule: {
            ...state.rule,
            until: action.val,
          },
        };

      case "count":
        _rule = updateRuleAndLabel(state.rule, "count", action.val);

        return {
          ...state,
          schedule: {
            ...state.schedule,
            rString: _rule.rString,
          },
          rule: {
            ...state.rule,
            count: action.val,
          },
        };

      case "endsRecurring":
        _rule = updateRuleAndLabel(
          {
            ...state.rule,
            endsRecurring: action.val,
          },
          "endsRecurring",
          action.val
        );

        return {
          ...state,
          schedule: {
            ...state.schedule,
            rString: _rule.rString,
          },
          rule: {
            ...state.rule,
            endsRecurring: action.val,
          },
        };

      case "rvalues":
        _rule = updateRuleAndLabel(state.rule, "rvalues", action.val);

        const isEnabled = validateIfCustom(action.val);

        let options;

        if (isEnabled) {
          options = [
            ...staticOptions,
            { label: _rule.label, value: action.val },
            CUSTOMIZE,
          ];
        } else {
          options = [...staticOptions, CUSTOMIZE];
        }

        return {
          ...state,
          schedule: {
            ...state.schedule,
            rString: _rule.rString,
          },
          rule: {
            ...state.rule,
            rvalues: action.val,
            options,
          },
          custom: {
            isEnabled,
          },
        };

      case "event": {
        return {
          ...state,
          ...action.val,
          rule: {
            ...state.rule,
            ...action.val.rule,
          },
        };
      }

      case "mode": {
        return {
          ...state,
          selectionMode: action.val,
        };
      }

      case "reset":
        return init(action.val);

      default:
        throw new Error("Invalid action type");
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState, init);

  return [state, dispatch];
};

export default useCalendarReducer;
