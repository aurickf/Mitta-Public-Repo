import Feature from "@/components/Feature";
import Layout from "@/components/Layout/Layout";
import LoadingData from "@/components/LoadingData";
import LoadingSkeleton from "@/components/UI/LoadingSkeleton";
import { Types } from "mongoose";
import { Card } from "primereact/card";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import {
  Admins,
  FeaturePageQuery,
  SetAutoApproverAdmin,
  ToggleFeature,
  queryClient,
} from "src/api";

const FeaturePage = () => {
  /**
   * Hooks
   */
  const [checkboxSeries, setCheckboxSeries] = useState(false);
  const [checkboxTemplate, setCheckboxTemplate] = useState(false);
  const [checkboxAnalytics, setCheckboxAnalytics] = useState(false);
  const [checkboxAutoApprove, setCheckboxAutoApprove] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Types.ObjectId>(null);
  const toast = useRef<Toast>();

  /**
   * Custom hooks
   */
  const dataset = useQuery(["FeaturePage"], () => FeaturePageQuery());
  const adminData = useQuery(["Admins"], () => Admins());
  const toggleFeature = useMutation(ToggleFeature, {
    onError() {
      setCheckboxSeries(dataset.data.featureSeries?.isEnabled);
      setCheckboxTemplate(dataset.data.featureTemplate?.isEnabled);
      setCheckboxAnalytics(dataset.data.featureAnalytics?.isEnabled);
      setCheckboxAutoApprove(
        dataset.data.featureAutoApproveMembership?.isEnabled
      );
      setSelectedAdmin(dataset.data.featureAutoApproveMembership?.by?._id);
    },
  });
  const setAutoApprover = useMutation(SetAutoApproverAdmin);

  useEffect(() => {
    if (dataset.data) {
      setCheckboxSeries(dataset.data.featureSeries?.isEnabled);
      setCheckboxTemplate(dataset.data.featureTemplate?.isEnabled);
      setCheckboxAutoApprove(
        dataset.data.featureAutoApproveMembership?.isEnabled
      );
      setCheckboxAnalytics(dataset.data.featureAnalytics?.isEnabled);
      setSelectedAdmin(dataset.data.featureAutoApproveMembership?.by?._id);
    }
  }, [dataset.data]);

  /**
   * Utils
   */
  const title = (
    <div className="flex flex-wrap justify-between">
      <div>Configure Application Features</div>
    </div>
  );

  const onSuccess = () => {
    toast.current.show({
      severity: "success",
      summary: "Done",
      detail: "Feature updated",
    });
  };

  const onError = (err) => {
    toast.current.show({
      severity: "error",
      summary: "Failed",
      detail: err.message,
    });
  };

  const toggleHandler = async (featureKey) => {
    try {
      await toggleFeature.mutateAsync({ featureKey });
      queryClient.invalidateQueries(["FeaturePage"]);
      onSuccess();
    } catch (error) {
      error.response.errors.forEach((err) => onError(err));
    }
  };

  const changeApproverHandler = async (_id) => {
    try {
      await setAutoApprover.mutateAsync({ _id });
      queryClient.invalidateQueries(["FeaturePage"]);
      onSuccess();
    } catch (error) {
      error.response.errors.forEach((err) => onError(err));
    }
  };

  return (
    <Layout>
      <Toast ref={toast} />

      <Card title={title}>
        {dataset.isLoading && <LoadingData />}
        <Feature
          name="Class Template"
          description="When enabled will let administrators to create schedule using templates (manage/template)"
          featureKey="FEATURE_TEMPLATE"
        >
          <div className="flex flex-wrap items-center gap-2">
            <Checkbox
              onChange={(e) => {
                toggleHandler("FEATURE_TEMPLATE");
                setCheckboxTemplate(e.checked);
              }}
              checked={checkboxTemplate}
            />
            <div>Enable class template</div>
          </div>
        </Feature>
        <Feature
          name="Class Series"
          description="When enabled will let administrators to create and publish class series (manage/series)"
          featureKey="FEATURE_SERIES"
        >
          <div className="flex flex-wrap items-center gap-2">
            <Checkbox
              onChange={(e) => {
                toggleHandler("FEATURE_SERIES");
                setCheckboxSeries(e.checked);
              }}
              checked={checkboxSeries}
            />
            <div>Enable class series</div>
          </div>
        </Feature>
        <Feature
          name="Analytics"
          description="When enabled will let administrators to access analytics page (tools/report)"
          featureKey="FEATURE_ANALYTICS"
        >
          <div className="flex flex-wrap items-center gap-2">
            <Checkbox
              onChange={(e) => {
                toggleHandler("FEATURE_ANALYTICS");
                setCheckboxAnalytics(e.checked);
              }}
              checked={checkboxAnalytics}
            />
            <div>Enable analytics</div>
          </div>
        </Feature>
        <Feature
          name="Auto Approve Membership"
          description="When enabled membership requested by users will be approved automatically by selected administrator user"
          featureKey="FEATURE_AUTO_APPROVE_MEMBERSHIP"
        >
          <div className="flex flex-wrap items-center gap-2">
            <Checkbox
              onChange={(e) => {
                toggleHandler("FEATURE_AUTO_APPROVE_MEMBERSHIP");
                setCheckboxAutoApprove(e.checked);
              }}
              checked={checkboxAutoApprove}
              disabled={!selectedAdmin}
            />
            <div>Enable auto approve by</div>
            <Dropdown
              placeholder="Select an administrator account"
              className="max-w-full"
              options={adminData.data?.admins}
              optionLabel="name"
              optionValue="_id"
              value={selectedAdmin}
              onChange={(e) => {
                setSelectedAdmin(e.value);
                changeApproverHandler(e.value);
              }}
            />
          </div>
        </Feature>
      </Card>
    </Layout>
  );
};

FeaturePage.auth = {
  role: "admin",
  loading: <LoadingSkeleton />,
  unauthorized: "/auth/unauthorized",
};

export default FeaturePage;
