import { IShareClassProps } from "@/interface/ShareClass";
import { DateTime } from "luxon";
import router from "next/router";
import { Button } from "primereact/button";
import { Chip } from "primereact/chip";
import { Tag } from "primereact/tag";
import DTFormat from "../UI/DTFormat";
import Instructors from "../User/Instructors";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Dialog } from "primereact/dialog";
import BookingForm from "../Form/BookingForm";
import BookingFormSpecialEvent from "../Form/BookingFormSpecialEvent";
import { useQueryClient } from "react-query";

const ShareClass = (props: IShareClassProps) => {
  const { data: session } = useSession();

  const { event, toast } = props;

  const queryClient = useQueryClient();

  const date = DateTime.fromISO(event.schedule.date).toISODate();
  const now = DateTime.now().endOf("day").toISODate();

  const [showBookingForm, setShowBookingForm] = useState(false);

  const tagData =
    event.details.tags.length === 0
      ? [
          `${event.details.title}`,
          "yoga jakarta selatan",
          "yoga studio jakarta",
        ]
      : event.details.tags;

  const onBookSuccess = async (message: String) => {
    toast.current.show({
      severity: "success",
      summary: "Done",
      detail: message,
    });

    setShowBookingForm(false);
  };

  const onBookFailed = (error) => {
    toast.current.show({
      severity: "error",
      summary: "Booking Failed",
      detail: `${error.message}`,
    });
    setShowBookingForm(false);
  };

  return (
    <>
      <div className="class-border-b class-bg shadow-md rounded-b  my-4 border ">
        <div className="class-header py-2 rounded-t text-center text-xl relative">
          <div className="absolute top-0 right-0 flex gap-2">
            {event.status.isVIPOnly && <Tag severity="warning">VIP</Tag>}
            {event.__typename === "RegularClass" && (
              <Tag>{event.details.level.description}</Tag>
            )}
          </div>
          <div className="text-xl mt-4">{event.details.title}</div>
          <div className="text-sm italic my-2">
            <DTFormat
              value={event.schedule.date}
              duration={event.schedule.duration}
            />
          </div>
        </div>
        <div className="class-border-x px-4 text-neutral-700 border ">
          <div className="flex gap-2 my-2">
            <div className="my-auto">Class led by</div>
            <Instructors value={event.instructors} />
          </div>
          <div className="my-2">{event.details.description}</div>
          <div className="flex flex-wrap gap-2 my-4 justify-center">
            {tagData.map((tag: string, i: number) => (
              <Chip
                key={i}
                label={tag}
                template={(props) => (
                  <span
                    className="text-center text-xs py-1"
                    aria-label={props.label}
                  >
                    {props.label}
                  </span>
                )}
                className="tag"
              />
            ))}
          </div>
          {/* Redirect to Booking Page */}
          <div className="text-center pb-4">
            <Button
              className="p-button-sm p-button-raised"
              label={`Book ${event.details.title} on ${DateTime.fromISO(
                event.schedule.date
              ).toFormat("dd LLL yyyy")}`}
              aria-label={`Book ${event.details.title}`}
              onClick={() => {
                if (session) {
                  setShowBookingForm(true);
                } else {
                  router.push(`/`);
                }
              }}
              disabled={now > date}
            />
          </div>
        </div>
      </div>
      <Dialog
        visible={showBookingForm}
        onHide={() => setShowBookingForm(false)}
      >
        {event?.__typename === "RegularClass" ? (
          <BookingForm
            booker={session?.user}
            user={session?.user}
            regularClass={event}
            onBookSuccess={onBookSuccess}
            onBookFailed={onBookFailed}
          />
        ) : (
          <BookingFormSpecialEvent
            booker={session?.user}
            user={session?.user}
            event={event}
            onBookSuccess={onBookSuccess}
            onBookFailed={onBookFailed}
          />
        )}
      </Dialog>
    </>
  );
};

export default ShareClass;
