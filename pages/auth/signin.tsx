import LayoutNoAuth from "@/components/Layout/LayoutNoAuth";
import StudioLogo from "@/components/UI/StudioLogo";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { Messages } from "primereact/messages";
import { useEffect, useRef, useState } from "react";
import { dehydrate, useQuery } from "react-query";
import { ActivePublicAnnouncements, queryClient } from "src/api";

const errorResponse = {
  OAuthAccountNotLinked:
    "Your current account is linked with different sign in provider. Please try another method.",
  EmailSignin: "Please provide your email to sign in with this method.",
  SessionRequired: "You have been logged out.",
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  await queryClient.prefetchQuery(["publicAnnouncement"], () =>
    ActivePublicAnnouncements()
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

const SignInPage = (props: GetServerSidePropsContext) => {
  const { data: session } = useSession();
  const router = useRouter();
  const { error } = router.query;

  const [email, setEmail] = useState("");

  const announcementRef = useRef<Messages>(null);
  const errorRef = useRef<Messages>(null);

  const [announcements, setAnnouncements] = useState([]);
  const announcementData = useQuery(["publicAnnouncement"], () =>
    ActivePublicAnnouncements()
  );

  useEffect(() => {
    if (session?.user) router.push("/");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  useEffect(() => {
    if (announcementData.isSuccess) {
      setAnnouncements(
        announcementData.data?.activePublicAnnouncements.map((item) => {
          return {
            severity: "info",
            sticky: true,
            detail: item.text,
          };
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [announcementData.data]);

  useEffect(() => {
    announcementRef.current?.show(announcements);
  }, [announcements]);

  useEffect(() => {
    if (error !== "SessionRequired")
      errorRef.current?.show({
        severity: error !== "SessionRequired" ? "error" : "info",
        detail: errorResponse[`${error}`] ?? "Sign in error has occured.",
        sticky: error !== "SessionRequired",
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const windowOpenSpecs = `status=yes,location=yes,toolbar=no`;

  return (
    <LayoutNoAuth>
      <Head>
        <meta
          name="description"
          key="description"
          content={`${process.env.NEXT_PUBLIC_STUDIO_NAME} offers various yoga classes. Our studio located on ${process.env.NEXT_PUBLIC_STUDIO_ADDRESS}. Create an account now and join our classes.`}
        />
      </Head>
      <StudioLogo />
      {announcements.length > 0 && <Messages ref={announcementRef} />}
      {error && (
        <div>
          <Messages ref={errorRef} />
        </div>
      )}
      <Divider type="solid" className="p-text-secondary" align="center">
        Sign in with
      </Divider>
      <div className="mt-5">
        <div className="w-full md:w-8/12 lg:w-7/12 mx-auto flex justify-around gap-1">
          <div>
            <Button
              id="loginWithGoogle"
              label="Google"
              icon="pi pi-google"
              onClick={() => {
                window.open("/auth/google", "_blank", windowOpenSpecs);
              }}
            />
          </div>
          <div>
            <Button
              id="loginWithFacebook"
              label="Facebook"
              icon="pi pi-facebook"
              onClick={() => {
                window.open("/auth/facebook", "_blank", windowOpenSpecs);
              }}
            />
          </div>
        </div>
        <Divider type="solid" className="p-text-secondary" align="center">
          or
        </Divider>
        <div className="w-full md:w-8/12 lg:w-7/12 text-center mx-auto">
          <span className="p-float-label">
            <InputText
              className="w-full"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="email">Email</label>
          </span>
        </div>
        <div className="text-center">
          <Button
            className="w-full md:w-8/12 lg:w-7/12 my-2"
            label="Sign In with Email"
            icon="pi pi-envelope"
            onClick={() => signIn("email", { email })}
          />
        </div>
      </div>
    </LayoutNoAuth>
  );
};

SignInPage.auth = {
  role: "public",
};

export default SignInPage;
