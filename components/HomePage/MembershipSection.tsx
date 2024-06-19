import { useSession } from "next-auth/react";
import { Dialog } from "primereact/dialog";
import { useState } from "react";
import { useQuery } from "react-query";
import { MembershipSectionQuery } from "src/api";
import { Membership } from "src/generated/graphql";
import MembershipForm from "../Form/MembershipForm";
import MembershipCard from "../Membership/MembershipCard";
import MembershipHistory from "../Membership/MembershipHistory";
import { useRouter } from "next/router";

const MembershipSection = (props) => {
  const { toast } = props;
  const { data: session } = useSession();
  const router = useRouter();

  const dataset = useQuery(
    ["MembershipSection", session.user?._id],
    () =>
      MembershipSectionQuery({
        userId: session.user?._id,
      }),
    {
      enabled: !!session.user?._id,
      refetchOnMount: true,
    }
  );

  const [showMembershipForm, setShowMembershipForm] = useState(false);
  const [showMembershipHistory, setShowMembershipHistory] = useState(false);

  const onSubmitSuccess = () => {
    setShowMembershipForm(false);
    toast.current.show({ severity: "success", detail: "Request Submitted" });
    if (!session.user.membership.latest) {
      toast.current.show({
        severity: "success",
        detail: "Request submitted, reloading page",
      });
      setTimeout(() => {
        router.reload();
      }, 2000);
    }
  };

  const onSubmitError = (error) => {
    toast.current.show({
      severity: "error",
      summary: "Failed",
      detail: `${error.message}`,
    });
  };

  return (
    <div className="max-w-md mx-auto">
      <MembershipCard
        isLoading={dataset.isLoading}
        value={dataset.data?.latestUserMembership as Partial<Membership>}
        onRequestHandler={() => {
          setShowMembershipForm(true);
        }}
        onViewHandler={() => {
          setShowMembershipHistory(true);
        }}
      />
      <Dialog
        header="Purchase Validation"
        visible={showMembershipForm}
        onHide={() => setShowMembershipForm(false)}
        className="w-full md:w-8/12 lg:w-7/12"
      >
        <MembershipForm
          userId={session?.user?._id}
          onSuccess={onSubmitSuccess}
          onError={onSubmitError}
        />
      </Dialog>
      <Dialog
        header="Request Validation History"
        visible={showMembershipHistory}
        onHide={() => {
          setShowMembershipHistory(false);
        }}
        className="w-full md:w-6/12 lg:w-5/12 xl:w-4/12"
      >
        <MembershipHistory userId={session?.user?._id} />
      </Dialog>
    </div>
  );
};

export default MembershipSection;
