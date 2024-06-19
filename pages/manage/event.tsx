import Layout from "@/components/Layout/Layout";
import SpecialEventBookingData from "@/components/SpecialEventBookingData";
import {
  filterElementCheckbox,
  filterElementDate,
} from "@/components/Template";
import DTFormat from "@/components/UI/DTFormat";
import LoadingSkeleton from "@/components/UI/LoadingSkeleton";
import Instructors from "@/components/User/Instructors";
import useExportPDF from "@/hooks/useExportPDF";
import useSearchAndFilter from "@/hooks/useSearchAndFilter";
import { DateTime } from "luxon";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { Sidebar } from "primereact/sidebar";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  DeleteSpecialEventStatus,
  SpecialEvents,
  UpdateSpecialEventStatus,
} from "src/api";
import { SpecialEvent } from "src/generated/graphql";

const EventPage = () => {
  /**
   * Hooks
   */
  const [selectedRow, setSelectedRow] = useState<SpecialEvent>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [classIsRunning, setClassIsRunning] = useState<boolean>(null);
  const dt = useRef(null);
  const toast = useRef<Toast>(null);

  /**
   * DataView
   */

  const globalFilterFields = ["details.title"];

  const instructorsOptions: Array<{ name: string }> = [];

  const columns = [
    {
      field: "details.title",
      header: "Name",
      preselected: true,
      sortable: true,
      body: (rowData: SpecialEvent) => {
        return (
          <div className="">
            <div className="mb-2">{rowData.details.title}</div>
            <div>
              <Instructors value={rowData.instructors} />
            </div>
            <div className="flex flex-wrap gap-3 text-sm my-2 text-gray-500">
              <div className="">Availability</div>
              <div className="flex flex-wrap gap-1">
                <div>{`Online: ${rowData.online.availability}/${rowData.online.capacity}`}</div>
                <div>{`Offline: ${rowData.offline.availability}/${rowData.offline.capacity}`}</div>
              </div>
            </div>
          </div>
        );
      },
    },
    // https://github.com/aurickf/kalyana-membership/issues/63
    // {
    //   field: "instructors",
    //   header: "Instructors",
    //   filter: true,
    //   showFilterMatchModes: false,
    //   filterElement: (options) => {
    //     console.log(instructorsOptions, options);
    //     return (
    //       <Dropdown
    //         // options={instructorsOptions}
    //         options={[{ name: "Sebastian" }]}
    //         value={options.value}
    //         optionLabel="name"
    //         onChange={(e) => options.filterCallback(e.value)}
    //       />
    //     );
    //   },
    //   preselected: true,
    //   body: (rowData: SpecialEvent) => {
    //     console.log(rowData.instructors);
    //     return <Instructors value={rowData.instructors} />;
    //   },
    // },
    {
      field: "schedule.date",
      header: "Schedule",
      preselected: true,
      sortable: true,
      dataType: "date",
      filter: true,
      filterElement: filterElementDate,
      body: (rowData: SpecialEvent) => {
        return (
          <div className="">
            <DTFormat
              value={rowData.schedule.date}
              duration={rowData.schedule.duration}
            />
            <div className="text-xs my-2 text-gray-500">
              <div className="">Booking Time Limit</div>
              <div className="my-2">
                <div>Online</div>
                <div>{`${DateTime.fromJSDate(rowData.schedule.date)
                  .minus({ hour: rowData.online.bookingTimeLimit })
                  .toFormat("dd LLL yyyy HH:mm")}`}</div>
              </div>
              <div className="my-2">
                <div>Offline</div>
                <div>{`${DateTime.fromJSDate(rowData.schedule.date)
                  .minus({ hour: rowData.offline.bookingTimeLimit })
                  .toFormat("dd LLL yyyy HH:mm")}`}</div>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      field: "status.isRunning",
      header: "Class Status",
      preselected: true,
      filter: true,
      filterElement: filterElementCheckbox,
      showFilterMatchModes: false,
      body: (rowData) => {
        if (rowData.status.isRunning === null)
          return <Tag severity="info">Scheduled to Run</Tag>;
        if (rowData.status.isRunning)
          return <Tag severity="success">Running</Tag>;
        return <Tag severity="warning">Not Running</Tag>;
      },
    },
    {
      header: "Registration",
      preselected: true,
      body: (rowData: SpecialEvent) => {
        return (
          <div className="text-gray-700 text-sm">
            <div className="flex flex-wrap gap-4 ">
              <div className="bg-gray-100 p-2 rounded-sm shadow-1">
                <div>Online</div>
                <div className="flex flex-wrap column-gap-1 justify-between my-2">
                  <div>Pending</div>
                  <div>
                    {` ${rowData.online.bookedSeat} in ${rowData.online.booked?.length} request`}
                  </div>
                </div>
                <div className="flex flex-wrap column-gap-1 justify-between my-2">
                  <div>Rejected</div>
                  <div>
                    {`${rowData.online.rejectedSeat} in ${rowData.online.rejected?.length} request`}
                  </div>
                </div>
                <div className="flex flex-wrap column-gap-1 justify-between my-2">
                  <div>Confirmed </div>
                  <div>
                    {`${rowData.online.confirmedSeat} in ${rowData.online.confirmed?.length} request`}
                  </div>
                </div>
              </div>
              <div className="bg-gray-100 p-2 rounded-sm shadow-1">
                <div>Offline</div>
                <div className="flex flex-wrap column-gap-1 justify-between my-2">
                  <div>Pending</div>
                  <div>
                    {` ${rowData.offline.bookedSeat} in ${rowData.offline.booked?.length} request`}
                  </div>
                </div>
                <div className="flex flex-wrap column-gap-1 justify-between my-2">
                  <div>Rejected</div>
                  <div>
                    {`${rowData.offline.rejectedSeat} in ${rowData.offline.rejected?.length} request`}
                  </div>
                </div>
                <div className="flex flex-wrap column-gap-1 justify-between my-2">
                  <div>Confirmed </div>
                  <div>
                    {`${rowData.offline.confirmedSeat} in ${rowData.offline.confirmed?.length} request`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      },
    },
  ];

  /**
   * Query
   */
  const dataset = useQuery(["SpecialEvents"], () => SpecialEvents(), {
    onSuccess(data) {
      return data.specialEvents.map((event) => {
        event.schedule.date = DateTime.fromISO(event.schedule.date).toJSDate();
        event.instructors.map((instructor) =>
          instructorsOptions.push({ name: instructor.name })
        );
      });
    },
  });

  const queryClient = useQueryClient();

  /**
   * Mutation
   */
  const updateSpecialEventStatus = useMutation(UpdateSpecialEventStatus);
  const deleteSpecialEventStatus = useMutation(DeleteSpecialEventStatus);

  /**
   * Custom hooks
   */
  const { downloadPDF } = useExportPDF();

  const { filters, searchAndFilter, columnComponents } = useSearchAndFilter({
    columns,
    initialFilterValue: {
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      instructors: {
        value: null,
        matchMode: FilterMatchMode.IN,
      },
      "status.isRunning": { value: null, matchMode: FilterMatchMode.EQUALS },
      "schedule.date": {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
      },
    },
  });

  /**
   * Utils
   */
  const onRowSelect = (e) => {
    setSelectedRow(e.data);
    setClassIsRunning(e.data.status.isRunning);
    setShowDialog(true);
  };

  const onHide = () => {
    setShowDialog(false);
    setSelectedRow(null);
  };

  const downloadCSV = () => {
    dt.current.exportCSV();
  };

  const onError = (error) => {
    toast.current.show({
      severity: "error",
      summary: "Failed",
      detail: `${error.message}`,
    });
  };

  const onStatusDelete = async () => {
    try {
      setClassIsRunning(null);
      await deleteSpecialEventStatus.mutateAsync({
        _id: selectedRow._id,
      });
      queryClient.invalidateQueries(["SpecialEvents"]);
      toast.current.show({
        severity: "success",
        summary: "Done",
        detail: "Class status updated",
      });
    } catch (error) {
      error.response.errors.forEach((err) => onError(err));
    }
  };

  const onStatusUpdate = async (classStatus) => {
    try {
      await updateSpecialEventStatus.mutateAsync({
        _id: selectedRow._id,
        isRunning: classStatus,
      });
      queryClient.invalidateQueries(["SpecialEvents"]);
      toast.current.show({
        severity: "success",
        summary: "Done",
        detail: "Class status updated",
      });
    } catch (error) {
      error.response.errors.forEach((err) => onError(err));
    }
  };

  return (
    <Layout>
      <Toast ref={toast} />
      <Toolbar
        className="bg-white/50 my-2"
        right={
          <div className="flex gap-2">
            <Button
              label="PDF"
              className="p-button-sm"
              onClick={() => {
                downloadPDF({ prefix: "event" });
              }}
            />
            <Button label="CSV" className="p-button-sm" onClick={downloadCSV} />
          </div>
        }
      />
      <Card>
        {searchAndFilter("Search special class title")}
        <DataTable
          id="dataTable"
          ref={dt}
          value={dataset.data?.specialEvents}
          loading={dataset.isLoading}
          selectionMode="single"
          onRowSelect={onRowSelect}
          responsiveLayout="scroll"
          filters={filters}
          filterDisplay="menu"
          globalFilterFields={globalFilterFields}
          emptyMessage="No special class found"
          sortField="schedule.date"
          sortOrder={-1}
          paginator
          paginatorLeft={`Total : ${dataset.data?.specialEvents?.length} special classes`}
          paginatorRight={true}
          rows={10}
          rowsPerPageOptions={[10, 25, 50, 100]}
          // @ts-ignore
          cellClassName="vertical-align-top"
        >
          {columnComponents}
        </DataTable>
      </Card>
      <Sidebar
        visible={showDialog}
        onHide={onHide}
        className="w-full"
        fullScreen
        blockScroll
      >
        {selectedRow && (
          <div className="shadow-1">
            <div className="flex flex-wrap justify-between bg-gray-200 p-2 rounded-top-sm">
              <div>
                <div className="text-lg my-1">Special Class Booking Data</div>
                <div>{selectedRow.details.title}</div>
                <div>
                  <DTFormat
                    value={selectedRow.schedule.date}
                    duration={selectedRow.schedule.duration}
                  />
                </div>
                <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                  <div>{`Online  : ${selectedRow.online.availability}/${selectedRow.online.capacity}`}</div>
                  <div>{`Offline : ${selectedRow.offline.availability}/${selectedRow.offline.capacity}`}</div>
                </div>
              </div>
              <div className="text-right ml-auto">
                <div className="flex flex-wrap gap-2 pt-3 my-auto">
                  <div className="my-auto">Class status</div>
                  <Dropdown
                    value={classIsRunning}
                    onChange={(e) => {
                      setClassIsRunning(e.value);
                      onStatusUpdate(e.value);
                    }}
                    options={[
                      {
                        label: "Running",
                        value: true,
                      },
                      {
                        label: "Not Running",
                        value: false,
                      },
                    ]}
                    dropdownIcon={
                      !updateSpecialEventStatus.isLoading
                        ? "pi pi-chevron-down"
                        : "pi pi-spinner pi-spin"
                    }
                    disabled={updateSpecialEventStatus.isLoading}
                    placeholder="Select class status"
                  />
                </div>
                {selectedRow.status.isRunning !== null && (
                  <div className="text-right">
                    <Button
                      className="p-button-text text-xs"
                      label="Reset"
                      loading={deleteSpecialEventStatus.isLoading}
                      onClick={onStatusDelete}
                    />
                  </div>
                )}
              </div>
            </div>
            <div>
              <SpecialEventBookingData eventId={selectedRow._id} />
            </div>
          </div>
        )}
      </Sidebar>
    </Layout>
  );
};

EventPage.auth = {
  role: "admin",
  loading: <LoadingSkeleton />,
  unauthorized: "/auth/unauthorized",
};

export default EventPage;
