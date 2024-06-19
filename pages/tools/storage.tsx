import Layout from "@/components/Layout/Layout";
import DTFormat from "@/components/UI/DTFormat";
import LoadingSkeleton from "@/components/UI/LoadingSkeleton";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Image } from "primereact/image";
import { PickList } from "primereact/picklist";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  DeleteUnusedImages,
  ListEventBucketObjects,
  ListMembershipBucketObjects,
} from "src/api";

const StoragePage = () => {
  const [sourceMembership, setSourceMembership] = useState([]);
  const [sourceEvent, setSourceEvent] = useState([]);
  const [targetMembership, setTargetMembership] = useState([]);
  const [targetEvent, setTargetEvent] = useState([]);
  const toast = useRef<Toast>(null);

  const datasetMembership = useQuery(
    ["listMembershipBucketObjects", "CLEAN_UP"],
    () => ListMembershipBucketObjects({ mode: "CLEAN_UP" }),
    {
      onSuccess(data) {
        setSourceMembership(data.listMembershipBucketObjects.Contents);
      },
    }
  );

  const datasetEvent = useQuery(
    ["listEventBucketObjects", "CLEAN_UP"],
    () => ListEventBucketObjects({ mode: "CLEAN_UP" }),
    {
      onSuccess(data) {
        setSourceEvent(data.listEventBucketObjects.Contents);
      },
    }
  );
  const queryClient = useQueryClient();

  const deleteMutation = useMutation(DeleteUnusedImages, {
    onSuccess: () => {
      queryClient.invalidateQueries([
        "listMembershipBucketObjects",
        "CLEAN_UP",
      ]);
      queryClient.invalidateQueries(["listEventBucketObjects", "CLEAN_UP"]);
      setTargetMembership([]);
      setTargetEvent([]);
    },
  });

  const deleteHandler = async () => {
    try {
      const filteredTargetMembership = targetMembership.map((t) => {
        return t.FileName;
      });

      const filteredTargetEvent = targetEvent.map((t) => {
        return t.FileName;
      });

      await Promise.all([
        ...(filteredTargetMembership.length > 0
          ? [
              deleteMutation.mutateAsync({
                prefix: "payment/",
                fileNames: filteredTargetMembership,
              }),
            ]
          : []),
        ...(filteredTargetEvent.length > 0
          ? [
              deleteMutation.mutateAsync({
                prefix: "event/",
                fileNames: filteredTargetEvent,
              }),
            ]
          : []),
      ]);

      toast.current.show({
        severity: "success",
        summary: "Done",
        detail: `Selected images deleted`,
      });
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Failed",
        detail: `${error.message}`,
      });
    }
  };

  const onChangeMembership = (e) => {
    setSourceMembership(e.source);
    setTargetMembership(e.target);
  };

  const onChangeEvent = (e) => {
    setSourceEvent(e.source);
    setTargetEvent(e.target);
  };

  const itemTemplate = (item) => {
    return (
      <div className="flex justify-item-between">
        <div className="text-center w-full">
          <Image
            src={item.Key}
            alt={item.Key}
            preview
            downloadable
            width="150px"
            className="shadow-4"
          />
        </div>
        <div className="text-right ml-3 my-auto w-full text-xs">
          <div>Uploaded on</div>
          <div className="text-sm">
            <DTFormat value={item.LastModified} dateOnly />
          </div>
          <div className="mt-2 ">
            <div>Size</div>
            <div className="text-sm">{Math.round(item.Size / 1024)} KB</div>
          </div>
        </div>
      </div>
    );
  };

  const title = (
    <div className="flex justify-between">
      <div>Storage Cleanup</div>
      <div>
        <Button
          label="Refresh"
          icon="pi pi-refresh"
          className="p-button-outlined"
          loading={datasetMembership.isLoading}
          onClick={() => {
            queryClient.invalidateQueries([
              "listMembershipBucketObjects",
              "CLEAN_UP",
            ]);
            datasetMembership.refetch();
          }}
        />
      </div>
    </div>
  );

  const subTitle =
    "Below submitted images is not attached to any request and safe to be deleted.";

  const footer = (
    <div className="flex justify-between">
      {datasetMembership.data?.listMembershipBucketObjects && (
        <div className="italic text-sm my-auto">
          {datasetMembership.data?.listMembershipBucketObjects?.Contents
            ?.length +
            datasetEvent.data?.listEventBucketObjects?.Contents?.length}{" "}
          image(s) found
        </div>
      )}
      <div className="text-right">
        <Button
          label="Delete selected images"
          icon="pi pi-trash"
          className="p-button-danger"
          onClick={deleteHandler}
          loading={deleteMutation.isLoading}
          disabled={datasetMembership.isLoading}
        />
      </div>
    </div>
  );

  return (
    <Layout>
      <Toast ref={toast}></Toast>
      <Card
        title={title}
        subTitle={subTitle}
        footer={footer}
        className="bg-white/50 my-2"
      >
        {datasetMembership.isLoading ? (
          <div className="flex gap-4 px-4">
            <Skeleton className="w-6/12 h-10rem" />
            <Skeleton className="w-6/12 h-10rem" />
          </div>
        ) : (
          <PickList
            sourceHeader="Membership Proof of Payment"
            targetHeader="Selected images"
            itemTemplate={itemTemplate}
            source={sourceMembership}
            target={targetMembership}
            onChange={onChangeMembership}
          />
        )}
        <Divider />
        {datasetEvent.isLoading ? (
          <div className="flex gap-4 px-4">
            <Skeleton className="w-6/12 h-10rem" />
            <Skeleton className="w-6/12 h-10rem" />
          </div>
        ) : (
          <PickList
            sourceHeader="Event Registration Proof of Payment"
            targetHeader="Selected images"
            itemTemplate={itemTemplate}
            source={sourceEvent}
            target={targetEvent}
            onChange={onChangeEvent}
          />
        )}
      </Card>
    </Layout>
  );
};

StoragePage.auth = {
  role: "admin",
  loading: <LoadingSkeleton />,
  unauthorized: "/auth/unauthorized",
};

export default StoragePage;
