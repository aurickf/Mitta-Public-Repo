import Layout from "@/components/Layout/Layout";
import LayoutNoAuth from "@/components/Layout/LayoutNoAuth";
import LoadingSkeleton from "@/components/UI/LoadingSkeleton";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { CleanUpUserData, Users } from "src/api";

const MaintenancePage = () => {
  const [selectedUser, setSelectedUser] = useState("");
  const toast = useRef<Toast>();

  const userQuery = useQuery("users", () => Users());
  const cleanUp = useMutation(CleanUpUserData);

  const onSuccess = (message) => {
    toast.current.show({
      severity: "success",
      summary: "Done",
      detail: message,
    });
  };

  const onError = (error) => {
    toast.current.show({
      severity: "error",
      summary: "Failed",
      detail: error.message,
    });
  };

  const onSubmit = async () => {
    try {
      await cleanUp.mutateAsync({ _id: selectedUser });
      onSuccess("Clean up done!");
    } catch (error) {
      error.response.errors.forEach((err) => onError(err));
    }
  };

  const itemTemplate = (user) => {
    return (
      <div>
        {user?.name} - {user?.email}
      </div>
    );
  };

  if (process.env.NODE_ENV === "development")
    return (
      <Layout>
        <Toast ref={toast} />
        <Card title="User data cleanup">
          <div className="flex gap-2 items-center">
            <Dropdown
              options={userQuery.data?.users || []}
              value={selectedUser}
              optionValue="_id"
              optionLabel="name"
              itemTemplate={itemTemplate}
              valueTemplate={itemTemplate}
              onChange={(e) => setSelectedUser(e.value)}
              placeholder="Select user"
              className="w-4/12"
            />
            <Button
              label="Clean Up Data"
              onClick={onSubmit}
              loading={cleanUp.isLoading}
            />
          </div>
        </Card>
      </Layout>
    );

  return (
    <LayoutNoAuth>
      <div className="text-3xl text-center text-victoria-600">
        This page is not accessible in production
      </div>
    </LayoutNoAuth>
  );
};

MaintenancePage.auth = {
  role: "super",
  loading: <LoadingSkeleton />,
  unauthorized: "/auth/unauthorized",
};

export default MaintenancePage;
