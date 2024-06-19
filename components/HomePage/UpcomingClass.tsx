import useSearchReducer from "@/hooks/useSearchReducer";
import { DateTime } from "luxon";
import { useSession } from "next-auth/react";
import { DataView } from "primereact/dataview";
import { useQuery, useQueryClient } from "react-query";
import { SearchClassesQuery } from "src/api";
import { RegularClass, SpecialEvent } from "src/generated/graphql";
import DTFormat from "../UI/DTFormat";
import Instructors from "../User/Instructors";
import { Button } from "primereact/button";
import { Inplace, InplaceDisplay, InplaceContent } from "primereact/inplace";
import { Toast } from "primereact/toast";
import { useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import BookingForm from "../Form/BookingForm";
import BookingFormSpecialEvent from "../Form/BookingFormSpecialEvent";

const from = DateTime.now().startOf("day").toJSDate();
const to = DateTime.now().plus({ day: 7 }).endOf("day").toJSDate();

const UpcomingClass = ({ toast }) => {
  const { data: session } = useSession();

  const { state, SearchYogaClass } = useSearchReducer({
    from,
    to,
    online: true,
    offline: true,
    instructors: [],
  });

  const dataset = useQuery(
    ["SearchClassesQuery", state],
    () => SearchClassesQuery(state),
    { refetchOnMount: true }
  );

  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedClass, setSelectedClass] = useState<
    RegularClass | SpecialEvent
  >(null);

  const queryClient = useQueryClient();

  const bookingHandler = (data: RegularClass | SpecialEvent) => {
    setShowBookingForm(true);
    setSelectedClass(data);
  };

  const onBookSuccess = (message: String) => {
    toast.current.show({
      severity: "success",
      summary: "Done",
      detail: message,
    });

    queryClient.invalidateQueries(["SearchClassesQuery", state]);
    queryClient.invalidateQueries(["MyBookingSection", session.user._id]);

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

  const itemTemplate = (data: RegularClass & SpecialEvent) => {
    if (!data) return <></>;
    return (
      <div className="class-bg mb-2 rounded class-border-b drop-shadow">
        <div className="flex flex-wrap gap-2 justify-between my-auto px-2 py-2 rounded-t class-header">
          <div className="text-xl my-auto">{data.details.title}</div>
          <div className="my-auto">
            <Instructors value={data.instructors} />
          </div>
        </div>
        <div className="flex flex-wrap gap-x-2 gap-y-6 justify-between px-4 pt-2 pb-4 class-border-x">
          <div className="">
            <div className="my-2">
              <DTFormat
                value={data.schedule.date}
                duration={data.schedule.duration}
              />
            </div>
            <div className="flex flex-wrap gap-x-5">
              <div className="my-auto mx-auto">Availability</div>
              <div className="flex flex-wrap gap-5 mx-auto">
                <div className="flex flex-wrap gap-5 grow justify-around">
                  <div className="">
                    Online
                    <div className="text-xs italic">
                      {data.__typename === "SpecialEvent" ? (
                        <div>
                          {`${new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            maximumFractionDigits: 0,
                          }).format(data.online.cost)}`}
                        </div>
                      ) : (
                        <div>{`${data.online.cost} points`}</div>
                      )}
                    </div>
                  </div>
                  <div className="class-availability w-8 my-auto rounded-md p-1 text-xs text-center drop-shadow-sm">
                    {data.online.availability}
                  </div>
                </div>
                <div className="flex flex-wrap gap-5 grow justify-around">
                  <div className="">
                    Offline
                    <div className="text-xs italic">
                      {data.__typename === "SpecialEvent" ? (
                        <div>
                          {`${new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            maximumFractionDigits: 0,
                          }).format(data.offline.cost)}`}
                        </div>
                      ) : (
                        <div>{`${data.offline.cost} points`}</div>
                      )}
                    </div>
                  </div>
                  <div className="class-availability w-8 my-auto rounded-md p-1 text-xs text-center drop-shadow-sm">
                    {data.offline.availability}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-xs my-auto ml-auto">
            <Button
              size="small"
              label="Book"
              onClick={() => bookingHandler(data)}
            />
          </div>
        </div>
      </div>
    );
  };

  const filteredData = (dataset.data?.searchClassesQuery || []).filter(
    (event) => {
      switch (event.status.isVIPOnly) {
        case true:
          if (session?.user?.membership?.isVIP) return true;
          else return false;
        case false:
          return true;
        default:
          throw new Error("Something went wrong. Please contact admin.");
      }
    }
  );

  const now = DateTime.now().setZone("UTC").toISO();

  const filteredDataBySchedule = filteredData.filter(
    (event) => event.schedule.date > now
  );

  const footer = (
    <div className="text-center">
      <Inplace closable>
        <InplaceDisplay>
          <div className="w-full pb-1 pt-3 rounded border-victoria-400 border  bg-victoria-400/60 text-victoria-50">
            <i className="pi pi-angle-double-down animate-bounce" />
          </div>
        </InplaceDisplay>
        <InplaceContent>
          <SearchYogaClass loading={false} />
        </InplaceContent>
      </Inplace>
    </div>
  );

  return (
    <>
      <Dialog
        visible={showBookingForm}
        onHide={() => setShowBookingForm(false)}
        className="w-full md:w-10/12 lg:w-8/12 xl:w-6/12"
        blockScroll
      >
        <>
          {selectedClass?.__typename === "SpecialEvent" && (
            <BookingFormSpecialEvent
              booker={session.user}
              user={session.user}
              event={selectedClass as SpecialEvent}
              onBookSuccess={onBookSuccess}
              onBookFailed={onBookFailed}
            />
          )}
          {selectedClass?.__typename === "RegularClass" &&
            session.user.membership.latest && (
              <BookingForm
                booker={session.user}
                user={session.user}
                regularClass={selectedClass as RegularClass}
                onBookSuccess={onBookSuccess}
                onBookFailed={onBookFailed}
              />
            )}
          {selectedClass?.__typename === "RegularClass" &&
            !session.user.membership.latest && (
              <div className="text-victoria-600 text-center">
                <div className="mb-10">
                  <div className="text-xl mx-auto mb-2">
                    Selected Class Requires Membership to Book
                  </div>
                  <div className="text-sm italic">
                    <div>
                      You can submit it by clicking Request New button on
                      membership section.
                    </div>
                  </div>
                </div>
              </div>
            )}
        </>
      </Dialog>
      <DataView
        className="customDataView max-w-lg mx-auto"
        loading={dataset.isLoading}
        value={filteredDataBySchedule.slice(0, 5)}
        itemTemplate={itemTemplate}
        emptyMessage="We do not have any class within the next 7 days. Please try to search for other dates"
        rows={5}
        footer={footer}
      />
    </>
  );
};

export default UpcomingClass;
