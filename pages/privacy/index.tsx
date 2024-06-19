import LayoutNoAuth from "@/components/Layout/LayoutNoAuth";
import Policy from "@/components/Privacy/Policy";
import StudioLogo from "@/components/UI/StudioLogo";

const PrivacyPage = () => {
  return (
    <LayoutNoAuth>
      <StudioLogo />
      <Policy />
    </LayoutNoAuth>
  );
};

PrivacyPage.auth = {
  role: "public",
};

export default PrivacyPage;
