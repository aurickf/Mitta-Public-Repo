import { SettingForm } from "@/components/Form/SettingForm";
import DTFormat from "@/components/UI/DTFormat";
import IDR from "@/components/UI/IDR";
import { ISettingProps } from "@/interface/Setting";
import { DateTime } from "luxon";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { ConfirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { Toolbar } from "primereact/toolbar";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

const calendarEditor = (options) => {
  return (
    <Calendar
      dateFormat="D, dd M yy"
      value={options.value}
      onChange={(e) => options.editorCallback(e.value)}
      showButtonBar
    />
  );
};

const textEditor = (options, keyfilter) => {
  return (
    <InputText
      type="text"
      keyfilter={keyfilter}
      value={options.value}
      onChange={(e) => {
        options.editorCallback(e.target.value);
      }}
    />
  );
};

const dateTemplate = (rowData, field) => {
  if (rowData[field]) return <DTFormat value={rowData[field]} dateOnly />;
};

const priceTemplate = (rowData) => {
  return <IDR value={rowData.price} />;
};

const validityTemplate = (rowData) => {
  return rowData.validity + " day";
};

const Setting = (props: ISettingProps) => {
  const columnAction = (
    <Column
      rowEditor
      headerStyle={{ width: "1em" }}
      bodyStyle={{ textAlign: "center" }}
    />
  );

  const { title, columns, query, datakey, onSuccess, onError } = props;

  const { addMutation, editMutation, deleteMutation } = props.mutation;

  const dataset = useQuery(datakey, () => query(), {
    onSuccess(data) {
      if (datakey === "announcements" || datakey === "holidays") {
        return data[datakey].map((item) => {
          item.start = DateTime.fromISO(item.start).toJSDate();
          item.end = item.end && DateTime.fromISO(item.end).toJSDate();
        });
      }
    },
  });

  const editSetting = useMutation(editMutation);
  const deleteSetting = useMutation(deleteMutation);
  const queryClient = useQueryClient();

  const [showDialogAdd, setShowDialogAdd] = useState(false);
  const [showDialogDelete, setShowDialogDelete] = useState(false);

  const [selectedRow, setSelectedRow] = useState(null);
  const [disableDeleteButton, setDisableDeleteButton] = useState(true);

  // Handler
  const acceptDeleteHandler = async () => {
    setSelectedRow(null);
    setDisableDeleteButton(true);

    try {
      await deleteSetting.mutateAsync({ _id: selectedRow._id });
      await queryClient.invalidateQueries(datakey);

      onSuccess("Deletion confirmed");
    } catch (error) {
      error.response.errors.forEach((err) => onError(err));
    }
  };

  const onRowEditComplete = async (e) => {
    /** Convert required string values to int so can be accepted by GraphQL
     */
    const keys = Object.keys(e.data).filter((key) => {
      if (typeof e.data[key] === "number") return key;
    });

    if (keys.length > 0) {
      keys.map((key) => {
        e.newData[key] = parseInt(e.newData[key]);
      });
    }

    try {
      await editSetting.mutateAsync(e.newData);
      await queryClient.invalidateQueries(datakey);

      onSuccess(`Settings updated`);
    } catch (error) {
      error.response.errors.forEach((err) => onError(err));
    }
  };

  const onRowSelect = (e) => {
    setSelectedRow(e.data);
    setDisableDeleteButton(false);
  };

  const onRowUnselect = () => {
    setSelectedRow(null);
    setDisableDeleteButton(true);
  };

  const toggleSwitchValue = async (data, field) => {
    const mutationObject = {
      _id: data._id,
      [field]: !data[field],
    };

    try {
      await editSetting.mutateAsync(mutationObject);
      await queryClient.invalidateQueries(datakey);

      onSuccess("Settings updated");
    } catch (error) {
      error.response.errors.forEach((err) => onError(err));
    }
  };

  const toggleTemplate = (rowData, field) => {
    return (
      <div>
        <InputSwitch
          checked={rowData[field]}
          onChange={() => toggleSwitchValue(rowData, field)}
        />
      </div>
    );
  };

  const columnComponents = columns.map((column) => {
    switch (column.dataType) {
      case "boolean":
        return (
          <Column
            key={column.field}
            header={column.header}
            sortable={column.sortable}
            body={(rowData) => toggleTemplate(rowData, column.field)}
            style={{ width: "1em" }}
          />
        );

      case "date":
        return (
          <Column
            key={column.field}
            field={column.field}
            header={column.header}
            sortable={column.sortable}
            body={(rowData) => dateTemplate(rowData, column.field)}
            dataType="date"
            editor={calendarEditor}
          />
        );

      case "numeric":
        if (column.field === "price")
          return (
            <Column
              key={column.field}
              field={column.field}
              header={column.header}
              editor={(options) => textEditor(options, "pint")}
              sortable={column.sortable}
              body={priceTemplate}
              dataType="numeric"
            />
          );

        if (column.field === "validity")
          return (
            <Column
              key={column.field}
              field={column.field}
              header={column.header}
              editor={(options) => textEditor(options, "pint")}
              sortable={column.sortable}
              body={validityTemplate}
              dataType="numeric"
            />
          );
        return (
          <Column
            key={column.field}
            field={column.field}
            header={column.header}
            editor={(options) => textEditor(options, "pint")}
            sortable={column.sortable}
            dataType="numeric"
          />
        );

      default:
        return (
          <Column
            key={column.field}
            field={column.field}
            header={column.header}
            editor={(options) => textEditor(options, column.keyfilter)}
            sortable={column.sortable}
          />
        );
    }
  });

  const confirmDeleteDialog = (
    <ConfirmDialog
      visible={showDialogDelete}
      header="Delete Confirmation"
      message={
        "This action cannot be undone. Are you sure to delete selected " +
        title.toLowerCase() +
        "?"
      }
      rejectLabel="Cancel"
      acceptLabel="Confirm to Delete"
      acceptIcon="pi pi-trash"
      acceptClassName="p-button-danger"
      accept={acceptDeleteHandler}
      onHide={() => setShowDialogDelete(false)}
    />
  );

  const invalidateQueries = async () => {
    await queryClient.invalidateQueries(datakey);
  };

  useEffect(() => {
    invalidateQueries();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showDialogAdd]);

  const onSubmitSuccess = () => {
    setShowDialogAdd(false);
    onSuccess("New setting saved");
  };

  const headerDataTable = (
    <Toolbar
      left={
        <Button
          className="p-button-text p-button-danger"
          label="Delete"
          icon="pi pi-trash"
          disabled={disableDeleteButton}
          onClick={() => setShowDialogDelete(true)}
          loading={deleteSetting.isLoading}
        />
      }
      right={
        <>
          <Button
            label="Add"
            icon="pi pi-plus"
            onClick={() => setShowDialogAdd(true)}
          />
        </>
      }
    />
  );

  return (
    <>
      <Dialog
        header={"Add New " + title}
        visible={showDialogAdd}
        onHide={() => setShowDialogAdd(false)}
        className="w-full md:w-6/12"
      >
        <SettingForm
          addMutation={addMutation}
          columns={props.columns}
          onSubmitSuccess={onSubmitSuccess}
          onError={onError}
        />
      </Dialog>

      {confirmDeleteDialog}

      <Card title={title} className="my-3">
        <DataTable
          responsiveLayout="scroll"
          value={dataset.data?.[datakey] || []}
          header={headerDataTable}
          loading={dataset.isLoading}
          dataKey="_id"
          editMode="row"
          selectionMode="single"
          selection={selectedRow}
          onRowSelect={onRowSelect}
          onRowUnselect={onRowUnselect}
          onRowEditComplete={onRowEditComplete}
          onRowEditCancel={onRowUnselect}
          paginator
          rows={10}
        >
          {columnComponents}
          {columnAction}
        </DataTable>
      </Card>
    </>
  );
};

export default Setting;
