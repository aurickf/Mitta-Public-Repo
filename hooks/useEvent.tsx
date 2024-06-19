import { DateTime } from "luxon";
import { RegularClass, SpecialEvent } from "src/generated/graphql";

const mapEvent = (event: RegularClass | SpecialEvent) => {
  let color: string,
    textColor: string,
    backgroundColor: string,
    borderColor: string;
  let title: string;
  let seat = {
    online: 0,
    offline: 0,
  };

  if (event.__typename === "RegularClass") {
    seat.online = event.online.booked.length;
    seat.offline = event.offline.booked.length;
  } else {
    event.online.booked.map((e) => (seat.online += e.seat));
    event.online.confirmed.map((e) => (seat.online += e.seat));
    event.offline.booked.map((e) => (seat.offline += e.seat));
    event.offline.confirmed.map((e) => (seat.offline += e.seat));
  }

  // Running
  if (event.status.isRunning === true) {
    title = `${event.details.title} 👥 ${seat.online + seat.offline}`;
    textColor = "indigo";
    backgroundColor = "thistle";
    borderColor = "darkviolet";
  } else if (event.status.isRunning === false) {
    // Not running
    title = `${event.details.title} ❌`;
    textColor = "slategrey";
    backgroundColor = "gainsboro";
    borderColor = "slategrey";
  } else {
    // Pending update
    title = `${!event.status.isPublished ? "🔇" : ""} ${
      event.status.isVIPOnly ? "⭐" : ""
    } ${event.details.title} 🌏 ${seat.online} 🏠 ${seat.offline} `;
    textColor = "peru";
    backgroundColor = "khaki";
    borderColor = "peru";
  }

  return {
    title,
    allDay: event.schedule.isAllDay,
    start: DateTime.fromISO(event.schedule.date).toJSDate(),
    end: DateTime.fromISO(event.schedule.date)
      .plus({ minutes: event.schedule.duration })
      .toJSDate(),
    extendedProps: {
      __typename: event.__typename,
      _id: event._id,
      instructors: event.instructors,
      online: {
        booked:
          event.__typename === "RegularClass"
            ? event.online.booked
            : seat.online,
      },
      offline: {
        booked:
          event.__typename === "RegularClass"
            ? event.offline.booked
            : seat.offline,
      },
      status: {
        ...event.status,
      },
      zoom: {
        ...event.zoom,
        simpleTitle: `${event.details.title}`,
      },
      clickable: true,
    },
    color,
    textColor,
    backgroundColor,
    borderColor,
  };
};

const useEvent = (dataset, query: string) => {
  let runningClass: Array<RegularClass | SpecialEvent>,
    cancelledClass: Array<RegularClass | SpecialEvent>,
    pendingClass: Array<RegularClass | SpecialEvent>;

  if (dataset.data) {
    runningClass = dataset.data[query]
      .filter((event: RegularClass | SpecialEvent) => {
        return event.status.isRunning === true;
      })
      .map(mapEvent);

    cancelledClass = dataset.data[query]
      .filter((event: RegularClass | SpecialEvent) => {
        return event.status.isRunning === false;
      })
      .map(mapEvent);

    pendingClass = dataset.data[query]
      .filter((event: RegularClass | SpecialEvent) => {
        return event.status.isRunning === null;
      })
      .map(mapEvent);
  }

  return { runningClass, cancelledClass, pendingClass };
};

export default useEvent;
