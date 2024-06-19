import { Tag } from "primereact/tag";

export const BookingPolicy = ({
  __typename,
  ...props
}: {
  __typename: "RegularClass" | "RegularClassTemplate" | "SpecialEvent";
}) => {
  if (__typename === "SpecialEvent")
    return (
      <ul className="list-disc text-xs">
        <li>
          This booking is{" "}
          <span className="font-bold">subject to verification process</span>,
          you will be notified once your booking has been verified
        </li>
        <li>
          This booking is <span className="font-bold">non-refundable</span>
        </li>
        <li>This booking cannot be cancelled</li>
      </ul>
    );

  return (
    <ul className="list-disc text-xs">
      <li>
        Cancellation prior to time limit will not be charged to your balance.
      </li>
      <li>No cancellation can be done after time limit has been passed.</li>
      <li>
        Booking with
        <Tag value="Booking Cancelled" severity="warning" className="mx-2" />
        or
        <Tag value="Class Cancelled" severity="warning" className="mx-2" />
        status will NOT be charged to your balance.
      </li>
      <li>
        Booking with
        <Tag value="Confirmed" severity="success" className="mx-2" />
        status will be charged to your balance.
      </li>
    </ul>
  );
};

export default BookingPolicy;
