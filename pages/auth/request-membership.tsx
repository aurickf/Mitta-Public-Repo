import FaqUser from "@/components/Faq/FaqUser";
import MembershipForm from "@/components/Form/MembershipForm";
import LayoutNoAuth from "@/components/Layout/LayoutNoAuth";
import MembershipHistory from "@/components/Membership/MembershipHistory";
import { TimelineEvent } from "@/interface/TimelineEvent";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Inplace, InplaceContent, InplaceDisplay } from "primereact/inplace";
import { TabPanel, TabView } from "primereact/tabview";
import { Timeline } from "primereact/timeline";
import { Toast } from "primereact/toast";
import { Tooltip } from "primereact/tooltip";
import { useEffect, useRef } from "react";

const events: Array<TimelineEvent> = [
  {
    status: "Register",
    icon: "pi pi-file-edit",
    color: "text-color-secondary",
  },
  {
    status: "Complete Profile",
    icon: "pi pi-user-edit",
    color: "text-color-secondary",
  },
  {
    status: "Request Membership",
    icon: "pi pi-id-card",
    color: "text-primary",
  },
  {
    status: "Done",
    icon: "pi pi-check",
    color: "text-color-secondary",
  },
];

const customizedMarker = (item: TimelineEvent, i: number) => {
  return (
    <span className={`${item.color}`}>
      <Tooltip
        target={`#iconNum${i}`}
        content={item.status}
        position="top"
        className="md:hidden"
      />
      <i id={`iconNum${i}`} className={`${item.icon} text-xl`} />
    </span>
  );
};

const customizedContent = (item: TimelineEvent, i: number) => {
  return (
    <div className={`${item.color}  my-auto`}>
      <div className="">{i + 1}</div>
      <div className="text-xs hidden md:inline">{item.status}</div>
    </div>
  );
};

const RequestMembershipPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const toast = useRef<Toast>(null);

  const onSubmitSuccess = () => {
    toast.current.show({
      severity: "success",
      summary: "Done",
      detail: `Request Submitted. Please wait for our admin approval.`,
      life: 10 * 1000,
    });
  };

  const onSubmitError = (error) => {
    toast.current.show({
      severity: "error",
      summary: "Failed",
      detail: `${error.message}`,
    });
  };

  useEffect(() => {
    if (
      session.user.membership.latest ||
      session.user.role.isInstructor ||
      session.user.role.isAdmin
    )
      router.push("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LayoutNoAuth>
      <Toast ref={toast} />
      <TabView>
        <TabPanel header="Request Membership">
          <div className="bg-black/20 py-2 rounded-md text-center text-white/90 md:hidden">
            Hover to see details
          </div>
          <Timeline
            value={events}
            layout="horizontal"
            content={customizedContent}
            marker={customizedMarker}
          />
          <div className="my-3 text-sm text-700">
            You need to have a membership with us to access our content. Please
            submit a membership request below and kindly wait for its approval.
          </div>
          <MembershipForm
            userId={session?.user?._id}
            onSuccess={onSubmitSuccess}
            onError={onSubmitError}
          />
          <Inplace className="mt-3">
            <InplaceDisplay>
              <div className="text-center">
                <Button
                  className="p-button-text"
                  label="View Request History"
                />
              </div>
            </InplaceDisplay>
            <InplaceContent>
              <MembershipHistory userId={session.user._id} />
            </InplaceContent>
          </Inplace>
          <div className="text-center md:text-left">
            <Button
              type="button"
              className="p-button-text"
              label="Sign Out"
              onClick={() => signOut()}
            />
          </div>
        </TabPanel>
        <TabPanel header="FAQ">
          <FaqUser />
        </TabPanel>
      </TabView>
    </LayoutNoAuth>
  );
};

RequestMembershipPage.auth = {
  role: "private",
  loading: <></>,
  unauthorized: "/auth/unauthorized",
};

export default RequestMembershipPage;
