import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DTFormat from "./DTFormat";

describe("Date Time Component", () => {
  const val = new Date("01/01/2022");
  const duration = 75;
  const arrayVal = [0, 1];

  test("Date and Time", () => {
    render(<DTFormat value={val} />);
    const dateTime = screen.getByText(/sat, 01 jan 2022 \- 00:00/i);
    expect(dateTime).toBeInTheDocument();
  });

  test("Date and Time with Duration", () => {
    render(<DTFormat value={val} duration={duration} />);
    const dateTimeDuration = screen.getByText(
      /sat, 01 jan 2022, 00:00 \- 01:15/i
    );
    expect(dateTimeDuration).toBeInTheDocument();
  });

  test("Date Only", () => {
    render(<DTFormat value={val} dateOnly />);
    const date = screen.getByText(/sat, 01 jan 2022/i);
    expect(date).toBeInTheDocument();
  });

  test("Time Only", () => {
    render(<DTFormat value={val} timeOnly />);
    const time = screen.getByText(/00:00/i);
    expect(time).toBeInTheDocument();
  });

  test("Multiple Days with Time", () => {
    render(<DTFormat value={val} days={arrayVal} />);
    const time = screen.getByText(/00:00/i);
    const day1 = screen.getByText(/sun/i);
    const day2 = screen.getByText(/mon/i);
    expect(time).toBeInTheDocument();
    expect(day1).toBeInTheDocument();
    expect(day2).toBeInTheDocument();
  });
});
