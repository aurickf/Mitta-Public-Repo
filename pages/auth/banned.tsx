import LayoutNoAuth from "@/components/Layout/LayoutNoAuth";
import StudioLogo from "@/components/UI/StudioLogo";
import Head from "next/head";

const BannedPage = () => {
  return (
    <LayoutNoAuth>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <StudioLogo />
      <div className="text-center text-wisteria-500">
        You are account has been suspended.
      </div>
    </LayoutNoAuth>
  );
};

BannedPage.auth = {
  role: "public",
};

export default BannedPage;
