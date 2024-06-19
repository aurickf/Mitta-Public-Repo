import { CustomFileUploadI } from "@/interface/CustomFileUpload";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Image } from "primereact/image";
import { ProgressBar } from "primereact/progressbar";
import { Tag } from "primereact/tag";
import { useRef, useState } from "react";

const chooseOptions = {
  icon: "pi pi-fw pi-images",
  className: "p-button-rounded p-button-outlined w-full md:w-auto my-1 text-xs",
};
const uploadOptions = {
  label: "Upload and Submit",
  icon: "pi pi-fw pi-cloud-upload",
  className:
    "p-button-success p-button-rounded p-button-outlined w-full md:w-auto my-1 text-xs",
};
const cancelOptions = {
  icon: "pi pi-fw pi-times",
  className:
    "p-button-danger p-button-rounded p-button-outlined w-full md:w-auto my-1 text-xs",
};

const CustomFileUpload = (props: CustomFileUploadI) => {
  const { dispatch, maxFileSize } = props;

  const [totalSize, setTotalSize] = useState(0);
  const fileUploadRef = useRef(null);

  const onTemplateSelect = (e) => {
    dispatch({ type: "selectImage", value: e.files[0] });
    setTotalSize(e.files[0].size);
  };

  const onTemplateRemove = (file, callback) => {
    setTotalSize(totalSize - file.size);
    dispatch({ type: "clearImage" });
    callback();
  };

  const onTemplateClear = () => {
    setTotalSize(0);
    dispatch({ type: "clearImage" });
  };

  const headerTemplate = (options) => {
    const { className, chooseButton, uploadButton } = options;
    const value = totalSize / (5 * 10 * 1024);
    const formattedValue =
      fileUploadRef && fileUploadRef.current
        ? fileUploadRef.current.formatSize(totalSize)
        : "0 B";

    return (
      <>
        <div
          className={
            className +
            " flex-none md:flex items-center text-center bg-wisteria-50"
          }
        >
          <div>{chooseButton}</div>
          <div className="ml-auto">{displayValueTemplate(formattedValue)}</div>
        </div>
      </>
    );
  };

  const displayValueTemplate = (value: string) => {
    return (
      <div className="my-auto">
        <div className="text-xs italic text-gray-500 my-1">File size</div>
        <div className="text-gray-700">{value}/5MB</div>
      </div>
    );
  };

  const itemTemplate = (file, props) => {
    return (
      <div className="flex items-center flex-wrap">
        <div className="flex items-center w-8/12">
          <Image
            alt={file.name}
            src={file.objectURL}
            role="presentation"
            width="100"
          />
          <div className="hidden md:block">
            <div className="flex flex-column text-left ml-3">
              <div>{file.name}</div>
              {/* <div>{Math.round(file.size / 1024)} KB</div> */}
            </div>
          </div>
        </div>
        <div className="hidden">
          <Tag
            value={props.formatSize}
            severity="warning"
            className="px-1 md:px-3 py-1 md:py-2"
          />
        </div>
        <Button
          type="button"
          icon="pi pi-times"
          className="p-button-outlined p-button-rounded p-button-danger ml-auto"
          onClick={() => onTemplateRemove(file, props.onRemove)}
        />
      </div>
    );
  };

  const emptyTemplate = () => {
    return (
      <div className="flex items-center justify-center gap-2">
        <i className="pi pi-image mt-3 p-5 text-gray-500 text-3xl rounded-lg bg-neutral-100"></i>
        <span className="my-5 text-gray-500 text-xl">
          Drag and Drop Image Here
        </span>
      </div>
    );
  };

  return (
    <FileUpload
      ref={fileUploadRef}
      name="upload"
      customUpload
      accept="image/*"
      maxFileSize={maxFileSize}
      mode="advanced"
      chooseOptions={chooseOptions}
      uploadOptions={uploadOptions}
      cancelOptions={cancelOptions}
      onSelect={onTemplateSelect}
      onError={onTemplateClear}
      onClear={onTemplateClear}
      headerTemplate={headerTemplate}
      itemTemplate={itemTemplate}
      emptyTemplate={emptyTemplate}
    />
  );
};

export default CustomFileUpload;
