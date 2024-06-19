import BookingForm from "@/components/Form/BookingForm";
import BookingFormSpecialEvent from "@/components/Form/BookingFormSpecialEvent";
import MembershipSection from "@/components/HomePage/MembershipSection";
import Layout from "@/components/Layout/Layout";
import { RegularClassGrid } from "@/components/RegularClass/RegularClassGrid";
import { RegularClassList } from "@/components/RegularClass/RegularClassList";
import LoadingSkeleton from "@/components/UI/LoadingSkeleton";
import useSearchReducer from "@/hooks/useSearchReducer";

import { DateTime } from "luxon";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Card } from "primereact/card";
import {
  DataView,
  DataViewLayoutOptions,
  DataViewLayoutType,
} from "primereact/dataview";
import { Dialog } from "primereact/dialog";
import { ProgressBar } from "primereact/progressbar";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { useRef, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { SearchClassesQuery } from "src/api";
import { RegularClass, SpecialEvent } from "src/generated/graphql";

const SearchPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const { classType, from, to, instructors } = router.query as {
    classType: "all" | "online" | "offline";
    from: string;
    to: string;
    instructors: string | string[];
  };

  let online: boolean, offline: boolean;

  switch (classType) {
    case "all":
      online = true;
      offline = true;
      break;
    case "online":
      online = true;
      offline = false;
      break;
    case "offline":
      online = false;
      offline = true;
      break;
    default:
      break;
  }

  const earlyToday = DateTime.now().startOf("day").toJSDate();
  const nextMonth = DateTime.now().plus({ day: 30 }).endOf("day").toJSDate();

  const { state, SearchYogaClass } = useSearchReducer({
    from: from ? DateTime.fromISO(from).startOf("day").toJSDate() : earlyToday,
    to: to ? DateTime.fromISO(to).endOf("day").toJSDate() : nextMonth,
    online,
    offline,
    instructors: typeof instructors === "string" ? [instructors] : instructors,
  });

  const dataset = useQuery(
    ["SearchClassesQuery", state],
    () => SearchClassesQuery(state),
    { refetchOnMount: true }
  );

  const bookingHandler = (data: RegularClass | SpecialEvent) => {
    setShowBookingForm(true);
    setSelectedClass(data);
  };

  const [layout, setLayout] = useState<DataViewLayoutType>("list");

  const itemTemplate = (data: RegularClass & SpecialEvent) => {
    if (!data) return <></>;
    if (layout === "list")
      return (
        <RegularClassList
          value={data}
          onButtonClick={() => bookingHandler(data)}
        />
      );
    if (layout === "grid")
      return (
        <RegularClassGrid
          value={data}
          onButtonClick={() => bookingHandler(data)}
        />
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

  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedClass, setSelectedClass] = useState<
    RegularClass | SpecialEvent
  >(null);

  const toast = useRef<Toast>(null);

  const queryClient = useQueryClient();

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

  return (
    <Layout>
      <Toast ref={toast} />

      <div className="my-2">
        <SearchYogaClass loading={dataset.isLoading} />
      </div>

      <Card className="my-2">
        <Toolbar
          end={
            <DataViewLayoutOptions
              layout={layout}
              onChange={(e) => setLayout(e.value)}
            />
          }
          className="my-2"
        />

        {dataset.isLoading && (
          <div className="my-5">
            <ProgressBar mode="indeterminate" style={{ height: "6px" }} />
          </div>
        )}

        <DataView
          value={filteredDataBySchedule}
          layout={layout}
          itemTemplate={itemTemplate}
          emptyMessage="We do not have any class within this period."
        />
      </Card>

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
                      You can submit it by clicking Request New button below.
                    </div>
                    <div>It is also available on home page.</div>
                  </div>
                </div>
                <div className="w-full sm:w-96 mx-auto">
                  <MembershipSection toast={toast} />
                  <div className="my-10 italic">
                    Upon approval, you will see available balance and can start
                    to book our weekly classes.
                  </div>
                </div>
              </div>
            )}
        </>
      </Dialog>
    </Layout>
  );
};

SearchPage.auth = {
  role: "private",
  loading: <LoadingSkeleton />,
  unauthorized: "/auth/unauthorized",
};

export default SearchPage;
