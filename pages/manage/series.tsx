import SeriesForm from "@/components/Form/SeriesForm";
import Layout from "@/components/Layout/Layout";
import DTFormat from "@/components/UI/DTFormat";
import LoadingSkeleton from "@/components/UI/LoadingSkeleton";
import useExportPDF from "@/hooks/useExportPDF";
import useSearchAndFilter from "@/hooks/useSearchAndFilter";
import FeatureInactive from "pages/auth/no-feature";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { useRef, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { AllSeries, FeatureSeries } from "src/api";
import { RegularClass, SpecialEvent } from "src/generated/graphql";

const columns = [
  {
    field: "title",
    header: "Series Title",
    preselected: true,
    sortable: true,
    body: (rowData) => {
      return (
        <div className="flex flex-wrap justify-between">
          <div className="my-auto">{rowData.title}</div>
          <Button
            icon="pi pi-external-link"
            severity="info"
            rounded
            text
            onClick={() => {
              window.open(`../series/${rowData.title}`);
            }}
          />
        </div>
      );
    },
  },
  {
    field: "isPublished",
    header: "Published",
    preselected: true,
    sortable: true,
    body: (rowData) => (rowData.isPublished ? "Published" : "Hidden"),
  },
  {
    field: "description",
    header: "Description",
    preselected: true,
    sortable: true,
  },
  {
    field: "regularClass",
    header: "Regular Class",
    preselected: true,
    body: (rowData) => {
      return rowData.regularClass.map((event: RegularClass, i: number) => {
        return (
          <div key={i} className="py-4 border-b last:border-none">
            <div>{event.details.title}</div>
            <div className="text-sm">
              <DTFormat value={event.schedule.date} />
            </div>
          </div>
        );
      });
    },
  },
  {
    field: "specialEvent",
    header: "Special Class",
    preselected: true,
    body: (rowData) => {
      return rowData.specialEvent.map((event: SpecialEvent, i: number) => {
        return (
          <div key={i} className="py-4 border-b last:border-none">
            <div>{event.details.title}</div>
            <div className="text-sm">
              <DTFormat value={event.schedule.date} />
            </div>
          </div>
        );
      });
    },
  },
];

const globalFilterFields = ["title"];

const SeriesPage = () => {
  const dataset = useQuery(["AllSeries"], () => AllSeries());
  const feature = useQuery("FeatureSeries", () => FeatureSeries());

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const queryClient = useQueryClient();

  const onRowSelect = (e) => {
    setSelectedRow(e.data);
    setShowEditDialog(true);
  };

  const onHide = () => {
    setSelectedRow(null);
    setShowAddDialog(false);
  };

  const toast = useRef<Toast>();

  const { downloadPDF } = useExportPDF();

  const dt = useRef(null);

  const downloadCSV = () => {
    dt.current.exportCSV();
  };

  const { filters, searchAndFilter, columnComponents } = useSearchAndFilter({
    columns,
    initialFilterValue: {
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    },
  });

  const onSuccess = async (message) => {
    toast.current.show({
      severity: "success",
      summary: "Done",
      detail: message,
    });
    setShowAddDialog(false);
    setShowEditDialog(false);
    await queryClient.invalidateQueries(["AllSeries"]);
  };

  const onError = (err) => {
    toast.current.show({
      severity: "error",
      summary: "Failed",
      detail: err.message,
    });
  };

  const subTitle = () => {
    return (
      <div className="flex gap-2 justify-end">
        <Button
          icon="pi pi-plus"
          label="Add"
          onClick={() => setShowAddDialog(true)}
        />
      </div>
    );
  };

  if (feature.isLoading) return <LoadingSkeleton />;

  if (!feature.data?.featureSeries?.isEnabled) return <FeatureInactive />;

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
                downloadPDF({ prefix: "series" });
              }}
            />
            <Button label="CSV" className="p-button-sm" onClick={downloadCSV} />
          </div>
        }
      />
      <Card subTitle={subTitle}>
        {searchAndFilter("Search by series title")}

        <DataTable
          id="dataTable"
          ref={dt}
          value={dataset.data?.allSeries}
          loading={dataset.isLoading}
          selectionMode="single"
          selection={selectedRow}
          onRowSelect={onRowSelect}
          responsiveLayout="scroll"
          filters={filters}
          filterDisplay="menu"
          globalFilterFields={globalFilterFields}
          emptyMessage="No series found"
          sortField="title"
          sortOrder={1}
          paginator
          paginatorLeft={`Total : ${dataset.data?.allSeries?.length} series`}
          paginatorRight={true}
          rows={10}
          rowsPerPageOptions={[10, 25, 50, 100]}
        >
          {columnComponents}
        </DataTable>
      </Card>
      <Dialog
        visible={showAddDialog}
        onHide={() => setShowAddDialog(false)}
        className="w-full md:w-9/12 lg:w-8/12 "
        header="Add New Series"
      >
        <SeriesForm onSuccess={onSuccess} onError={onError} />
      </Dialog>
      <Dialog
        visible={showEditDialog}
        onHide={() => {
          setSelectedRow(null);
          setShowEditDialog(false);
        }}
        className="w-full md:w-9/12 lg:w-8/12 "
        header="Edit Series"
      >
        <SeriesForm
          onSuccess={onSuccess}
          onError={onError}
          selectedSeriesId={selectedRow?._id}
        />
      </Dialog>
    </Layout>
  );
};

SeriesPage.auth = {
  role: "admin",
  loading: <LoadingSkeleton />,
  unauthorized: "/auth/unauthorized",
};

export default SeriesPage;
