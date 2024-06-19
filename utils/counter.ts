export const membershipCounterString = (values) => {
  let leadingZeros = "";

  if (values.counter <= 9) {
    leadingZeros = "000";
  } else if (values.counter >= 10 && values.counter <= 99) {
    leadingZeros = "00";
  } else if (values.counter >= 100 && values.counter <= 999) {
    leadingZeros = "0";
  }

  return `${values.prefix}${leadingZeros}${values.counter}`;
};

export const bookingCardCounterString = (values) => {
  let leadingZeros;

  if (values.counter <= 9) {
    leadingZeros = "00";
  } else if (values.counter >= 10 && values.counter <= 99) {
    leadingZeros = "0";
  }

  return `${values.prefix}${leadingZeros}${values.counter}`;
};
