import Layout from "@/components/Layout/Layout";
import {
  dateAndTimeTemplate,
  filterElementDate,
  filterElementDropdown,
} from "@/components/Template";
import LoadingSkeleton from "@/components/UI/LoadingSkeleton";
import useExportPDF from "@/hooks/useExportPDF";
import useSearchAndFilter from "@/hooks/useSearchAndFilter";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { useEffect, useRef } from "react";
import { useQuery } from "react-query";
import { GetAllLogs } from "src/api";

const center = "center" as const;
const right = "right" as const;

const categoryValues = ["Booking", "Membership", "Class"];
const subCategoryValues = [
  "Approved",
  "Cancelled",
  "Confirmed",
  "Deleted",
  "New",
  "Rejected",
];

const columns = [
  {
    field: "createdAt",
    header: "Date",
    preselected: true,
    body: (rowData) => {
      return dateAndTimeTemplate(rowData.createdAt);
    },
    sortable: true,
    align: right,
    dataType: "date",
    filter: true,
    filterElement: filterElementDate,
  },
  {
    field: "user.name",
    header: "Name",
    preselected: true,
    sortable: true,
    body: (rowData) => {
      return rowData.user?.name ?? "Deleted User";
    },
  },
  {
    field: "category",
    header: "Category",
    body: (rowData) => rowData.category,
    preselected: true,
    sortable: true,
    align: center,
    filter: true,
    filterElement: (options) => filterElementDropdown(options, categoryValues),
  },
  {
    field: "subCategory",
    header: "Sub Category",
    body: (rowData) => rowData.subCategory,
    preselected: true,
    filter: true,
    sortable: true,
    align: center,
    filterElement: (options) =>
      filterElementDropdown(options, subCategoryValues),
  },
  {
    field: "message",
    header: "Message",
    preselected: true,
    sortable: true,
    body: (rowData) => {
      return (
        <div className="text-right lg:text-left text-sm pl-1">
          {rowData.message}
        </div>
      );
    },
  },
];

const globalFilterFields = ["user.name", "message"];

const LogPage = () => {
  const dataset = useQuery(["logs"], () => GetAllLogs());

  const onError = (error) => {
    toast.current.show({
      severity: "error",
      summary: "Error",
      detail: `${error.message}`,
    });
  };

  const { filters, searchAndFilter, clearFilter, columnComponents } =
    useSearchAndFilter({
      columns,
      initialFilterValue: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },

        createdAt: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
        },

        category: {
          operator: FilterOperator.OR,
          constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
        },

        subCategory: {
          operator: FilterOperator.OR,
          constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
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
        className="bg-white/50 my-3"
        right={
          <div className="flex gap-2">
            <Button
              label="PDF"
              className="p-button-sm"
              onClick={() => {
                downloadPDF({ prefix: "log" });
              }}
            />
            <Button label="CSV" className="p-button-sm" onClick={downloadCSV} />
          </div>
        }
      />
      <Card>
        {searchAndFilter("Search by name or message")}
        <DataTable
          id="dataTable"
          ref={dt}
          value={dataset.data?.getAllLogs}
          loading={dataset.isLoading}
          selectionMode="single"
          responsiveLayout="scroll"
          filters={filters}
          filterDisplay="menu"
          globalFilterFields={globalFilterFields}
          emptyMessage="No log found"
          sortField="createdAt"
          paginator
          paginatorLeft={`Total : ${dataset.data?.getAllLogs?.length} log records`}
          paginatorRight={true}
          rows={10}
          rowsPerPageOptions={[10, 25, 50, 100]}
        >
          {columnComponents}
        </DataTable>
      </Card>
    </Layout>
  );
};

LogPage.auth = {
  role: "admin",
  loading: <LoadingSkeleton />,
  unauthorized: "/auth/unauthorized",
};

export default LogPage;
