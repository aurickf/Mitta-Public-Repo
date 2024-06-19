import { DateTime } from "luxon";
import { useQuery } from "react-query";
import { MembershipFormData } from "src/api";
import { RegularClass } from "src/generated/graphql";

const time = DateTime.now().startOf("hour").minus({ hour: 3 }).toJSDate();
const time2 = DateTime.now().plus({ day: 1 }).startOf("hour").toJSDate();
const time3 = DateTime.now().plus({ day: 2 }).startOf("hour").toJSDate();

export const dummyClass: RegularClass = {
  _id: 1,
  details: {
    title: "My Yoga Class",
    level: {
      _id: 1,
      code: "A",
      description: "All Level",
    },
  },
  zoom: {
    joinUrl: "",
  },
  recurrenceId: "1",
  schedule: {
    date: time,
    duration: 90,
  },
  status: {
    isRunning: true,
    isPublished: true,
    isVIPOnly: true,
  },
  offline: {
    booked: [1, 2, 3, 4, 5],
    confirmed: [4, 5],
  },
  online: {
    booked: [1, 2, 3],
    confirmed: [4, 5],
  },
};

export const dummyClass2: RegularClass = {
  _id: 1,
  details: {
    title: "My other Yoga Class",
    level: {
      _id: 1,
      code: "A",
      description: "All Level",
    },
  },
  zoom: {
    joinUrl: "",
  },
  recurrenceId: "1",
  schedule: {
    date: time2,
    duration: 90,
  },
  status: {
    isRunning: null,
    isPublished: true,
    isVIPOnly: false,
  },
  offline: {
    booked: [1, 2, 3, 4, 5],
    confirmed: [4, 5],
  },
  online: {
    booked: [1, 2, 3],
    confirmed: [4, 5],
  },
};

export const dummyClass3: RegularClass = {
  _id: 1,
  details: {
    title: "My other class",
    level: {
      _id: 1,
      code: "A",
      description: "All Level",
    },
  },
  zoom: {
    joinUrl: "",
  },
  recurrenceId: "1",
  schedule: {
    date: time3,
    duration: 90,
  },
  status: {
    isRunning: false,
    isPublished: true,
    isVIPOnly: false,
  },
  offline: {
    booked: [1, 2, 3],
    confirmed: [4, 5, 6, 7],
  },
  online: {
    booked: [1, 2],
    confirmed: [4, 5],
  },
};
