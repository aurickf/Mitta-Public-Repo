import { CopyToClipboard } from "react-copy-to-clipboard";
import { IBookingCardProps } from "interface/BookingCard";
import { DateTime } from "luxon";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Inplace, InplaceContent, InplaceDisplay } from "primereact/inplace";
import { Tag } from "primereact/tag";
import DTFormat from "./UI/DTFormat";
import Instructors from "./User/Instructors";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { Image } from "primereact/image";
import { Divider } from "primereact/divider";

const BookingCard = (props: IBookingCardProps) => {
  const { mode } = props;
  // @ts-ignore
  const { classType, bookingCode, status, __typename, payment } = props.value;

  const key = __typename === "BookingCard" ? "regularClass" : "event";

  const { details, schedule, instructors, online, offline, zoom } =
    props.value[key];

  let cancelTimeLimit = {
    online: DateTime.fromISO(schedule.date)
      .minus({
        hour: online?.cancelTimeLimit ?? 1,
      })
      .toJSDate(),
    offline: DateTime.fromISO(schedule.date)
      .minus({
        hour: offline?.cancelTimeLimit ?? 1,
      })
      .toJSDate(),
  };

  const isCancelButtonDisabled = cancelTimeLimit[classType] < DateTime.now();

  const bookingCardTag = () => {
    switch (mode) {
      case "detail":
        return (
          <div>
            <div>Booking Code </div>
            <div className="text-right">
              <Tag value={bookingCode} severity="info" />
            </div>
          </div>
        );
      case "upcoming":
        return (
          <div>
            <Button
              className="p-button-outlined"
              label="View Details"
              onClick={() => props.onClick(props.value)}
            />
          </div>
        );
      case "past":
        let severity = "info";

        if (status.value === "Confirmed") severity = "success";
        if (
          status.value === "Class Cancelled" ||
          status.value === "Booking Cancelled"
        )
          severity = "warning";

        return (
          <div>
            {/* @ts-ignore */}
            <Tag value={status.value} severity={severity} />
          </div>
        );

      default:
        return <></>;
    }
  };

  const toast = useRef<Toast>(null);

  return (
    <>
      <Toast ref={toast} />
      <Card className="booking-card w-full md:w-10/12 lg:w-8/12 mx-auto my-2 relative border">
        <div className="w-full flex flex-wrap justify-between -mt-5 mb-5">
          <div className="flex justify-between gap-2 text-xl ">
            <div className="my-auto">{details.title}</div>
            {(mode === "upcoming" || mode === "detail") && (
              <>
                <Button
                  className="p-button-sm"
                  link
                  icon="pi pi-share-alt"
                  aria-label="Share this class"
                  tooltip="Share this class"
                  tooltipOptions={{ position: "top" }}
                  onClick={() => {
                    window.open(
                      `/${details?.title
                        .split(" ")
                        .join("_")}/${DateTime.fromISO(
                        schedule?.date
                      ).toISODate()}`
                    );
                  }}
                />
                <Tag value={classType} severity="success" className="my-auto" />
              </>
            )}
          </div>

          <div className="my-auto">
            <Instructors value={instructors} />
          </div>
        </div>

        <div className="flex justify-between mt-2">
          <div>
            <div>
              <span className="pr-2">📅</span>
              <DTFormat value={schedule.date} dateOnly />
            </div>
            <div>
              <span className="pr-2">🕒</span>
              <DTFormat
                value={schedule.date}
                duration={schedule.duration}
                timeOnly
              />
            </div>
          </div>
          {bookingCardTag()}
        </div>
        {mode === "detail" && classType === "online" && (
          <>
            {((__typename === "EventBookingCard" &&
              status.value === "Confirmed") ||
              __typename === "BookingCard") && (
              <div className="py-3 my-2 ">
                {zoom.joinUrl ? (
                  <div>
                    {isCancelButtonDisabled && (
                      <div className="text-center my-2 bg-gray-100 p-2 rounded-sm text-gray-700 relative">
                        <div className="absolute top-0 right-0">
                          <CopyToClipboard
                            onCopy={() => {
                              toast.current.show({
                                severity: "info",
                                summary: "Copied to clipbord",
                                detail:
                                  "Zoom info can now be pasted to another application.",
                              });
                            }}
                            text={`${details.title}\n${DateTime.fromISO(
                              schedule.date
                            ).toFormat(
                              "dd LLL yyyy HH:mm"
                            )}\n\nZoom Meeting ID : ${
                              zoom.meetingId
                            }\nPassword : ${zoom.password}\n\nJoin URL : ${
                              zoom.joinUrl
                            }\n\nThis link is for your personal use only, please do not send to other member\n\n`}
                          >
                            <Button
                              className="p-button-sm p-button-outlined"
                              icon="pi pi-copy"
                            />
                          </CopyToClipboard>
                        </div>
                        <div className="mb-2">
                          <div className="text-xs italic">Zoom Meeting ID</div>
                          <div className="my-1">{zoom.meetingId}</div>
                        </div>
                        <div>
                          <div className="text-xs italic">Password</div>
                          <div className="my-1">{zoom.password}</div>
                        </div>
                      </div>
                    )}

                    <Button
                      className="w-full"
                      iconPos="right"
                      icon={isCancelButtonDisabled && "pi pi-external-link"}
                      label={
                        isCancelButtonDisabled
                          ? "Join via Zoom"
                          : `Link will be available on ${DateTime.fromJSDate(
                              cancelTimeLimit[classType]
                            ).toFormat("dd LLL, HH:mm")}`
                      }
                      disabled={!isCancelButtonDisabled}
                      onClick={() => {
                        window.open(
                          zoom?.joinUrl,
                          "_blank",
                          "noopener,noreferrer"
                        );
                      }}
                    />
                  </div>
                ) : (
                  <div className="bg-wisteria-50 rounded-sm border-1 border-wisteria-100">
                    <div className="text-sm italic text-center text-red-500">
                      <div>
                        This class has not been linked with Zoom Meeting,
                      </div>
                      <div>Please contact our administrator.</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
        {__typename === "EventBookingCard" && (
          <div className="bg-wisteria-50 text-gray-700 py-2 rounded-sm border-wisteria-100 border-1 mt-3">
            <div className="text-center">
              Registration status : {status.value.toLowerCase()}
            </div>
            {mode === "detail" &&
              __typename === "EventBookingCard" &&
              status.value === "Pending" &&
              payment.image && (
                <div className="text-center my-3 ">
                  <div className="text-xs italic my-2">Proof of Payment</div>
                  <Image
                    src={payment.image}
                    alt="payment"
                    height="100px"
                    width="50px"
                    preview
                    downloadable
                  />
                </div>
              )}
          </div>
        )}

        {mode === "detail" && __typename === "BookingCard" && (
          <Inplace>
            <InplaceDisplay>
              <div>
                <Button
                  className="w-full p-button-danger p-button-outlined m-0"
                  label="Show Cancellation Info"
                />
              </div>
            </InplaceDisplay>
            <InplaceContent>
              <div className="mt-5 w-full bg-fuchsia-50 text-fuchsia-800 border p-4 rounded">
                <div className="w-full flex flex-wrap gap-x-2 justify-center">
                  <span className="pr-2">Cancel Time Limit</span>
                  <DTFormat value={cancelTimeLimit[classType]} />
                </div>
                <div>
                  {!isCancelButtonDisabled && (
                    <Button
                      label="Cancel This Booking"
                      severity="danger"
                      className="w-full mt-5"
                      onClick={props.onCancel}
                      disabled={isCancelButtonDisabled}
                      icon="pi pi-trash"
                      loading={props.loading}
                    />
                  )}
                </div>
              </div>
            </InplaceContent>
          </Inplace>
        )}
      </Card>
    </>
  );
};

export default BookingCard;
