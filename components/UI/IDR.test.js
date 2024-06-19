import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import IDR from "./IDR";

describe("IDR Component", () => {
  test("Formatting test", () => {
    render(<IDR value={135000} />);

    const textResult = screen.getByText(/idr 135\.000/i);
    expect(textResult).toBeInTheDocument();
  });
});
