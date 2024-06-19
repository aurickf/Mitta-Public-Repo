import Layout from "@/components/Layout/Layout";
import Setting from "@/components/Setting";
import LoadingSkeleton from "@/components/UI/LoadingSkeleton";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import {
  AddAnnouncement,
  AddHoliday,
  AddLevel,
  AddMembershipPackage,
  AddPaymentMethod,
  Announcements,
  DeleteAnnouncement,
  DeleteHoliday,
  DeleteLevel,
  DeleteMembershipPackage,
  DeletePaymentMethod,
  EditAnnouncement,
  EditHoliday,
  EditLevel,
  EditMembershipPackage,
  EditPaymentMethod,
  Holidays,
  Levels,
  MembershipPackages,
  PaymentMethods,
} from "src/api";

const announcementColumns = [
  {
    field: "isEnabled",
    header: "Enable",
    dataType: "boolean",
    label: "Enable",
  },
  {
    field: "isPrivate",
    header: "Private",
    label: "Publish in private area (require login)",
    dataType: "boolean",
  },
  {
    field: "isPublic",
    header: "Public",
    label: "Publish in public area (login page)",
    dataType: "boolean",
  },
  {
    field: "start",
    header: "Start",
    sortable: true,
    label: "Start",
    dataType: "date",
    rules: { required: "Start* (mandatory field)" },
  },
  {
    field: "end",
    header: "End",
    sortable: true,
    label: "End",
    dataType: "date",
  },
  {
    field: "text",
    header: "Text",
    sortable: true,
    label: "Text",
    rules: { required: "Text* (mandatory field)" },
  },
];

const holidayColumns = [
  {
    field: "isEnabled",
    header: "Enable",
    dataType: "boolean",
    label: "Enable",
  },
  {
    field: "start",
    header: "Start",
    sortable: true,
    label: "Start",
    dataType: "date",
    rules: { required: "Start* (mandatory field)" },
  },
  {
    field: "end",
    header: "End",
    sortable: true,
    label: "End",
    dataType: "date",
  },
  {
    field: "title",
    header: "Title",
    sortable: true,
    label: "Title",
  },
];

const levelColumns = [
  {
    field: "isEnabled",
    header: "Enable",
    dataType: "boolean",
    label: "Enable",
  },
  {
    field: "code",
    header: "Code",
    sortable: true,
    label: "Level code",
    defaultValue: "",
  },
  {
    field: "description",
    header: "Description",
    label: "Level description",
    defaultValue: "",
  },
];

const paymentColumns = [
  {
    field: "isEnabled",
    header: "Enable",
    dataType: "boolean",
    label: "Enable",
  },
  {
    field: "isEnabledForMembership",
    header: "Membership Payment",
    dataType: "boolean",
    label: "Membership Payment",
  },
  {
    field: "isEnabledForSpecialEvent",
    header: "Special Class Payment",
    dataType: "boolean",
    label: "Special Class Payment",
  },
  {
    field: "requireProof",
    header: "Require Proof of Payment",
    dataType: "boolean",
    label: "Require Proof of Payment",
  },
  {
    field: "via",
    header: "Via",
    sortable: true,
    label: "Payment method",
    defaultValue: "",
  },
];

const membershipPackageColumns = [
  {
    field: "isEnabled",
    header: "Enable",
    dataType: "boolean",
    label: "Enable",
  },
  {
    field: "name",
    header: "Name",
    sortable: true,
    defaultValue: "",
    label: "Name",
  },
  {
    field: "additional",
    header: "Additional points",
    sortable: true,
    defaultValue: 0,
    label: "Additional points",
    dataType: "numeric",
  },
  {
    field: "price",
    header: "Price",
    sortable: true,
    defaultValue: "",
    label: "Price in IDR",
    dataType: "numeric",
  },
  {
    field: "validity",
    header: "Validity",
    sortable: true,
    defaultValue: 7,
    label: "Validity (in days)",
    dataType: "numeric",
  },
];

const SettingsPage = () => {
  const toast = useRef<Toast>(null);

  const onSuccess = (message: String) => {
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
      detail: `${error.message}`,
    });
  };

  return (
    <Layout>
      <Toast ref={toast} />
      <div>
        <Setting
          title="Announcement"
          query={Announcements}
          mutation={{
            addMutation: AddAnnouncement,
            editMutation: EditAnnouncement,
            deleteMutation: DeleteAnnouncement,
          }}
          datakey="announcements"
          columns={announcementColumns}
          onSuccess={onSuccess}
          onError={onError}
        />
        <Setting
          title="Holiday"
          query={Holidays}
          mutation={{
            addMutation: AddHoliday,
            editMutation: EditHoliday,
            deleteMutation: DeleteHoliday,
          }}
          datakey="holidays"
          columns={holidayColumns}
          onSuccess={onSuccess}
          onError={onError}
        />
        <Setting
          title="Level"
          query={Levels}
          mutation={{
            addMutation: AddLevel,
            editMutation: EditLevel,
            deleteMutation: DeleteLevel,
          }}
          datakey="levels"
          columns={levelColumns}
          onSuccess={onSuccess}
          onError={onError}
        />
        <Setting
          title="Payment Method"
          query={PaymentMethods}
          mutation={{
            addMutation: AddPaymentMethod,
            editMutation: EditPaymentMethod,
            deleteMutation: DeletePaymentMethod,
          }}
          datakey="paymentMethods"
          columns={paymentColumns}
          onSuccess={onSuccess}
          onError={onError}
        />
        <Setting
          title="Membership Type"
          query={MembershipPackages}
          datakey="membershipPackages"
          mutation={{
            addMutation: AddMembershipPackage,
            editMutation: EditMembershipPackage,
            deleteMutation: DeleteMembershipPackage,
          }}
          columns={membershipPackageColumns}
          onSuccess={onSuccess}
          onError={onError}
        />
      </div>
    </Layout>
  );
};

SettingsPage.auth = {
  role: "admin",
  loading: <LoadingSkeleton />,
  unauthorized: "/auth/unauthorized",
};

export default SettingsPage;
