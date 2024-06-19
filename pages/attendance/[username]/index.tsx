import FullCalendar from "@fullcalendar/react";

import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";

import Layout from "@/components/Layout/Layout";
import ClassColorAndIcon from "@/components/RegularClass/ClassColorAndIcon";
import DTFormat from "@/components/UI/DTFormat";
import LoadingSkeleton from "@/components/UI/LoadingSkeleton";
import useEvent from "@/hooks/useEvent";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { DataScroller } from "primereact/datascroller";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  ActiveHolidays,
  RegularClassesByInstructorsUsername,
  UpdateClassAttendance,
} from "src/api";
import UpdateClassStatus from "@/components/Attendance/UpdateClassStatus";
import { DateTime } from "luxon";
import { ProgressBar } from "primereact/progressbar";

const InstructorAttendance = () => {
  const { data: session } = useSession();

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [viewedDate, setViewedDate] = useState(DateTime.now().toJSDate());

  const toast = useRef(null);

  const router = useRouter();
  const { username } = router.query as { username: string };

  useEffect(() => {
    if (
      !(session.user.role.isAdmin || session.user.role.isSuperAdmin) &&
      session.user.username != username
    )
      router.replace("/auth/unauthorized");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const queryClient = useQueryClient();
  const dataset = useQuery(
    ["regularClassesByInstructorsUsername", username, viewedDate],
    () => RegularClassesByInstructorsUsername({ username, viewedDate }),
    {
      enabled: !!username,
      keepPreviousData: true,
      staleTime: 60 * 1000,
    }
  );

  const { runningClass, cancelledClass, pendingClass } = useEvent(
    dataset,
    "regularClassesByInstructorsUsername"
  );

  const holidayDataset = useQuery(["activeHolidays"], () => ActiveHolidays());

  const holiday = holidayDataset.data?.activeHolidays.map((holiday) => {
    return {
      title: holiday.title,
      allDay: true,
      start: holiday.start,
      end: holiday.end,
      color: "dimgrey",
      textColor: "white",
      extendedProps: {
        clickable: false,
      },
    };
  });

  const events = [runningClass, cancelledClass, pendingClass, holiday];

  const updateAttendance = useMutation(UpdateClassAttendance);

  const eventClick = (eventInfo) => {
    if (eventInfo.event.extendedProps.clickable) {
      setSelectedEvent(eventInfo.event);
      setShowEventDetails(true);
    }
  };

  const itemTemplate = (data) => {
    return <div>{data.user.name}</div>;
  };

  const onSuccess = (message: String) => {
    toast.current.show({
      severity: "success",
      summary: "OK",
      detail: message,
    });
  };

  const onError = (error) => {
    toast.current.show({
      severity: "error",
      summary: "Failed",
      detail: `${error.message}`,
    });
  };

  const onSubmit = async () => {
    let message: string;
    const values = methods.getValues();

    switch (values.action) {
      case "confirm":
        message = "Class confirmed running";
        break;

      case "cancel":
        message = "Class cancellation done";
        break;

      default:
        throw new Error("Invalid action");
    }

    try {
      await updateAttendance.mutateAsync({
        _id: selectedEvent.extendedProps._id,
        updatedBy: session.user._id,
        ...values,
      });
      onSuccess(message);
      queryClient.invalidateQueries([
        "regularClassesByInstructorsUsername",
        username,
      ]);
    } catch (error) {
      error.response.errors.forEach((err) => onError(err));
    }
    setShowEventDetails(false);
    setSelectedEvent(null);
  };

  const calendarRef = useRef(null);
  const [selectedView, setSelectedView] = useState("dayGridMonth");
  const [showDialogLegend, setShowDialogLegend] = useState(false);

  const dropdownOptions = [
    {
      label: "month",
      value: "dayGridMonth",
    },
    {
      label: "week",
      value: "timeGridWeek",
    },
    {
      label: "list",
      value: "listWeek",
    },
  ];

  const cardSubTitle = (
    <div className="flex flex-wrap gap-2 bg-white/80 p-2 pt-12 rounded-sm">
      <div className="flex grow gap-2 my-auto">
        <Button
          className="p-button-outlined p-button-sm"
          label="today"
          onClick={() => {
            calendarRef.current.getApi().today();
            const currDate = calendarRef.current.getApi().getDate();
            setViewedDate(currDate);
          }}
        />
        <Button
          className="p-button-outlined p-button-sm"
          icon="pi pi-angle-left"
          aria-label="prev"
          onClick={() => {
            calendarRef.current.getApi().prev();
            const currDate = calendarRef.current.getApi().getDate();
            setViewedDate(currDate);
          }}
        />
        <Button
          className="p-button-outlined p-button-sm"
          icon="pi pi-angle-right"
          aria-label="next"
          onClick={() => {
            calendarRef.current.getApi().next();
            const currDate = calendarRef.current.getApi().getDate();
            setViewedDate(currDate);
          }}
        />
      </div>
      <div className="mx-auto">
        <Button
          className="p-button-rounded p-button-text absolute top-0 right-0 m-3"
          icon="pi pi-question-circle"
          onClick={() => setShowDialogLegend(!showDialogLegend)}
        />
        <Dropdown
          options={dropdownOptions}
          value={selectedView}
          onChange={(e) => {
            setSelectedView(e.value);
            calendarRef.current.getApi().changeView(e.value);
          }}
        />
      </div>
    </div>
  );

  const methods = useForm({
    defaultValues: {
      action: "",
      reason: "",
    },
  });

  if (dataset.isLoading)
    return (
      <Layout>
        <div className="my-3">
          <Skeleton height="50vh" />
        </div>
      </Layout>
    );

  return (
    <Layout>
      <Toast ref={toast} />
      <Dialog
        visible={showEventDetails}
        onHide={() => {
          setShowEventDetails(false);
        }}
        header="Confirm Class Attendance"
        className="w-full md:w-fit"
      >
        {selectedEvent && (
          <div>
            <div>{selectedEvent.title}</div>
            <div>
              <DTFormat value={selectedEvent.start} />
            </div>
            <div className="mt-2">
              <div>🌏 Online</div>
              <DataScroller
                rows={5}
                value={selectedEvent.extendedProps.online.booked}
                itemTemplate={itemTemplate}
                emptyMessage="No online participant"
                inline
                scrollHeight="140px"
              />

              <div>🏠 Offline</div>
              <DataScroller
                rows={5}
                value={selectedEvent.extendedProps.offline.booked}
                itemTemplate={itemTemplate}
                emptyMessage="No offline participant"
                inline
                scrollHeight="140px"
              />
            </div>

            <div>
              {selectedEvent.extendedProps.status.isRunning === true && (
                <div className="text-center text-xl">✅ Class Confirmed ✅</div>
              )}
              {selectedEvent.extendedProps.status.isRunning === false && (
                <div className="text-center text-xl">❌ Class Cancelled ❌</div>
              )}
            </div>

            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                <UpdateClassStatus
                  classStatus={selectedEvent.extendedProps.status.isRunning}
                  isAdmin={session.user.role.isAdmin}
                  isLoading={updateAttendance.isLoading}
                  methods={methods}
                />
              </form>
            </FormProvider>
          </div>
        )}
      </Dialog>
      <Dialog
        visible={showDialogLegend}
        onHide={() => setShowDialogLegend(false)}
        modal={false}
        closable={false}
        draggable={false}
        position="right"
        headerClassName="m-0 p-3"
      >
        <ClassColorAndIcon />
      </Dialog>
      <Card
        className="mx-auto mt-3 bg-white/30 relative"
        subTitle={cardSubTitle}
      >
        {dataset.isFetching && (
          <div className="text-sm italic text-white/90 text-center">
            <div className="mb-1">Fetching data...</div>
            <div className="mb-2">
              <ProgressBar mode="indeterminate" />
            </div>
          </div>
        )}
        <FullCalendar
          weekNumbers={true}
          ref={calendarRef}
          eventSources={events}
          eventClick={eventClick}
          plugins={[
            interactionPlugin,
            timeGridPlugin,
            listPlugin,
            dayGridPlugin,
          ]}
          initialView={selectedView}
          initialDate={new Date()}
          fixedWeekCount={false}
          headerToolbar={{
            center: "",
            start: "title",
            end: "",
          }}
          firstDay={1}
          weekNumberClassNames="text-xs p-0 italic"
          contentHeight={
            window.screen.width < 425 ? "auto" : window.screen.availHeight * 0.6
          }
        />
      </Card>
    </Layout>
  );
};

InstructorAttendance.auth = {
  role: "instructor",
  loading: <LoadingSkeleton />,
  unauthorized: "/auth/unauthorized",
};

export default InstructorAttendance;
