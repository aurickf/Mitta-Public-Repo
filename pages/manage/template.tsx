import ClassTemplateForm from "@/components/Form/ClassTemplateForm";
import Layout from "@/components/Layout/Layout";
import { RegularClassGrid } from "@/components/RegularClass/RegularClassGrid";
import { RegularClassList } from "@/components/RegularClass/RegularClassList";
import LoadingSkeleton from "@/components/UI/LoadingSkeleton";
import FeatureInactive from "pages/auth/no-feature";
import { Button } from "primereact/button";
import {
  DataView,
  DataViewLayoutOptions,
  DataViewLayoutType,
} from "primereact/dataview";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { useRef, useState } from "react";
import { useQuery } from "react-query";
import { ClassTemplates, FeatureTemplate } from "src/api";
import { RegularClassTemplate } from "src/generated/graphql";

const TemplatePage = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedData, setSelectedData] = useState<RegularClassTemplate>(null);

  const [layout, setLayout] = useState<DataViewLayoutType>("list");

  const addTemplateHandler = () => {
    setSelectedData(null);
    setShowSidebar(true);
  };

  const editTemplateHandler = (data: RegularClassTemplate) => {
    setSelectedData(data);
    setShowSidebar(true);
  };

  const dataset = useQuery("data", () => ClassTemplates());

  const feature = useQuery("FeatureTemplate", () => FeatureTemplate());

  const toast = useRef<Toast>();

  const onSubmitSuccess = async (message) => {
    setShowSidebar(false);
    toast.current.show({
      severity: "success",
      summary: "Done",
      detail: message,
    });
    await dataset.refetch();
  };

  const onSubmitError = (error) => {
    toast.current.show({
      severity: "error",
      summary: "Failed",
      detail: `${error.message}`,
    });
    setShowSidebar(false);
  };

  const rightToolbar = (
    <div className="flex ml-auto">
      <div className="mr-2">
        <DataViewLayoutOptions
          layout={layout}
          onChange={(e) => setLayout(e.value)}
        />
      </div>

      <Button icon="pi pi-plus" label="Add" onClick={addTemplateHandler} />
    </div>
  );

  const itemTemplate = (data: RegularClassTemplate) => {
    if (!data) return <></>;
    if (layout === "list")
      return (
        <RegularClassList
          value={data}
          onButtonClick={() => editTemplateHandler(data)}
        />
      );
    if (layout === "grid")
      return (
        <RegularClassGrid
          value={data}
          onButtonClick={() => editTemplateHandler(data)}
        />
      );
  };

  if (feature.isLoading) return <LoadingSkeleton />;

  if (!feature.data?.featureTemplate?.isEnabled) return <FeatureInactive />;

  return (
    <Layout>
      <Toast ref={toast}></Toast>
      <Toolbar right={rightToolbar} className="bg-white/50 my-2" />
      <DataView
        value={dataset.data?.classTemplates}
        loading={dataset.isLoading}
        itemTemplate={itemTemplate}
        layout={layout}
      />
      <Dialog
        visible={showSidebar}
        onHide={() => setShowSidebar(false)}
        className="w-full md:w-8/12 lg:w-6/12"
      >
        <ClassTemplateForm
          data={selectedData}
          onSubmitSuccess={onSubmitSuccess}
          onSubmitError={onSubmitError}
        />
      </Dialog>
    </Layout>
  );
};

TemplatePage.auth = {
  role: "admin",
  loading: <LoadingSkeleton />,
  unauthorized: "/auth/unauthorized",
};

export default TemplatePage;
