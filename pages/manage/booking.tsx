import Layout from "@/components/Layout/Layout";
import {
  classTemplate,
  dateOnlyTemplate,
  filterElementDate,
  filterElementDropdown,
  userTemplate,
} from "@/components/Template";
import DTFormat from "@/components/UI/DTFormat";
import LoadingSkeleton from "@/components/UI/LoadingSkeleton";
import useExportPDF from "@/hooks/useExportPDF";
import useSearchAndFilter from "@/hooks/useSearchAndFilter";

import { DateTime } from "luxon";
import { useSession } from "next-auth/react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { BookingCards, CancelBookingCard } from "src/api";

const center = "center" as const;
const right = "right" as const;

const statusValues = [
  "Scheduled",
  "Confirmed",
  "Booking Cancelled",
  "Class Cancelled",
];

const globalFilterFields = [
  "user.name",
  "bookingCode",
  "regularClass.details.title",
];

const columns = [
  {
    field: "user.name",
    header: "User",
    sortable: true,
    preselected: true,
    body: userTemplate,
  },
  {
    field: "booker.name",
    header: "Booker",
    sortable: true,
    body: userTemplate,
  },
  {
    header: "Booking Code",
    field: "bookingCode",
    sortable: true,
    preselected: true,
  },
  {
    header: "Status",
    field: "status.value",
    sortable: true,
    align: center,
    filter: true,
    filterElement: (options) => filterElementDropdown(options, statusValues),
    preselected: true,
  },
  {
    header: "Class Schedule",
    field: "regularClass.schedule.date",
    dataType: "date",
    align: right,
    sortable: true,
    body: (rowData) => {
      if (rowData.regularClass?.schedule?.date)
        return dateOnlyTemplate(rowData.regularClass.schedule.date);
      return <div>Deleted Class</div>;
    },
    preselected: true,
    filter: true,
    filterElement: filterElementDate,
  },
  {
    header: "Title",
    field: "regularClass.details.title",
    sortable: true,
    preselected: true,
    body: classTemplate,
  },
];

const BookingCardPage = () => {
  const { data: session } = useSession();

  const dataset = useQuery(["bookingCards"], () => BookingCards(), {
    enabled: !!session,
    onSuccess(data) {
      return data.bookingCards.map((bookingCard) => {
        if (bookingCard.regularClass?.schedule?.date)
          bookingCard.regularClass.schedule.date = DateTime.fromISO(
            bookingCard.regularClass?.schedule?.date
          ).toJSDate();
      });
    },
  });

  const queryClient = useQueryClient();

  const cancelBooking = useMutation(CancelBookingCard);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const toast = useRef<Toast>(null);

  const onError = (error) => {
    toast.current.show({
      severity: "error",
      summary: "Failed",
      detail: `${error.message}`,
    });
  };

  const cancelHandler = async (_id, updatedBy) => {
    try {
      await cancelBooking.mutateAsync({ _id, updatedBy });
      toast.current.show({
        severity: "success",
        summary: "Done",
        detail: "Cancellation confirmed",
      });
      queryClient.invalidateQueries(["bookingCards"]);
      onRowUnselect();
    } catch (error) {
      error.response.errors.forEach((err) => onError(err));
    }
  };

  const onRowSelect = (e) => {
    setSelectedBooking(e.data);
    setShowCancelDialog(true);
  };

  const onRowUnselect = () => {
    setShowCancelDialog(false);
    setSelectedBooking(null);
  };

  const { filters, searchAndFilter, clearFilter, columnComponents } =
    useSearchAndFilter({
      columns,
      initialFilterValue: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        "status.value": {
          value: null,
          matchMode: FilterMatchMode.EQUALS,
        },
        "regularClass.schedule.date": {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
        },
      },
    });

  useEffect(() => {
    clearFilter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dt = useRef(null);

  const downloadCSV = () => {
    dt.current.exportCSV();
  };

  const { downloadPDF } = useExportPDF();

  return (
    <Layout>
      <Toast ref={toast}></Toast>
      <Toolbar
        className="bg-white/50 my-3"
        right={
          <div className="flex gap-2">
            <Button
              label="PDF"
              className="p-button-sm"
              onClick={() => {
                downloadPDF({ prefix: "booking", tableId: "#dataTable" });
              }}
            />
            <Button label="CSV" className="p-button-sm" onClick={downloadCSV} />
          </div>
        }
      />
      <Card>
        {searchAndFilter("Search user, booking code, or class title")}
        <DataTable
          id="dataTable"
          ref={dt}
          value={dataset.data?.bookingCards}
          filters={filters}
          filterDisplay="menu"
          globalFilterFields={globalFilterFields}
          loading={dataset.isLoading}
          onRowSelect={onRowSelect}
          onRowUnselect={onRowUnselect}
          selectionMode="single"
          sortField="bookingCode"
          sortOrder={-1}
          paginator
          responsiveLayout="scroll"
          rows={10}
          rowsPerPageOptions={[10, 25, 50, 100]}
          paginatorLeft={`Total : ${dataset.data?.bookingCards?.length} bookings`}
          paginatorRight={true}
        >
          {columnComponents}
        </DataTable>
      </Card>
      <Dialog
        header="Booking Details"
        visible={showCancelDialog}
        onHide={() => setShowCancelDialog(false)}
        className="w-full md:w-6/12 lg:w-4/12"
      >
        <div className="flex justify-between my-2">
          <div>Booking Code</div>
          <div>{selectedBooking?.bookingCode}</div>
        </div>
        <div className="flex justify-between my-2">
          <div>Class Detail</div>
          <div className="text-right">
            <div>{selectedBooking?.regularClass?.details?.title}</div>
            <div>
              <DTFormat
                value={selectedBooking?.regularClass?.schedule?.date}
                dateOnly
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between my-2">
          <div>Booking Status</div>
          <div>{selectedBooking?.status?.value}</div>
        </div>
        <div className="flex justify-between my-2">
          <div className="my-auto">Action</div>
          <div>
            <Button
              label="Cancel"
              className="p-button-sm p-button-danger"
              icon="pi pi-times"
              loading={cancelBooking.isLoading}
              onClick={() =>
                cancelHandler(selectedBooking._id, session.user._id)
              }
              disabled={
                !(
                  selectedBooking?.status.value === "Scheduled" &&
                  session?.user?._id
                )
              }
            />
          </div>
        </div>
      </Dialog>
    </Layout>
  );
};

BookingCardPage.auth = {
  role: "admin",
  loading: <LoadingSkeleton />,
  unauthorized: "/auth/unauthorized",
};

export default BookingCardPage;
