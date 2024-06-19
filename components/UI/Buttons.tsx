import { Button } from "primereact/button";

export const AddButton = (props) => {
  return <Button label="Add" icon="pi pi-plus" {...props} />;
};

export const DeleteButton = (props) => {
  return (
    <Button
      type="button"
      label="Delete"
      icon="pi pi-trash"
      className="p-button-text p-button-danger mx-1"
      {...props}
    />
  );
};

export const EditButton = (props) => {
  return <Button label="Edit" className="mx-1" {...props} />;
};

export const ResetButton = (props) => {
  return (
    <Button
      type="button"
      label="Reset"
      className="p-button-text mx-1"
      {...props}
    />
  );
};

export const SaveButton = (props) => {
  return <Button label="Save" icon="pi pi-save" className="mx-1" {...props} />;
};
