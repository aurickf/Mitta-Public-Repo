import { BookingCard, EventBookingCard } from "src/generated/graphql";

function sortBookingCardAsc(a, b) {
  if (a.regularClass.schedule.date < b.regularClass.schedule.date) return -1;
  else if (a.regularClass.schedule.date > b.regularClass.schedule.date)
    return 1;
  else return 0;
}

function sortBookingCardDesc(a, b) {
  if (a.regularClass.schedule.date < b.regularClass.schedule.date) return 1;
  else if (a.regularClass.schedule.date > b.regularClass.schedule.date)
    return -1;
  else return 0;
}

function sortByCreatedAtAsc(a, b) {
  if (a.createdAt < b.createdAt) return -1;
  else if (a.createdAt > b.createdAt) return 1;
  else return 0;
}

function sortByCreatedAtDesc(a, b) {
  if (a.createdAt < b.createdAt) return 1;
  else if (a.createdAt > b.createdAt) return -1;
  else return 0;
}

function sortDate(a, b) {
  if (a.schedule.date < b.schedule.date) return -1;
  else if (a.schedule.date > b.schedule.date) return 1;
  else return 0;
}

function sortEventBookingCardAsc(a, b) {
  if (a.event.schedule.date < b.event.schedule.date) return -1;
  else if (a.event.schedule.date > b.event.schedule.date) return 1;
  else return 0;
}

function sortEventBookingCardDesc(a, b) {
  if (a.event.schedule.date < b.event.schedule.date) return 1;
  else if (a.event.schedule.date > b.event.schedule.date) return -1;
  else return 0;
}

function sortMixedBookingAsc(
  a: BookingCard | EventBookingCard,
  b: BookingCard | EventBookingCard
) {
  const keyA: string = "regularClass" in a ? "regularClass" : "event";
  const keyB: string = "regularClass" in b ? "regularClass" : "event";

  if (a[keyA].schedule.date < b[keyB].schedule.date) return -1;
  else if (a[keyA].schedule.date > b[keyB].schedule.date) return 1;
  else return 0;
}

function sortMixedBookingDesc(
  a: BookingCard | EventBookingCard,
  b: BookingCard | EventBookingCard
) {
  const keyA: string = "regularClass" in a ? "regularClass" : "event";
  const keyB: string = "regularClass" in b ? "regularClass" : "event";

  if (a[keyA].schedule.date < b[keyB].schedule.date) return 1;
  else if (a[keyA].schedule.date > b[keyB].schedule.date) return -1;
  else return 0;
}

export {
  sortBookingCardAsc,
  sortBookingCardDesc,
  sortByCreatedAtAsc,
  sortByCreatedAtDesc,
  sortDate,
  sortEventBookingCardAsc,
  sortEventBookingCardDesc,
  sortMixedBookingAsc,
  sortMixedBookingDesc,
};
