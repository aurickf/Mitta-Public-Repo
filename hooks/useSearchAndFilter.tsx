import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { useState } from "react";

import { CustomColumn } from "../interface/CustomColumn";

const useSearchAndFilter = ({
  columns,
  initialFilterValue,
}: {
  columns: CustomColumn[];
  initialFilterValue: any;
}) => {
  const [filters, setFilters] = useState(initialFilterValue);
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const clearFilter = () => {
    setFilters(initialFilterValue);
    setGlobalFilterValue("");
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const [selectedColumns, setSelectedColumns] = useState(
    columns.filter((column) => column.preselected)
  );

  const onColumnToggle = (event) => {
    let selectedColumns = event.value;
    let orderedSelectedColumns = columns.filter((col) =>
      selectedColumns.some((sCol) => sCol.header === col.header)
    );
    setSelectedColumns(orderedSelectedColumns);
  };

  const columnComponents = selectedColumns.map((col, i) => {
    return (
      <Column
        key={i}
        field={col.field}
        header={col.header}
        body={col.body}
        bodyClassName={col.bodyClassName}
        dataType={col.dataType}
        filter={col.filter}
        filterField={col.filterField}
        filterElement={col.filterElement}
        filterFunction={col.filterFunction}
        showFilterMatchModes={col.showFilterMatchModes}
        sortable={col.sortable}
        align={col.align}
        editor={col.editor}
        style={col.style}
      />
    );
  });

  /**
   *
   * @param placeholder : string
   * @returns JSX element
   */
  const searchAndFilter = (placeholder = "Search") => {
    return (
      <div className="">
        <div className="md:flex">
          <div className="w-full md:w-4/12 my-2">
            <MultiSelect
              value={selectedColumns.map((column) => {
                return { header: column.header };
              })}
              options={columns.map((column) => {
                return { header: column.header };
              })}
              optionLabel="header"
              onChange={onColumnToggle}
              className="w-full"
            />
          </div>
          <div className="w-full md:w-4/12 ml-auto">
            <div className="p-inputgroup">
              <Button
                type="button"
                icon="pi pi-filter-slash"
                className="p-button-outlined"
                onClick={clearFilter}
              />
              <InputText
                value={globalFilterValue}
                onChange={onGlobalFilterChange}
                placeholder={placeholder}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return {
    filters,
    searchAndFilter,
    clearFilter,
    columnComponents,
    selectedColumns,
  };
};

export default useSearchAndFilter;
