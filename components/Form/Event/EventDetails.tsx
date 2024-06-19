import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useCallback, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useMutation } from "react-query";
import {
  AddZoomMeetingRegularClass,
  AddZoomMeetingSpecialEvent,
} from "src/api";
import DTFormat from "../../UI/DTFormat";
import Instructors from "../../User/Instructors";

const EventDetails = (props) => {
  const { event } = props;
  const toast = useRef<Toast>(null);

  const [copied, setCopied] = useState(false);
  const addZoomRegularClass = useMutation(AddZoomMeetingRegularClass);
  const addzoomSpecialEvent = useMutation(AddZoomMeetingSpecialEvent);

  const onClick = () => {
    toast.current.show({ severity: "success", summary: "Copied to clipboard" });
  };
  const onCopy = useCallback(() => {
    setCopied(true);
  }, []);

  const zoomUpdateHandler = async () => {
    try {
      if (event.extendedProps.__typename === "RegularClass")
        await addZoomRegularClass.mutateAsync({
          _id: event?.extendedProps?._id,
        });

      if (event.extendedProps.__typename === "SpecialEvent")
        await addzoomSpecialEvent.mutateAsync({
          _id: event?.extendedProps?._id,
        });

      props.onZoomUpdate();
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Failed",
        detail: `${error.message}`,
      });
    }
  };

  if (!event) return <></>;

  const { instructors, zoom } = event?.extendedProps;

  return (
    <div>
      <Toast ref={toast} />
      <div className="md:flex justify-between">
        <div className="text-lg md:text-xl my-auto mr-auto">{event?.title}</div>
        <div className="my-2 md:my-0 overflow-text-hidden">
          <Instructors value={instructors} />
        </div>
      </div>
      <div>
        <div>
          <span className="mr-2">📅</span>
          {<DTFormat value={event?.start} dateOnly />}
        </div>
        <div>
          {!event.allDay ? (
            <div>
              <span className="mr-2">🕒</span>
              <DTFormat value={event?.start} timeOnly />
              <span> - </span>
              <DTFormat value={event?.end} timeOnly />
            </div>
          ) : (
            <span>All Day Event</span>
          )}
        </div>

        {zoom?.meetingId ? (
          <>
            <div className="my-3 md:flex justify-between gap-2">
              <div className="p-inputgroup w-full">
                <span className="p-inputgroup-addon">ID</span>
                <InputText
                  className="w-full"
                  value={zoom?.meetingId}
                  id="meetingId"
                />
              </div>
              <div className="p-inputgroup w-full mt-3 md:mt-0">
                <span className="p-inputgroup-addon">
                  <i className="pi pi-key"></i>
                </span>
                <InputText
                  className="w-full"
                  value={zoom?.password}
                  id="password"
                />
              </div>
            </div>
            <div className="p-inputgroup w-full my-2">
              <span className="p-inputgroup-addon">
                <i className="pi pi-link"></i>
              </span>
              <InputText
                className="w-full text-xs"
                value={zoom?.joinUrl}
                id="joinUrl"
              />
              <Button
                className="p-input-group-addon p-button-secondary"
                icon="pi pi-external-link"
                onClick={() => {
                  window.open(zoom?.joinUrl, "_blank", "noopener,noreferrer");
                }}
              />
            </div>
            <CopyToClipboard
              onCopy={onCopy}
              text={`${zoom?.simpleTitle}\n${event?.start}\n\nMeeting ID : ${zoom?.meetingId}\nPasscode : ${zoom?.password}\n\n${zoom.joinUrl}\n\n`}
            >
              <Button
                label="Copy Zoom Details"
                className="w-full my-1"
                onClick={onClick}
              />
            </CopyToClipboard>
          </>
        ) : (
          <div className="my-4 text-center">
            <Button
              label="Create Zoom Meeting"
              onClick={zoomUpdateHandler}
              loading={
                addZoomRegularClass.isLoading || addzoomSpecialEvent.isLoading
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;
