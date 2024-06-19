import { DateTime } from "luxon";
import { localeOptions } from "primereact/api";

interface DTFormatInterface {
  value: string | Date;
  duration?: number;
  days?: number[];
  dateOnly?: boolean;
  timeOnly?: boolean;
}

const DTFormat = (props: DTFormatInterface) => {
  const dayArray = localeOptions("en")["dayNamesShort"].map((day, i) => ({
    label: day,
    code: i,
  }));

  let dt;

  if (!props.value) return;

  if (typeof props.value === "string") {
    dt = DateTime.fromISO(props.value).setLocale("en-GB");
  } else dt = DateTime.fromJSDate(props.value).setLocale("EN-GB");

  if (props.dateOnly) return <span>{dt.toFormat("ccc, dd LLL yyyy")} </span>;

  if (props.timeOnly) {
    if (props.duration > 0)
      return (
        <span>{`${dt.toFormat("T")} - ${dt
          .plus({ minutes: props.duration })
          .toFormat("T")}`}</span>
      );
    return <span>{dt.toFormat("T")}</span>;
  }

  if (props.duration > 0)
    return (
      <span>{`${dt.toFormat("ccc, dd LLL yyyy, HH:mm")} - ${dt
        .plus({ minutes: props.duration })
        .toFormat("HH:mm")}`}</span>
    );

  if (props.days && props.days.length > 0)
    return (
      <span>
        {props.days.map((day, i) => {
          return <span key={i}>{dayArray[day]["label"]} </span>;
        })}
        {/* {dt.toFormat("HH:mm")} */}
      </span>
    );

  return <span>{dt.toFormat("ccc, dd LLL yyyy - HH:mm")}</span>;
};

export default DTFormat;
