import useEventDataView from "@/hooks/useEventDataView";
import { SpecialEventDataView } from "@/interface/SpecialEventDataView";
import { RegularClassDataView } from "interface/RegularClassDataView";
import { DateTime } from "luxon";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Tag } from "primereact/tag";
import { useState } from "react";
import Instructors from "../User/Instructors";
import { BookingPolicy } from "./BookingPolicy";

export const RegularClassList = (
  props: RegularClassDataView | SpecialEventDataView
) => {
  const { value } = props;

  const {
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
  } = useEventDataView(value);

  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      {/* Card */}
      <div className="w-11/12 md:w-10/12 xl:w-8/12 mx-auto my-2 shadow-sm">
        {/* Header */}
        <div className="class-header text-xl rounded-top rounded-t py-2 my-auto relative ">
          <div className="flex flex-wrap">
            {/* Title and Share Button */}
            <div className="flex grow my-auto  ml-2">
              <div className="grow-0 my-auto">{value?.details?.title}</div>
              <div className="grow ml-auto">
                {value.__typename !== "RegularClassTemplate" && (
                  <div className="grow-0">
                    <Button
                      className="p-button-rounded p-button-link p-button-sm"
                      icon="pi pi-share-alt"
                      aria-label="Share this class"
                      tooltip="Share this class"
                      onClick={() => {
                        if ("date" in value.schedule)
                          window.open(
                            `/${value?.details?.title
                              .split(" ")
                              .join("_")}/${DateTime.fromISO(
                              value?.schedule?.date
                            ).toISODate()}`
                          );
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="hidden md:inline my-auto mx-2">
              <Instructors value={value?.instructors} mode="image" />
            </div>

            {/* Tags */}
            <div className="flex grow md:grow-0 justify-end gap-2">
              <div className="my-auto text-right grow pb-2">
                {value.__typename !== "RegularClassTemplate" &&
                  value?.status.isVIPOnly && (
                    <div>
                      <Tag severity="warning">VIP</Tag>
                    </div>
                  )}
                <div>
                  <Tag className="bg-victoria-600 ">
                    {value.__typename === "SpecialEvent"
                      ? "Special Class"
                      : value?.details?.level?.description}
                  </Tag>
                </div>
              </div>
            </div>
          </div>
          {/* Instructors info */}
          <div className="md:hidden mx-2">
            <Instructors value={value?.instructors} mode="image" />
          </div>
        </div>

        {/* Primary content */}
        <div className="border border-x-wisteria-400 border-y-0">
          {/* Breakpoint Large */}
          <div className="p-2 lg:flex lg:justify-around ">
            {/* Schedule */}
            <div className="flex justify-around my-4">
              <div className="flex lg:flex-none">
                <div className="text-xl lg:text-2xl my-auto">{schedule}</div>
              </div>
              <div className="flex my-auto">
                <div className="lg:ml-2 my-auto">{time}</div>
                <div className="hidden md:inline">
                  ({value?.schedule?.duration + " mins"})
                </div>
              </div>
            </div>
            {/* Availability / Capacity */}
            <div className="my-auto bg-neutral-100 lg:bg-transparent rounded border-neutral-200 border lg:border-none p-2">
              <div className="inline lg:hidden text-center text-sm text-gray-600">
                <div>{label}</div>
              </div>
              <div className="flex flex-container justify-around">
                <div className="my-auto lg:pr-4 hidden lg:inline">{label}</div>
                {/* Breakpoint mid */}
                <div className="md:inline gap-4">
                  <div className="flex justify-between my-1 gap-3">
                    {value.__typename === "SpecialEvent" ? (
                      <div>
                        {`🌏 Online - ${new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          maximumFractionDigits: 0,
                        }).format(value.online.cost)}`}
                      </div>
                    ) : (
                      <div>{`🌏 Online - ${value.online.cost} points`}</div>
                    )}
                    <div className="class-availability w-8 my-auto rounded-md p-1 text-xs text-center">
                      {availabilityOnline}
                    </div>
                  </div>
                  <div className="flex justify-between my-1 gap-3">
                    {value.__typename === "SpecialEvent" ? (
                      <div>
                        {`🏠 Offline - ${new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          maximumFractionDigits: 0,
                        }).format(value.offline.cost)}`}
                      </div>
                    ) : (
                      <div>🏠 {`Offline - ${value.offline.cost} points`}</div>
                    )}

                    <div className="class-availability w-8 my-auto rounded-md p-1 text-xs text-center">
                      {availabilityOffline}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Policy */}
          <Button
            className="p-button-text p-button-small text-xs w-full text-gray-500 hover:text-gray-600 italic my-2"
            label="Booking Policy"
            onClick={() => setShowDialog(true)}
          />
        </div>
        <Button
          className="p-button-outlined w-full"
          label={buttonLabel}
          onClick={props.onButtonClick}
          disabled={buttonDisabled}
        />
      </div>
      <Dialog
        className="w-full lg:w-8/12 xl:w-5/12"
        header="Booking Policy"
        visible={showDialog}
        onHide={() => setShowDialog(false)}
      >
        <Tag severity="info">Booking Time Limit</Tag>
        <ul className="list-none text-sm">
          <li>{bookingLabelOnline}</li>
          <li>{bookingLabelOffline}</li>
        </ul>

        {value.__typename !== "SpecialEvent" && (
          <>
            <Tag severity="info">Cancellation Time Limit</Tag>
            <ul className="list-none text-sm">
              <li>{cancelLabelOnline}</li>
              <li>{cancelLabelOffline}</li>
            </ul>
          </>
        )}
        <div>
          <Tag severity="info">Additional Info</Tag>
          <BookingPolicy __typename={value.__typename} />
        </div>
      </Dialog>
    </>
  );
};
