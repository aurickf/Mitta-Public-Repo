import ProfileForm from "@/components/Form/ProfileForm";
import LayoutNoAuth from "@/components/Layout/LayoutNoAuth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Card } from "primereact/card";
import { MenuItem } from "primereact/menuitem";
import { Messages } from "primereact/messages";
import { Steps } from "primereact/steps";
import { Toast } from "primereact/toast";
import { useEffect, useRef } from "react";

const events: Array<MenuItem> = [
  {
    label: "Register",
  },
  {
    label: "Complete Profile",
  },
  {
    label: "Done",
  },
];

const CompleteProfilePage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const toast = useRef<Toast>(null);

  const onSubmitSuccess = (message) => {
    toast.current.show({
      severity: "success",
      summary: "Done",
      detail: message,
    });

    router.reload();
  };

  const onSubmitError = (error) => {
    toast.current.show({
      severity: "error",
      summary: "Failed",
      detail: `${error.message}`,
    });
  };

  const messagesRef = useRef<Messages>(null);

  useEffect(() => {
    if (session.user?.access?.approval?.isApproved && session.user?.phone) {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LayoutNoAuth>
      <Toast ref={toast} />
      <Steps model={events} activeIndex={1} />
      <Messages ref={messagesRef} />
      <Card title="Complete Your Profile">
        <ProfileForm
          firstSignIn
          userId={session?.user?._id}
          onSuccess={onSubmitSuccess}
          onError={onSubmitError}
        />
      </Card>
    </LayoutNoAuth>
  );
};

CompleteProfilePage.auth = {
  role: "private",
  loading: <></>,
  unauthorized: "/auth/unauthorized",
};

export default CompleteProfilePage;
