import { BookingCard, EventBookingCard } from "src/generated/graphql";

export interface IBookingCardProps {
  value: BookingCard | EventBookingCard;
  mode: "upcoming" | "past" | "detail";
  onClick?: (any) => void;
  onCancel?: (any) => void;
  loading?: boolean;
}
