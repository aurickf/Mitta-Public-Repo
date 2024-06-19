import FullCalendar from "@fullcalendar/react"; // must go before plugins

import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";

import ApplyChangesTo from "@/components/Form/Calendar/ApplyChangesTo";
import { Messages } from "primereact/messages";

import CalendarEventForm from "@/components/Form/Calendar/CalendarEventForm";
import EventDetails from "@/components/Form/Event/EventDetails";
import Layout from "@/components/Layout/Layout";
import ClassColorAndIcon from "@/components/RegularClass/ClassColorAndIcon";
import { DeleteButton } from "@/components/UI/Buttons";
import LoadingSkeleton from "@/components/UI/LoadingSkeleton";
import useCalendarReducer from "@/hooks/useCalendarReducer";
import useEvent from "@/hooks/useEvent";
import { DateTime } from "luxon";
import { Types } from "mongoose";
import { useSession } from "next-auth/react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { ProgressBar } from "primereact/progressbar";
import { Toast } from "primereact/toast";
import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  DeleteFollowingRegularClass,
  DeleteFollowingSpecialEvent,
  DeleteRecurrenceRegularClass,
  DeleteRecurrenceSpecialEvent,
  DeleteSingleRegularClass,
  DeleteSingleSpecialEvent,
  SchedulePageData,
} from "src/api";

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

const initialState = {
  selectionMode: "single",
};

