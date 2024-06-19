import DTFormat from "@/components/UI/DTFormat";
import {
  RegularClass,
  RegularClassTemplate,
  SpecialEvent,
} from "src/generated/graphql";
import { DateTime, Duration } from "luxon";

const timeLimit = (data) => {
  const getTimeLimit = (date: string, hours: number) => {
    return {
      value: DateTime.fromISO(date)
        .minus({ hours: hours })
        .toFormat("ccc, d LLL yyyy - HH:mm"),

      duration: Duration.fromObject({
        days: 0,
        hours: hours,
      })
        .normalize()
        .toHuman(),
    };
  };

  return {
    online: {
      booking: getTimeLimit(data.schedule.date, data.online.bookingTimeLimit),
      cancel: getTimeLimit(data.schedule.date, data.online.cancelTimeLimit),
    },
    offline: {
      booking: getTimeLimit(data.schedule.date, data.offline.bookingTimeLimit),
      cancel: getTimeLimit(data.schedule.date, data.offline.cancelTimeLimit),
    },
  };
};
const useEventDataView = (
  event: RegularClass | RegularClassTemplate | SpecialEvent
) => {
  const timeLimitValues = timeLimit(event);

  let label: string,
    buttonLabel: string,
    buttonDisabled: boolean,
    schedule,
    time,
    availabilityOnline: number,
    availabilityOffline: number,
    bookingLabelOnline: string,
    bookingLabelOffline: string,
    cancelLabelOnline: string,
    cancelLabelOffline: string;

  if (
    event.__typename === "RegularClass" ||
    event.__typename === "SpecialEvent"
  ) {
    label = "Availability";
    buttonLabel = "Book Now";
    schedule = (
      <DTFormat
        value={event?.schedule?.date}
        duration={event?.schedule?.duration}
        dateOnly
      />
    );

    time = (
      <DTFormat
        value={event?.schedule?.date}
        duration={event?.schedule?.duration}
        timeOnly
      />
    );

    availabilityOnline = event.online.availability;
    availabilityOffline = event.offline.availability;
    bookingLabelOnline = `Online : ${timeLimitValues.online.booking.value} (${timeLimitValues.online.booking.duration} before)`;
    bookingLabelOffline = `Offline : ${timeLimitValues.offline.booking.value} (${timeLimitValues.offline.booking.duration} before)`;
    cancelLabelOnline = `Online : ${timeLimitValues.online.cancel.value} (${timeLimitValues.online.cancel.duration} before)`;
    cancelLabelOffline = `Offline : ${timeLimitValues.offline.cancel.value} (${timeLimitValues.offline.cancel.duration} before)`;
    buttonDisabled =
      event.online.availability < 1 && event.offline.availability < 1;

    if (event.__typename === "SpecialEvent")
      buttonLabel = "Register for Special Class";
  }

  if (event.__typename === "RegularClassTemplate") {
    label = "Capacity";
    buttonLabel = "Edit Template";

    schedule = (
      <DTFormat
        value={event?.schedule?.startTime}
        days={event?.schedule?.day}
      />
    );

    time = (
      <DTFormat
        value={event?.schedule?.startTime}
        days={event?.schedule?.day}
        duration={event?.schedule?.duration}
        timeOnly
      />
    );

    availabilityOnline = event.online.capacity;
    availabilityOffline = event.offline.capacity;
    bookingLabelOnline = `Online : ${event.online.bookingTimeLimit} hr`;
    bookingLabelOffline = `Offline : ${event.offline.bookingTimeLimit} hr`;
    cancelLabelOnline = `Online : ${event.online.cancelTimeLimit} hr`;
    cancelLabelOffline = `Offline : ${event.offline.cancelTimeLimit} hr`;
  }

  return {
    label,
    buttonLabel,
    buttonDisabled,
    schedule,
    time,
    availabilityOnline,
    availabilityOffline,
    bookingLabelOnline,
    bookingLabelOffline,
    cancelLabelOnline,
    cancelLabelOffline,
  };
};

export default useEventDataView;
