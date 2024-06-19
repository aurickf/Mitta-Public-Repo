import LayoutNoAuth from "@/components/Layout/LayoutNoAuth";
import StudioLogo from "@/components/UI/StudioLogo";
import { signOut } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Button } from "primereact/button";

const UnauthorizedPage = () => {
  const router = useRouter();

  return (
    <LayoutNoAuth>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <StudioLogo />
      <div className="text-center">
        <div className="text-xl text-victoria-600">
          You are not authorized to view this page.
        </div>
        <div>
          <Button
            className="my-3"
            label="Go back to previous page"
            onClick={() => router.back()}
          />
        </div>
        <div>
          <Button
            className="my-3 p-button-outlined"
            label="Sign in with different account"
            onClick={() => signOut()}
          />
        </div>
      </div>
    </LayoutNoAuth>
  );
};

UnauthorizedPage.auth = {
  role: "public",
};

export default UnauthorizedPage;
