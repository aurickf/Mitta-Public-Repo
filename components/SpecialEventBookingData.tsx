import useExportPDF from "@/hooks/useExportPDF";
import useSearchAndFilter from "@/hooks/useSearchAndFilter";
import { CustomColumn } from "@/interface/CustomColumn";
import { Types } from "mongoose";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Image } from "primereact/image";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useQuery, useQueryClient } from "react-query";
import { SelectedEventBookingCards } from "src/api";
import { EventBookingCard } from "src/generated/graphql";
import SpecialEventBookingCard from "./SpecialEventBookingCard";
import { filterElementDate, filterElementDropdown } from "./Template";
import DTFormat from "./UI/DTFormat";

const statusValues = ["Pending", "Confirmed", "Rejected"];
const classTypeValues = ["online", "offline"];
const globalFilterFields = ["user.name", "participants"];

const columns: Array<CustomColumn> = [
  {
    field: "user.name",
    header: "User",
    sortable: true,
    preselected: true,
  },
  {
    field: "participants",
    header: "Participants",
    sortable: true,
    preselected: true,
    body: (rowData) => {
      return (
        <div className="text-sm text-gray-600">
          <ul>
            {rowData.participants.map((name, i) => {
              return (
                <li key={i}>
                  <span className="hidden">[</span>
                  {name}
                  <span className="hidden">]</span>
                  <span className="hidden">
                    <br />
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      );
    },
  },
  {
    field: "bookingCode",
    header: "Booking Code",
    sortable: true,
    preselected: true,
    body: (rowData) => rowData.bookingCode,
  },
  {
    field: "classType",
    header: "Class Type",
    sortable: true,
    preselected: true,
    filter: true,
    filterElement: (options) => filterElementDropdown(options, classTypeValues),
  },
  {
    field: "seat",
    header: "Seat",
    sortable: true,
    preselected: true,
  },
  {
    field: "status.value",
    header: "Status",
    sortable: true,
    preselected: true,
    filter: true,
    filterElement: (options) => filterElementDropdown(options, statusValues),
    body: (rowData) => {
      return (
        <div className="text-center">
          <div>{rowData.status.value}</div>
          <div className="my-1">
            <div className="text-sm italic">
              <DTFormat value={rowData.status.lastUpdateOn} />
            </div>
            <div className="text-xs">
              <div>{rowData.status.reason}</div>
              <div className="text-wisteria-500">
                {rowData.status.updatedBy.name}
              </div>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    field: "payment.date",
    header: "Payment Date",
    sortable: true,
    preselected: true,
    dataType: "date",
    filter: true,
    filterElement: filterElementDate,
    body: (rowData) => {
      return <DTFormat value={rowData.payment.date} dateOnly />;
    },
  },
  {
    field: "payment.method",
    header: "Payment Method",
    sortable: true,
    preselected: true,
    filter: true,
    body: (rowData) => {
      return (
        <div>
          <div className="text-center">
            <div>
              {`${rowData.payment.method} - ${new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
              }).format(rowData.payment.amount)}`}
            </div>
            <Image
              src={rowData.payment.image}
              alt="payment"
              height="100px"
              width="50px"
              preview
              downloadable
            />
          </div>
        </div>
      );
    },
  },
  {
    field: "createdAt",
    header: "Registration Date",
    sortable: true,
    preselected: true,
    body: (rowData) => {
      return <DTFormat value={rowData.createdAt} />;
    },
  },
];

interface SpecialEventBookingDataPropsI {
  eventId: Types.ObjectId;
}

const SpecialEventBookingData = (props: SpecialEventBookingDataPropsI) => {
  const { eventId } = props;
  const [allParticipants, setAllParticipants] = useState<Array<string>>([]);

  /**
   * Hooks
   */

  const [selectedBooking, setSelectedBooking] =
    useState<EventBookingCard>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showAllParticipantsDialog, setShowAllParticipantsDialog] =
    useState(false);
  const toast = useRef<Toast>();
  const dt = useRef(null);

  /**
   * Custom Hooks
   */
  const eventData = useQuery(
    ["SelectedEventBookingCards", eventId],
    () => SelectedEventBookingCards({ _id: eventId }),
    {
      refetchOnMount: true,
    }
  );

  const { filters, searchAndFilter, clearFilter, columnComponents } =
    useSearchAndFilter({
      columns,
      initialFilterValue: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        classType: {
          value: null,
          matchMode: FilterMatchMode.EQUALS,
        },
        "status.value": {
          value: null,
          matchMode: FilterMatchMode.EQUALS,
        },
        "payment.date": {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
        },
      },
    });

  const queryClient = useQueryClient();

  /**
   * Utils
   */

  const generateParticipants = () => {
    eventData.data?.selectedEventBookingCards.forEach((bookingCard) => {
      allParticipants.push(...bookingCard.participants);
    });
    allParticipants.sort();
    setShowAllParticipantsDialog(true);
  };

  const onRowSelect = (e) => {
    setSelectedBooking(e.data);
    setShowDialog(true);
  };

  const onHide = () => {
    setSelectedBooking(null);
    setShowDialog(false);
  };

  const onSuccess = () => {
    toast.current.show({
      severity: "success",
      summary: "Done",
      detail: "Registration Data updated",
    });
    queryClient.invalidateQueries(["SpecialEvents"]);
    queryClient.invalidateQueries(["SelectedEventBookingCards"]);
  };

  const onError = (error) => {
    toast.current.show({
      severity: "error",
      summary: "Failed",
      detail: error.message,
    });
  };

  const onCopy = () => {
    toast.current.show({
      severity: "info",
      summary: "Copied to Clipboard",
      detail: "You can now paste it on another application.",
    });
  };

  const downloadCSV = () => {
    dt.current.exportCSV();
  };

  const { downloadPDF } = useExportPDF();

  useEffect(() => {
    clearFilter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Renders
   */

  const footer = () => {
    return (
      <div className="flex flex-wrap justify-between gap-2">
        <div className="my-auto">
          {`Total : ${eventData.data?.selectedEventBookingCards?.length} bookings`}
        </div>
        <div>
          <Button
            label="Generate participant check list"
            className="p-button-sm"
            onClick={generateParticipants}
          />
        </div>
      </div>
    );
  };

  if (eventData.isLoading)
    return (
      <div className="mt-3 text-center">
        <ProgressSpinner />
      </div>
    );

  return (
    <div>
      <Toast ref={toast} />
      <Toolbar
        className="bg-gray-200"
        right={
          <div className="flex gap-2">
            <Button
              label="PDF"
              className="p-button-sm"
              onClick={() => {
                downloadPDF({
                  prefix: "specialClass",
                  tableId: "#dataTableSC",
                });
              }}
            />
            <Button label="CSV" className="p-button-sm" onClick={downloadCSV} />
          </div>
        }
      />
      {searchAndFilter("Search user or participant names")}
      <DataTable
        id="dataTableSC"
        ref={dt}
        value={eventData.data?.selectedEventBookingCards}
        filters={filters}
        filterDisplay="menu"
        globalFilterFields={globalFilterFields}
        onRowSelect={onRowSelect}
        onRowUnselect={onHide}
        selectionMode="single"
        sortField="createdAt"
        sortOrder={1}
        paginator
        responsiveLayout="scroll"
        rows={10}
        rowsPerPageOptions={[10, 25, 50, 100]}
        footer={footer}
        paginatorLeft={true}
        paginatorRight={true}
      >
        {columnComponents}
      </DataTable>

      <Dialog
        visible={showDialog}
        onHide={onHide}
        className="w-full md:w-8/12 lg:w-6/12"
      >
        {selectedBooking && (
          <SpecialEventBookingCard
            bookingId={selectedBooking._id}
            onSuccess={onSuccess}
            onError={onError}
            onHide={onHide}
          />
        )}
      </Dialog>
      <Dialog
        className="w-full md:w-6/12 lg:w-4/12"
        visible={showAllParticipantsDialog}
        onHide={() => {
          setShowAllParticipantsDialog(false);
          setAllParticipants([]);
        }}
        header="Participants List"
      >
        <div>
          <div className="my-3">
            Total participants : {allParticipants.length}
          </div>
          <div className="bg-gray-100 text-gray-700 rounded-md shadow-1 pb-2">
            <div className="text-right">
              <CopyToClipboard
                onCopy={onCopy}
                text={`Participants Attendance List\nTotal Participants:${
                  allParticipants.length
                }\n\n${allParticipants.join("\n")}`}
              >
                <Button
                  icon="pi pi-copy"
                  className="p-button-sm p-button-outlined p-button-raised"
                />
              </CopyToClipboard>
            </div>
            <ul className="list-none">
              {allParticipants.map((participant, i) => {
                return <li key={i}>{participant}</li>;
              })}
            </ul>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default SpecialEventBookingData;
