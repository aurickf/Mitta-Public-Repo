import Layout from "@/components/Layout/Layout";
import DTFormat from "@/components/UI/DTFormat";
import LoadingSkeleton from "@/components/UI/LoadingSkeleton";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { DataView } from "primereact/dataview";
import { Divider } from "primereact/divider";
import { Image } from "primereact/image";
import { useQuery, useQueryClient } from "react-query";
import { ListEventBucketObjects, ListMembershipBucketObjects } from "src/api";

const ArchivedPage = () => {
  const datasetMembership = useQuery(
    ["listMembershipBucketObjects", "ARCHIVE"],
    () => ListMembershipBucketObjects({ mode: "ARCHIVE" })
  );

  const datasetEvent = useQuery(["listEventBucketObjects", "ARCHIVE"], () =>
    ListEventBucketObjects({ mode: "ARCHIVE" })
  );

  const itemTemplate = (item) => {
    return (
      <Card className="w-full md:w-4/12 mx-2 my-2">
        <div className="text-center w-full mb-2">
          <Image
            src={item.Key}
            alt={item.Key}
            preview
            downloadable
            width="150px"
            className="shadow-4"
          />
        </div>
        <div className="text-right my-auto w-full text-xs">
          <div className="mb-2 text-lg text-center my-4">{item.FileName}</div>
          <div>Uploaded on</div>
          <div className="text-sm">
            <DTFormat value={item.LastModified} dateOnly />
          </div>
          <div className="mt-2">
            <div>Size</div>
            <div className="text-sm">{Math.round(item.Size / 1024)} KB</div>
          </div>
        </div>
      </Card>
    );
  };

  const queryClient = useQueryClient();

  const title = (
    <div className="flex justify-between">
      <div>Archived Proof of Payment</div>
      <div>
        <Button
          label="Refresh"
          icon="pi pi-refresh"
          className="p-button-outlined"
          loading={datasetMembership.isLoading}
          onClick={() => {
            datasetMembership.refetch();
            queryClient.invalidateQueries(["listBucketObjects", "ARCHIVE"]);
          }}
        />
      </div>
    </div>
  );

  const subTitle =
    "Below proof of payment was already approved and scheduled for auto deletion.";

  const footer = (
    <div className="flex justify-between">
      {datasetMembership.data?.listMembershipBucketObjects && (
        <div className="italic text-sm my-auto">
          {
            datasetMembership.data?.listMembershipBucketObjects?.Contents
              ?.length
          }{" "}
          image(s) found
        </div>
      )}
    </div>
  );

  return (
    <Layout>
      <Card
        title={title}
        subTitle={subTitle}
        footer={footer}
        // className="bg-white/50 my-2"
      >
        <Divider>
          <div className="text-xl">Membership Payment</div>
        </Divider>
        <DataView
          value={datasetMembership.data?.listMembershipBucketObjects?.Contents}
          itemTemplate={itemTemplate}
          loading={datasetMembership.isLoading}
        />
        <Divider>
          <div className="text-xl">Special Class Payment</div>
        </Divider>
        <DataView
          value={datasetEvent.data?.listEventBucketObjects?.Contents}
          itemTemplate={itemTemplate}
          loading={datasetEvent.isLoading}
        />
      </Card>
    </Layout>
  );
};

ArchivedPage.auth = {
  role: "admin",
  loading: <LoadingSkeleton />,
  unauthorized: "/auth/unauthorized",
};

export default ArchivedPage;