const SchedulePage = () => {
  /**
   * Hooks
   */

  const { data: session } = useSession();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedView, setSelectedView] = useState("dayGridMonth");

  const [showCalendarEventForm, setShowCalendarEventForm] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showDialogLegend, setShowDialogLegend] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [eventMode, setEventMode] = useState<"regular" | "special" | "">("");
  const [viewedDate, setViewedDate] = useState(DateTime.now().toJSDate());

  const calendarRef = useRef<FullCalendar>(null);
  const messages = useRef<Messages>(null);
  const toast = useRef<Toast>(null);

  /**
   * Queries
   */
  const dataset = useQuery(
    ["SchedulePageData", viewedDate],
    () =>
      SchedulePageData({
        viewedDate,
      }),
    {
      keepPreviousData: true,
      staleTime: 60 * 1000,
    }
  );

  const queryClient = useQueryClient();

  const deleteSingleRegularClass = useMutation(DeleteSingleRegularClass);
  const deleteFollowingRegularClass = useMutation(DeleteFollowingRegularClass);
  const deleteRecurrenceRegularClass = useMutation(
    DeleteRecurrenceRegularClass
  );
  const deleteSingleSpecialEvent = useMutation(DeleteSingleSpecialEvent);
  const deleteRecurrenceSpecialEvent = useMutation(
    DeleteRecurrenceSpecialEvent
  );
  const deleteFollowingSpecialEvent = useMutation(DeleteFollowingSpecialEvent);

  /**
   * Custom hooks
   */
  const { runningClass, cancelledClass, pendingClass } = useEvent(
    dataset,
    "regularClassesPerMonth"
  );

  const {
    runningClass: runningEvent,
    cancelledClass: cancelledEvent,
    pendingClass: pendingEvent,
  } = useEvent(dataset, "specialEventsPerMonth");

  const [state, dispatch] = useCalendarReducer(initialState);

  /**
   * Utils
   */
  const holiday = dataset.data?.activeHolidays.map((holiday) => {
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

  const eventMouseEnter = (eventInfo) => {
    messages?.current?.clear();
    setTimeout(() => {
      setShowPopup(true);
      messages.current?.show({
        severity: "info",
        closable: true,
        detail: `${DateTime.fromJSDate(eventInfo.event.start).toFormat(
          "dd LLL - HH:mm"
        )} ${eventInfo.event.title}`,
        life: 5000,
      });
    }, 200);
  };

  const setSelectionNull = () => {
    setShowCalendarEventForm(false);
    setShowEventDetails(false);
    setShowDeleteDialog(false);
    setSelectedDate(null);
    setSelectedEvent(null);
    setEventMode("");
  };

  const notifySuccess = (message) => {
    queryClient.invalidateQueries(["SchedulePageData"]);

    toast.current.show({
      severity: "success",
      summary: "Done",
      detail: message,
    });
  };

  const notifyError = (error) => {
    toast.current.show({
      severity: "error",
      summary: "Failed",
      detail: `${error.message}`,
    });
  };

  const onZoomUpdate = () => {
    notifySuccess("Zoom meeting created");
    setSelectionNull();
  };

  const onSubmitSuccess = async (message) => {
    notifySuccess(message);
    setSelectionNull();
  };

  const onSubmitError = async (error) => {
    notifyError(error);
  };

  const editHandler = () => {
    setShowEventDetails(false);
    setShowCalendarEventForm(true);
  };

  const deleteHandler = async (updatedBy: Types.ObjectId) => {
    let n: any;

    try {
      if (selectedEvent.extendedProps.__typename === "RegularClass")
        switch (state.selectionMode) {
          case "single":
            n = await deleteSingleRegularClass.mutateAsync({
              _id: selectedEvent.extendedProps._id,
              updatedBy,
            });
            break;
          case "following":
            n = await deleteFollowingRegularClass.mutateAsync({
              _id: selectedEvent.extendedProps._id,
              updatedBy,
              date: selectedEvent.start,
            });
            break;
          case "all":
            n = await deleteRecurrenceRegularClass.mutateAsync({
              _id: selectedEvent.extendedProps._id,
              updatedBy,
            });
            break;

          default:
            break;
        }

      if (selectedEvent.extendedProps.__typename === "SpecialEvent")
        switch (state.selectionMode) {
          case "single":
            n = await deleteSingleSpecialEvent.mutateAsync({
              _id: selectedEvent.extendedProps._id,
              updatedBy,
            });
            break;
          case "following":
            n = await deleteFollowingSpecialEvent.mutateAsync({
              _id: selectedEvent.extendedProps._id,
              date: selectedEvent.start,
              updatedBy,
            });
            break;
          case "all":
            n = await deleteRecurrenceSpecialEvent.mutateAsync({
              _id: selectedEvent.extendedProps._id,
              updatedBy,
            });
            break;

          default:
            break;
        }

      notifySuccess(
        `${
          n?.deleteSingleRegularClass ||
          n?.deleteFollowingRegularClass ||
          n?.deleteRecurrenceRegularClass ||
          n?.deleteSingleSpecialEvent ||
          n?.deleteFollowingSpecialEvent ||
          n?.deleteRecurrenceSpecialEvent
        } class deleted`
      );
    } catch (error) {
      error.response.errors.forEach((err) => notifyError(err));
    }

    setSelectionNull();
  };

  /**
   * Renders
   */
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

  const headerButtons = (
    <div className="flex justify-between">
      <div className="flex  my-auto">
        <div className="my-auto">Event Details</div>
        <Button
          className="p-button-rounded p-button-text p-button-sm"
          icon="pi pi-share-alt"
          aria-label="Share this class"
          tooltip="Share this class"
          onClick={() => {
            window.open(
              `/${
                selectedEvent.extendedProps.zoom.simpleTitle
              }/${DateTime.fromJSDate(selectedEvent.start).toISODate()}`
            );
          }}
        />
      </div>
      <div className="text-right">
        <Button
          className="p-button-rounded p-button-text p-button-sm p-button-warning"
          icon="pi pi-pencil"
          tooltip="Edit event"
          onClick={editHandler}
        />
        <Button
          className="p-button-rounded p-button-text p-button-sm p-button-danger"
          icon="pi pi-trash"
          tooltip="Delete event"
          onClick={() => setShowDeleteDialog(true)}
        />
      </div>
    </div>
  );

  const dateClick = (eventInfo) => {
    setSelectedEvent(null);
    setSelectedDate(eventInfo.date);
    setShowCalendarEventForm(true);
  };

  const eventClick = (eventInfo) => {
    if (eventInfo.event.extendedProps.clickable) {
      setSelectedEvent(eventInfo.event);
      setSelectedDate(null);
      setShowEventDetails(true);
    }
  };

  return (
    <Layout>
      <Toast ref={toast} />
      {/* Preview event */}
      <Dialog
        header={headerButtons}
        visible={showEventDetails}
        onHide={() => {
          setSelectionNull();
        }}
        className="w-full md:w-8/12 lg:w-6/12 xl:w-5/12"
      >
        <EventDetails event={selectedEvent} onZoomUpdate={onZoomUpdate} />
      </Dialog>
      {/* Edit Mode */}
      <Dialog
        header={
          selectedEvent
            ? "Edit Event"
            : `Add New ${eventMode.slice(0, 1).toUpperCase()}${eventMode.slice(
                1
              )} Class`
        }
        visible={showCalendarEventForm}
        onHide={() => setSelectionNull()}
        className="w-full md:w-9/12 lg:w-8/12 xl:w-6/12"
        maximizable
      >
        {(eventMode === "regular" ||
          eventMode === "special" ||
          selectedEvent?.extendedProps.__typename === "RegularClass" ||
          selectedEvent?.extendedProps.__typename === "SpecialEvent") && (
          <CalendarEventForm
            eventMode={eventMode}
            date={selectedDate}
            event={selectedEvent}
            onHide={() => setSelectionNull()}
            onSubmitSuccess={onSubmitSuccess}
            onSubmitError={onSubmitError}
          />
        )}
        {!eventMode && !selectedEvent && (
          <div className="md:flex flex-container gap-2 justify-around">
            <div className="my-4">
              <Button
                className="w-full"
                label="Special class"
                onClick={() => setEventMode("special")}
              />
            </div>
            <div className="my-4">
              <Button
                className="w-full"
                label="Regular class"
                onClick={() => setEventMode("regular")}
              />
            </div>
          </div>
        )}
      </Dialog>
      {/* Delete Mode */}
      <Dialog
        visible={showDeleteDialog}
        onHide={() => setSelectionNull()}
        header="Delete Event"
      >
        <ApplyChangesTo
          showOptionAllOcurrence={state.showOptionAllOcurrence}
          selectionMode={state.selectionMode}
          dispatch={dispatch}
        />
        <DeleteButton
          onClick={() => deleteHandler(session.user._id)}
          loading={
            deleteSingleRegularClass.isLoading ||
            deleteFollowingRegularClass.isLoading ||
            deleteRecurrenceRegularClass.isLoading ||
            deleteSingleSpecialEvent.isLoading ||
            deleteFollowingSpecialEvent.isLoading ||
            deleteRecurrenceSpecialEvent.isLoading
          }
        />
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
        className="mx-auto mt-2 bg-white/30 relative"
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
          plugins={[
            interactionPlugin,
            timeGridPlugin,
            listPlugin,
            dayGridPlugin,
          ]}
          initialView={selectedView}
          initialDate={new Date()}
          nowIndicator={true}
          allDaySlot={true}
          eventSources={[
            runningClass,
            cancelledClass,
            pendingClass,
            runningEvent,
            cancelledEvent,
            pendingEvent,
            holiday,
          ]}
          dateClick={dateClick}
          eventClick={eventClick}
          eventMouseEnter={eventMouseEnter}
          fixedWeekCount={false}
          headerToolbar={{
            center: "",
            start: "title",
            end: "",
          }}
          firstDay={1}
          weekNumberClassNames="text-xs p-0 italic"
          eventClassNames="text-xs md:text-sm"
          contentHeight={
            window.screen.width < 425 ? "auto" : window.screen.availHeight * 0.6
          }
        />
        <Dialog
          position="top"
          showHeader={false}
          modal={false}
          visible={showPopup}
          onHide={() => setShowPopup(false)}
          onShow={() => setTimeout(() => setShowPopup(false), 5000)}
        >
          <div className="my-auto">
            <Messages ref={messages} />
          </div>
        </Dialog>
      </Card>
    </Layout>
  );
};

SchedulePage.auth = {
  role: "admin",
  loading: <LoadingSkeleton />,
  unauthorized: "/auth/unauthorized",
};

export default SchedulePage;
