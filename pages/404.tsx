import LayoutNoAuth from "@/components/Layout/LayoutNoAuth";
import StudioLogo from "@/components/UI/StudioLogo";
import Head from "next/head";
import Link from "next/link";
import { Button } from "primereact/button";
import animation404 from "@/image/404.json";
import Lottie from "lottie-react";

const Custom404 = () => {
  return (
    <LayoutNoAuth>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <StudioLogo />
      <div className="text-center text-wisteria-600">
        <div className="w-8/12 mx-auto mt-10 mb-5 relative">
          <Lottie animationData={animation404} loop={true} />
        </div>
        <div className="text-xl md:text-2xl lg:text-3xl xl:text-4xl my-10 py-1 bg-wisteria-200/50">{`You're lost, let's go home!`}</div>
        <Link href="../" passHref>
          <Button label="Take me home" icon="pi pi-home" />
        </Link>
      </div>
    </LayoutNoAuth>
  );
};

Custom404.auth = {
  role: "public",
};

export default Custom404;
