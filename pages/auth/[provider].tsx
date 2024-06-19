import LayoutNoAuth from "@/components/Layout/LayoutNoAuth";
import StudioLogo from "@/components/UI/StudioLogo";
import { signIn } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { ProgressSpinner } from "primereact/progressspinner";
import { useEffect } from "react";

const LoadSignInPage = () => {
  const router = useRouter();
  const { provider } = router.query as { provider: string };

  const signingIn = async () => {
    await signIn(provider, { callbackUrl: "/auth/close" });
  };

  useEffect(() => {
    if (provider) {
      signIn(provider, { callbackUrl: "/auth/close" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider]);

  return (
    <LayoutNoAuth>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <StudioLogo />
      <div className="text-center">
        <div className="italic text-wisteria-500">
          {provider &&
            `Redirecting to ${provider[0].toUpperCase()}${provider.slice(
              1,
              provider.length
            )} ... `}
        </div>
        <ProgressSpinner />
      </div>
    </LayoutNoAuth>
  );
};

LoadSignInPage.auth = {
  role: "public",
};

export default LoadSignInPage;
