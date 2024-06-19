import useCalendarReducer, {
  CUSTOMIZE,
  stateInterface,
  staticOptions,
  WEEKLY,
} from "@/hooks/useCalendarReducer";
import { DateTime } from "luxon";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Checkbox } from "primereact/checkbox";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { ProgressBar } from "primereact/progressbar";
import { TabPanel, TabView } from "primereact/tabview";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { RRule } from "rrule";
import {
  AddRegularClass,
  AddSpecialEvent,
  ClassTemplate,
  EditFollowingRegularClass,
  EditFollowingSpecialEvent,
  EditRecurrenceRegularClass,
  EditRecurrenceSpecialEvent,
  EditSingleRegularClass,
  EditSingleSpecialEvent,
  RegularClass,
  RegularClassFormQuery,
  SpecialEvent,
} from "src/api";
import {
  RegularClass as RegularClassType,
  RegularClassTemplate,
  SpecialEvent as SpecialEventType,
  User,
} from "src/generated/graphql";
import { SaveButton } from "../../UI/Buttons";
import EventBookingTimeLimit from "../Event/EventBookingTimeLimit";
import EventCancelTimeLimit from "../Event/EventCancelTimeLimit";
import EventCapacity from "../Event/EventCapacity";
import EventCost from "../Event/EventCost";
import EventDescription from "../Event/EventDescription";
import EventInstructors from "../Event/EventInstructors";
import EventLevel from "../Event/EventLevel";
import EventStatus from "../Event/EventStatus";
import EventTags from "../Event/EventTags";
import EventTitle from "../Event/EventTitle";
import SpecialEventInstructors from "../Event/SpecialEventInstructors";
import { CheckBoxForm } from "../InputForm";
import ApplyChangesTo from "./ApplyChangesTo";
import CustomRecurringForm from "./CustomRecurringForm";
import RecurringEnds from "./RecurringEnds";
import LoadingData from "@/components/LoadingData";

const earlyToday = DateTime.now().startOf("day").toJSDate();

