import MembershipForm from "@/components/Form/MembershipForm";
import Layout from "@/components/Layout/Layout";
import {
  bookedTemplate,
  cancelledTemplate,
  confirmedTemplate,
  dateOnlyTemplate,
  filterElementCheckbox,
  filterElementDate,
  priceTemplate,
  userTemplate,
  verifiedTemplate,
} from "@/components/Template";
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
import { Image } from "primereact/image";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { Memberships } from "src/api";

const center = "center" as const;
const right = "right" as const;

const showImage = (imageUrl) => {
  return (
    <Image
      src={imageUrl}
      alt="payment"
      height="100px"
      width="50px"
      preview
      downloadable
    />
  );
};

const columns = [
  {
    field: "user.name",
    header: "Name",
    preselected: true,
    sortable: true,
    body: userTemplate,
  },
  {
    field: "user.username",
    header: "Username",
    sortable: true,
  },
  {
    field: "user.email",
    header: "Email",
    sortable: true,
  },
  { field: "note", header: "Note", preselected: true, sortable: true },
  {
    field: "payment.date",
    header: "Payment Date",
    preselected: true,
    body: (rowData) => {
      return dateOnlyTemplate(rowData.payment.date);
    },
    align: right,
    sortable: true,
    dataType: "date",
    filter: true,
    filterElement: filterElementDate,
  },
  {
    field: "payment.method",
    header: "Payment Method",
    preselected: true,
    sortable: true,
  },
  {
    field: "payment.amount",
    header: "Payment Amount",
    preselected: true,
    align: right,
    sortable: true,
    body: (rowData) => {
      return priceTemplate(rowData.payment.amount);
    },
    dataType: "numeric",
  },
  {
    field: "payment.url",
    header: "Proof of Payment",
    preselected: true,
    align: center,
    body: (rowData) => {
      if (rowData.payment?.url) return showImage(rowData.payment.url);
    },
  },
  {
    field: "createdAt",
    header: "Requested At",
    align: center,
    preselected: true,
    body: (rowData) => {
      if (rowData.createdAt) {
        return (
          <div className="text-sm">
            {DateTime.fromISO(rowData.createdAt).toFormat(
              "dd LLL yyyy HH:mm:ss"
            )}
          </div>
        );
      }
    },
  },
  {
    field: "verified.isVerified",
    header: "Status",
    preselected: true,
    filter: true,
    filterElement: filterElementCheckbox,
    showFilterMatchModes: false,
    body: verifiedTemplate,
  },
  {
    field: "balance.additional",
    header: "Purchased",
    dataType: "numeric",
    preselected: true,
    align: center,
  },
  {
    field: "balance.available",
    header: "Current Balance",
    dataType: "numeric",
    preselected: true,
    align: center,
    sortable: true,
    filter: true,
  },
  {
    field: "balance.transferIn",
    header: "Transfer In",
    dataType: "numeric",
    preselected: true,
    align: center,
  },
  {
    field: "balance.transferOut",
    header: "Transfer Out",
    dataType: "numeric",
    preselected: true,
    align: center,
  },
  {
    field: "balance.validUntil",
    header: "Valid Until",
    preselected: true,
    sortable: true,
    body: (rowData) => {
      return dateOnlyTemplate(rowData.balance.validUntil);
    },
    align: right,
    dataType: "date",
    filter: true,
    filterElement: filterElementDate,
  },
  {
    field: "booked",
    header: "Scheduled Booking",
    body: bookedTemplate,
    align: right,
    filter: true,
  },
  {
    field: "confirmed",
    header: "Confirmed Booking",
    body: confirmedTemplate,
    align: right,
    filter: true,
  },
  {
    field: "booked",
    header: "Cancelled Booking",
    body: cancelledTemplate,
    align: right,
    filter: true,
  },
];

const globalFilterFields = ["user.name", "note"];

const MembershipPage = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const dataset = useQuery(["memberships"], () => Memberships(), {
    onSuccess(data) {
      return data.memberships.map((membership) => {
        membership.payment.date = DateTime.fromISO(
          membership.payment.date
        ).toJSDate();
        membership.balance.validUntil = DateTime.fromISO(
          membership.balance.validUntil
        ).toJSDate();
      });
    },
  });

  const [showDialog, setShowDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const onRowSelect = (e) => {
    setSelectedRow(e.data);
    setShowDialog(true);
  };

  const onHide = () => {
    setSelectedRow(null);
    setShowDialog(false);
  };

  const onSubmitSuccess = (message) => {
    toast.current.show({
      severity: "success",
      summary: "Done",
      detail: message,
    });
    queryClient.invalidateQueries();

    onHide();
  };

  const onError = (error) => {
    toast.current.show({
      severity: "error",
      summary: "Error",
      detail: `${error.message}`,
    });
    onHide();
  };

  const { filters, searchAndFilter, clearFilter, columnComponents } =
    useSearchAndFilter({
      columns,
      initialFilterValue: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },

        "payment.date": {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
        },

        "verified.isVerified": {
          value: null,
          matchMode: FilterMatchMode.EQUALS,
        },

        "balance.available": {
          operator: FilterOperator.AND,
          constraints: [
            { value: null, matchMode: FilterMatchMode.LESS_THAN_OR_EQUAL_TO },
          ],
        },

        "balance.validUntil": {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
        },
      },
    });

  useEffect(() => {
    clearFilter();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toast = useRef<Toast>();

  const { downloadPDF } = useExportPDF();

  const dt = useRef(null);

  const downloadCSV = () => {
    dt.current.exportCSV();
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
                downloadPDF({ prefix: "membership" });
              }}
            />
            <Button label="CSV" className="p-button-sm" onClick={downloadCSV} />
          </div>
        }
      />
      <Card>
        {searchAndFilter("Search by name or note")}
        <DataTable
          id="dataTable"
          ref={dt}
          value={dataset.data?.memberships}
          loading={dataset.isLoading}
          selectionMode="single"
          selection={selectedRow}
          onRowSelect={onRowSelect}
          responsiveLayout="scroll"
          filters={filters}
          filterDisplay="menu"
          globalFilterFields={globalFilterFields}
          emptyMessage="No membership found"
          sortField="payment.date"
          sortOrder={-1}
          paginator
          paginatorLeft={`Total : ${dataset.data?.memberships?.length} memberships`}
          paginatorRight={true}
          rows={10}
          rowsPerPageOptions={[10, 25, 50, 100]}
        >
          {columnComponents}
        </DataTable>
      </Card>
      <Dialog
        visible={showDialog}
        onHide={onHide}
        header="Edit Membership"
        className="w-full md:w-6/12"
      >
        {selectedRow && (
          <MembershipForm
            adminMode
            by={session.user._id}
            userId={selectedRow._id}
            data={selectedRow}
            onSuccess={onSubmitSuccess}
            onError={onError}
          />
        )}
      </Dialog>
    </Layout>
  );
};

MembershipPage.auth = {
  role: "admin",
  loading: <LoadingSkeleton />,
  unauthorized: "/auth/unauthorized",
};

export default MembershipPage;
