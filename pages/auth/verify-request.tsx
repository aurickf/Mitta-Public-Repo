import LayoutNoAuth from "@/components/Layout/LayoutNoAuth";
import StudioLogo from "@/components/UI/StudioLogo";
import Head from "next/head";

const VerifyRequestPage = () => {
  return (
    <LayoutNoAuth>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <StudioLogo />
      <div className="text-center text-wisteria-500">
        <div className="text-3xl my-3">Email Sent</div>
        <div>Please check your Inbox and Spam folder</div>
      </div>
    </LayoutNoAuth>
  );
};

VerifyRequestPage.auth = {
  role: "public",
};

export default VerifyRequestPage;