const CalendarEventForm = (props) => {
  const { event, date, eventMode } = props;

  const _id = event?.extendedProps?._id;
  const __typename = event?.extendedProps?.__typename;

  let keyword: string;
  if (__typename === "RegularClass") keyword = "regularClass";
  if (__typename === "SpecialEvent") keyword = "specialEvent";

  // Default values
  const initialState: stateInterface = {
    schedule: {
      date: date ?? event?.start,
      duration: 0,
      isAllDay: false,
      rString: "",
    },
    rule: {
      dtstart: date,
      endsRecurring: "until",
      until: DateTime.fromJSDate(date).endOf("month").toJSDate(),
      count: 1,
      rvalues: WEEKLY.value,
      options: [...staticOptions, CUSTOMIZE],
    },
    time: {
      startTime: earlyToday,
      endTime: earlyToday,
    },
    custom: {
      isEnabled: false,
    },
    showOptionAllOcurrence: true,
    selectionMode: "single",
    firstRDate: null,
  };

  // TODO: apply TS
  let defaultValues = {
    _id,
    details: {
      title: "",
      description: "",
      level: null,
      tags: [],
    },
    instructors: [],
    schedule: {
      date,
      isAllDay: false,
      duration: 0,
      rString: null,
    },
    online: {
      capacity: 0,
      bookingTimeLimit: 0,
      cancelTimeLimit: 0,
      cost: 0,
    },
    offline: {
      capacity: 0,
      bookingTimeLimit: 0,
      cancelTimeLimit: 0,
      cost: 0,
    },
    status: {
      isPublished: true,
      isVIPOnly: false,
    },

    createZoomMeeting: true,
  };

  const validateRecurringOptions = (value) => {
    if (value.freq === -1 && value.interval === -1) setShowCustomDialog(true);
    else dispatch({ type: "rvalues", val: value });
  };

  const [selectedTemplate, setSelectedTemplate] = useState();
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const [showOccurenceDialog, setShowOccurenceDialog] = useState(false);
  const [triggerReset, setTriggerReset] = useState(false);
  const [activeIndex, setActiveIndex] = useState(1);

  const [state, dispatch] = useCalendarReducer(initialState);
  const methods = useForm({ defaultValues: defaultValues });

  /**
   * Queries
   */
  const templateData = useQuery(
    ["classTemplate", selectedTemplate],
    () => ClassTemplate({ _id: selectedTemplate }),
    {
      enabled: !!selectedTemplate,
    }
  );

  const eventData = useQuery(
    ["selectedClass", _id],
    // @ts-ignore
    () => {
      if (__typename === "RegularClass") return RegularClass({ _id });
      if (__typename === "SpecialEvent") return SpecialEvent({ _id });
    },
    {
      enabled: !!_id,
    }
  );

  /**
   * Mutations
   */
  const addRegularClass = useMutation(AddRegularClass);
  const addSpecialEvent = useMutation(AddSpecialEvent);

  const editSingleRegularClass = useMutation(EditSingleRegularClass);
  const editFollowingRegularClass = useMutation(EditFollowingRegularClass);
  const editRecurrenceRegularClass = useMutation(EditRecurrenceRegularClass);

  const editSingleSpecialEvent = useMutation(EditSingleSpecialEvent);
  const editFollowingSpecialEvent = useMutation(EditFollowingSpecialEvent);
  const editRecurrenceSpecialEvent = useMutation(EditRecurrenceSpecialEvent);

  const dataset = useQuery(["regularClassForm"], () => RegularClassFormQuery());
  const queryClient = useQueryClient();

  const loadData = (
    event: RegularClassTemplate | RegularClassType | SpecialEventType
  ) => {
    /**
     * Loads all in common data ini RegularClassTemplate, RegularClass, and SpecialEvent
     */
    methods.setValue("details.title", event.details.title);
    methods.setValue("details.description", event.details.description);
    methods.setValue("details.tags", event.details.tags);

    methods.setValue("online.bookingTimeLimit", event.online.bookingTimeLimit);
    methods.setValue("online.capacity", event.online.capacity);
    methods.setValue("online.cost", event.online.cost);

    methods.setValue(
      "offline.bookingTimeLimit",
      event.offline.bookingTimeLimit
    );
    methods.setValue("offline.capacity", event.offline.capacity);
    methods.setValue("offline.cost", event.offline.cost);

    /**
     * Loads data only exist in RegularClassTemplate, and RegularClass
     */
    if (
      event.__typename === "RegularClassTemplate" ||
      event.__typename === "RegularClass"
    ) {
      methods.setValue("details.level", event.details?.level?._id);
      methods.setValue(
        "instructors",
        event.instructors.map((instructor: User) => instructor._id)
      );

      methods.setValue(
        "offline.cancelTimeLimit",
        event.offline.cancelTimeLimit
      );
      methods.setValue("online.cancelTimeLimit", event.online.cancelTimeLimit);
    }

    if (event.__typename === "SpecialEvent")
      methods.setValue(
        "instructors",
        event.instructors.map((instructor) => instructor.name)
      );

    /**
     * Loads data only exist in RegularClass and SpecialEvent
     */
    if (
      event.__typename === "RegularClass" ||
      event.__typename === "SpecialEvent"
    ) {
      methods.setValue("status.isPublished", event.status.isPublished);
      methods.setValue("status.isVIPOnly", event.status.isVIPOnly);
    }
  };

  // Initialize rrule
  useEffect(() => {
    if (!event) {
      dispatch({
        type: "startTime",
        val: DateTime.now().startOf("day").toJSDate(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (templateData.data) {
      loadData(templateData.data.classTemplate as RegularClassTemplate);

      const _data = templateData.data.classTemplate;

      const _startTime = DateTime.fromISO(_data.schedule.startTime).toJSDate();
      const _duration = _data.schedule.duration;

      dispatch({ type: "startTime", val: _startTime });
      dispatch({
        type: "endTime",
        val: DateTime.fromJSDate(_startTime)
          .plus({ minutes: _duration })
          .toJSDate(),
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateData.data]);

  useEffect(() => {
    if (eventData.data) {
      loadData(
        eventData.data[`${keyword}`] as RegularClassType | SpecialEventType
      );

      const _schedule = eventData.data[`${keyword}`].schedule;
      const _rule = RRule.fromString(_schedule.rString);

      const _eventValue = {
        schedule: {
          date: DateTime.fromISO(_schedule.date).toJSDate(),
          duration: _schedule.duration,
          rString: _schedule.rString,
          isAllDay: _schedule.isAllDay,
        },
        rule: {
          dtstart: _rule.options.dtstart,
          rvalues: {
            freq: _rule.options.freq,
            interval: _rule.options.interval,
          },
          until: _rule.options.until,
          count: _rule.options.count,
          endsRecurring: _rule.options.until ? "until" : "count",
        },
        time: {
          startTime: DateTime.fromISO(_schedule.date).toJSDate(),
          endTime: DateTime.fromISO(_schedule.date)
            .plus({ minutes: _schedule.duration })
            .toJSDate(),
        },
        firstRDate: _rule.options.dtstart,
      };

      if (!_eventValue.rule.count) delete _eventValue.rule.count;
      else delete _eventValue.rule.until;

      dispatch({
        type: "event",
        val: _eventValue,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventData.data, triggerReset]);

  const onSubmit = async () => {
    let values = methods.getValues();
    let n: any;

    values.schedule = state.schedule;

    try {
      if (!event) {
        if (eventMode === "regular") {
          n = await addRegularClass.mutateAsync(values);
        }
        if (eventMode === "special") {
          delete values.details.level;
          delete values.offline.cancelTimeLimit;
          delete values.online.cancelTimeLimit;

          n = await addSpecialEvent.mutateAsync(values);
        }
        props.onSubmitSuccess(
          `${n?.addRegularClass || n?.addSpecialEvent} class added`
        );
      } else {
        if (event.extendedProps.__typename === "RegularClass")
          switch (state.selectionMode) {
            case "single":
              n = await editSingleRegularClass.mutateAsync(values);
              break;
            case "following":
              n = await editFollowingRegularClass.mutateAsync({
                input: values,
                originalDate: event.start,
              });
              break;
            case "all":
              n = await editRecurrenceRegularClass.mutateAsync(values);
              break;
            default:
              break;
          }

        if (event.extendedProps.__typename === "SpecialEvent") {
          delete values.details.level;
          delete values.offline.cancelTimeLimit;
          delete values.online.cancelTimeLimit;

          switch (state.selectionMode) {
            case "single":
              n = await editSingleSpecialEvent.mutateAsync(values);
              break;
            case "following":
              n = await editFollowingSpecialEvent.mutateAsync({
                input: values,
                originalDate: event.start,
              });
              break;
            case "all":
              n = await editRecurrenceSpecialEvent.mutateAsync(values);
              break;
            default:
              break;
          }
        }

        props.onSubmitSuccess(
          `${
            n?.editSingleRegularClass ||
            n?.editFollowingRegularClass ||
            n?.editRecurrenceRegularClass ||
            n?.editSingleSpecialEvent ||
            n?.editFollowingSpecialEvent ||
            n?.editRecurrenceSpecialEvent
          } class updated`
        );
        queryClient.invalidateQueries(["selectedClass"]);
        queryClient.invalidateQueries(["SchedulePageData"]);
      }
    } catch (error) {
      error.response.errors.forEach((err) => {
        props.onSubmitError(err);
      });
    }
  };

  /**
   * Component
   */
  const notAllday = (
    <div className="flex justify-between gap-2 mt-2 md:mt-0">
      <div className="w-full p-float-label">
        <Calendar
          name="startTime"
          timeOnly
          stepMinute={5}
          className="w-full"
          value={state.time.startTime}
          onChange={(e) => dispatch({ type: "startTime", val: e.value })}
        />
        <label htmlFor="startTime">Start</label>
      </div>

      <div className="w-full p-float-label">
        <Calendar
          name="endTime"
          timeOnly
          stepMinute={5}
          className="w-full"
          value={state.time.endTime}
          onChange={(e) => dispatch({ type: "endTime", val: e.value })}
        />
        <label htmlFor="endTime">End</label>
      </div>
    </div>
  );

  const repeat = (
    <div className="my-4 flex justify-between">
      <h4>Repeat</h4>
      <Dropdown
        options={state.rule.options}
        value={state.rule.rvalues}
        optionLabel="label"
        optionValue="value"
        onChange={(e) => validateRecurringOptions(e.value)}
        disabled={event ? true : false}
      />
    </div>
  );

  return (
    <div>
      <Dialog
        visible={showCustomDialog}
        onHide={() => setShowCustomDialog(false)}
        className="w-full md:w-5/12"
      >
        <CustomRecurringForm
          dispatch={dispatch}
          rvalues={state.rule.rvalues}
          onHide={() => setShowCustomDialog(false)}
        />
      </Dialog>
      {eventMode === "regular" && (
        <div id="template" className="field">
          <Dropdown
            name="template"
            options={dataset.data?.classTemplates || []}
            optionLabel="details.title"
            optionValue="_id"
            className="w-full"
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.value)}
            placeholder="Pick a template to use"
          />
        </div>
      )}
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          {eventData.isLoading && <LoadingData />}
          <TabView
            activeIndex={activeIndex}
            onTabChange={(e) => setActiveIndex(e.index)}
          >
            <TabPanel header="Details">
              <div className="mx-auto">
                <div className="my-2">
                  <EventTitle />
                </div>
                <Accordion multiple>
                  <AccordionTab header="Details">
                    <div className="my-2">
                      {eventMode === "regular" && (
                        <EventLevel options={dataset.data?.levels || []} />
                      )}
                    </div>
                    <div className="my-2">
                      <EventDescription />
                    </div>
                    <div className="my-2">
                      {eventMode === "regular" ||
                      event?.extendedProps?.__typename === "RegularClass" ? (
                        <EventInstructors
                          options={dataset.data?.instructors || []}
                        />
                      ) : (
                        <SpecialEventInstructors />
                      )}
                    </div>
                    <div className="my-2">
                      <EventTags />
                    </div>
                  </AccordionTab>
                  <AccordionTab header="Capacity">
                    <div className="md:flex flex-wrap gap-3 justify-around my-2">
                      <EventCapacity />
                    </div>
                  </AccordionTab>
                  <AccordionTab header="Booking Time Limit">
                    <div className="md:flex flex-wrap gap-3 justify-around my-2">
                      <EventBookingTimeLimit />
                    </div>
                  </AccordionTab>
                  {(eventMode === "regular" ||
                    event?.extendedProps?.__typename === "RegularClass") && (
                    <AccordionTab header="Cancel Time Limit">
                      <div className="md:flex flex-wrap gap-3 justify-around my-2">
                        <EventCancelTimeLimit />
                      </div>
                    </AccordionTab>
                  )}
                  <AccordionTab header="Cost">
                    <div className="md:flex flex-wrap gap-3 justify-around my-2">
                      {(eventMode === "regular" ||
                        event?.extendedProps?.__typename ===
                          "RegularClass") && (
                        <EventCost min={0} mode="decimal" suffix=" points" />
                      )}
                      {(eventMode === "special" ||
                        event?.extendedProps?.__typename ===
                          "SpecialEvent") && (
                        <EventCost
                          min={0}
                          mode="currency"
                          currency="IDR"
                          step={10000}
                          minFractionDigits={0}
                        />
                      )}
                    </div>
                  </AccordionTab>
                </Accordion>
                <div className="text-xl my-3">Class Status</div>
                <EventStatus />
              </div>
            </TabPanel>
            <TabPanel header="Schedule">
              <div className="col-12 md:col-9 mx-auto">
                <div className="my-4">
                  <Checkbox
                    onChange={(e) => {
                      dispatch({ type: "isAllDay", val: e.checked });
                    }}
                    checked={state.schedule.isAllDay}
                    inputId="allDayCB"
                    className="mr-2"
                  />
                  <label htmlFor="allDayCB" className="p-checkbox-label">
                    All day event
                  </label>
                </div>
                <div className="">
                  <div className="md:flex gap-2 justify-start">
                    <div className="w-full grow">
                      <span className="p-float-label">
                        <Calendar
                          name="schedule.date"
                          value={state.schedule.date}
                          onChange={(e) => {
                            dispatch({ type: "dtstart", val: e.value });
                            // For UX purpose
                            dispatch({
                              type: "until",
                              val: DateTime.fromJSDate(e.value as Date)
                                .endOf("month")
                                .toJSDate(),
                            });
                          }}
                          dateFormat="D, dd M yy"
                          className="w-full"
                        />
                        <label htmlFor="schedule.date">Date</label>
                      </span>
                    </div>
                    {!state.schedule.isAllDay && notAllday}
                  </div>
                  <div className="">
                    <>
                      {repeat}
                      {state.rule.rvalues.freq > -1 && (
                        <RecurringEnds
                          dispatch={dispatch}
                          endsRecurring={state.rule.endsRecurring}
                          until={state.rule.until}
                          count={state.rule.count}
                          disabled={event ? true : false}
                        />
                      )}
                    </>
                  </div>
                </div>
              </div>
            </TabPanel>
          </TabView>
          <div className="flex justify-between my-6">
            {!event && (
              <div className="text-left my-auto ml-3">
                {/* @ts-ignore */}
                <CheckBoxForm
                  label="create Zoom meeting"
                  name="createZoomMeeting"
                />
              </div>
            )}
            <div className="grow text-right">
              {event && (
                <Button
                  type="button"
                  label="Undo Changes"
                  icon="pi pi-replay"
                  className="p-button-text mr-2"
                  onClick={() => {
                    setTriggerReset(!triggerReset);
                  }}
                />
              )}
              {!event ? (
                <Button
                  loading={
                    addRegularClass.isLoading ||
                    addSpecialEvent.isLoading ||
                    editSingleRegularClass.isLoading ||
                    editFollowingRegularClass.isLoading ||
                    editRecurrenceRegularClass.isLoading
                  }
                  icon="pi pi-save"
                  label="Save"
                  onSubmit={onSubmit}
                />
              ) : (
                <>
                  <Button
                    type="button"
                    className="p-button-outlined"
                    icon="pi pi-forward"
                    loading={eventData.isLoading}
                    onClick={() => setShowOccurenceDialog(true)}
                  />
                  <Dialog
                    visible={showOccurenceDialog}
                    onHide={() => setShowOccurenceDialog(false)}
                    header="Save changes"
                  >
                    <div className="w-full my-0">
                      {event && (
                        <ApplyChangesTo
                          showOptionAllOcurrence={state.showOptionAllOcurrence}
                          selectionMode={state.selectionMode}
                          dispatch={dispatch}
                          firstRDate={state.firstRDate}
                          selectedDate={state.schedule.date}
                        />
                      )}
                    </div>
                    <div className="text-right">
                      <SaveButton
                        loading={
                          addRegularClass.isLoading ||
                          editSingleRegularClass.isLoading ||
                          editFollowingRegularClass.isLoading ||
                          editRecurrenceRegularClass.isLoading ||
                          addSpecialEvent.isLoading ||
                          editSingleSpecialEvent.isLoading ||
                          editFollowingSpecialEvent.isLoading ||
                          editRecurrenceSpecialEvent.isLoading
                        }
                        onClick={onSubmit}
                      />
                    </div>
                  </Dialog>
                </>
              )}
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default CalendarEventForm;
