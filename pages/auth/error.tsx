import LayoutNoAuth from "@/components/Layout/LayoutNoAuth";
import StudioLogo from "@/components/UI/StudioLogo";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "primereact/button";

const ErrorPage = () => {
  const router = useRouter();
  const { error } = router.query;

  return (
    <LayoutNoAuth>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <StudioLogo />
      <div className="text-center">
        <div className="text-wisteria-400  my-3">
          <div className="text-xl">Authentication Error</div>
          <div>{error}</div>
        </div>
        <div>
          <Link href="../" passHref>
            <Button label="Take me home" icon="pi pi-home p-button-sm" />
          </Link>
        </div>
      </div>
    </LayoutNoAuth>
  );
};

ErrorPage.auth = {
  role: "public",
};

export default ErrorPage;
