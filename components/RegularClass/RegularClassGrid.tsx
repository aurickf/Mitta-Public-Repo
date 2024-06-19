import useEventDataView from "@/hooks/useEventDataView";
import { SpecialEventDataView } from "@/interface/SpecialEventDataView";
import { RegularClassDataView } from "interface/RegularClassDataView";
import { DateTime } from "luxon";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import { Inplace, InplaceContent, InplaceDisplay } from "primereact/inplace";
import { Tag } from "primereact/tag";
import Instructors from "../User/Instructors";
import { BookingPolicy } from "./BookingPolicy";
import ClassTag from "./ClassTag";

export const RegularClassGrid = (
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

  return (
    <div className="w-full md:w-6/12 lg:w-4/12 md:mx-auto my-2">
      <div className="border-1 surface-border shadow-2 mx-2">
        <div className="class-header text-xl text-center rounded-top rounded-t py-2 my-auto h-5rem md:h-5rem maxflex relative ">
          <div className="w-11/12 mx-auto my-auto pt-8 flex justify-center">
            {value?.details?.title}
            {value.__typename !== "RegularClassTemplate" && (
              <div className="absolute right-0">
                <Button
                  className="p-button-link p-button-sm p-0"
                  icon="pi pi-share-alt"
                  aria-label="Share this class"
                  tooltip="Share this class"
                  tooltipOptions={{ position: "bottom" }}
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
          <div className="absolute top-0 right-0 mt-1 mr-1">
            <div className="flex gap-2  ">
              {value.__typename !== "RegularClassTemplate" &&
                value?.status.isVIPOnly && (
                  <div>
                    <Tag severity="warning">VIP</Tag>
                  </div>
                )}
              <div>
                <Tag className="bg-victoria-600">
                  {value.__typename === "SpecialEvent"
                    ? "Special Class"
                    : value.details.level.description}
                </Tag>
              </div>
            </div>
          </div>
        </div>
        {/* Primary Content */}
        <div className="border border-x-wisteria-400 border-y-0">
          <ul className="list-none p-0 m-0">
            {/* Instructors */}
            <li className="flex flex-wrap items-center py-3 px-2 border-t surface-border">
              <div className="flex">
                <div className="mr-2 my-auto">👤</div>
                <div>
                  <Instructors value={value?.instructors} />
                </div>
              </div>
            </li>
            {/* Schedule */}
            <li className="flex flex-wrap items-center py-3 px-2 border-t surface-border">
              <div className="">
                <span className="mr-2">📅</span>
                {schedule}
              </div>
            </li>
            {/* Time */}
            <li className="flex flex-wrap items-center py-3 px-2 border-t surface-border">
              <div className="">
                <span className="mr-2">🕒</span>
                <span>
                  {time} ({value?.schedule?.duration} mins)
                </span>
              </div>
            </li>
            {/* Availability / Capacity */}
            <li className="flex flex-wrap justify-between items-center py-3 px-2 border-t surface-border">
              <div className="mx-auto my-auto">{label}</div>
              <div className="mx-auto">
                <ul className="list-none p-0 m-0">
                  <li className="border-b surface-border py-2">
                    <div className="flex  justify-between gap-2 flex-wrap">
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
                  </li>
                  <li>
                    <div className="flex  justify-between gap-2 flex-wrap py-2">
                      {value.__typename === "SpecialEvent" ? (
                        <div>
                          {`🏠 Offline - ${new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            maximumFractionDigits: 0,
                          }).format(value.offline.cost)}`}
                        </div>
                      ) : (
                        <div>{`🏠 Offline - ${value.offline.cost} points`}</div>
                      )}
                      <div className="class-availability w-8 my-auto rounded-md p-1 text-xs text-center">
                        {availabilityOffline}
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
          <div className="mx-auto">
            <Inplace>
              <InplaceDisplay>
                <div>
                  <Button
                    className="w-full p-button-text text-sm"
                    label="Details"
                  />
                </div>
              </InplaceDisplay>
              <InplaceContent>
                <div className="mx-2 mb-2 text-center">
                  <div className="py-2">{value?.details?.description}</div>
                  <div className="flex justify-center">
                    <ClassTag tags={value?.details?.tags} />
                  </div>
                </div>

                <Accordion className="text-xs">
                  <AccordionTab header="Booking Time Limit">
                    <ul className="list-none text-sm">
                      <li>{bookingLabelOnline}</li>
                      <li>{bookingLabelOffline}</li>
                    </ul>
                  </AccordionTab>
                  {value.__typename !== "SpecialEvent" && (
                    <AccordionTab header="Cancellation Time Limit">
                      <ul className="list-none text-sm">
                        <li>{cancelLabelOnline}</li>
                        <li>{cancelLabelOffline}</li>
                      </ul>
                    </AccordionTab>
                  )}
                  <AccordionTab header="Additional Info">
                    <BookingPolicy __typename={value.__typename} />
                  </AccordionTab>
                </Accordion>
              </InplaceContent>
            </Inplace>
          </div>
        </div>

        <div className="">
          <Button
            className="w-full p-button-outlined"
            label={buttonLabel}
            onClick={props.onButtonClick}
            disabled={buttonDisabled}
          />
        </div>
      </div>
    </div>
  );
};
