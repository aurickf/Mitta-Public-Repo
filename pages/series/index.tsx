import LayoutNoAuth from "@/components/Layout/LayoutNoAuth";
import StudioLogo from "@/components/UI/StudioLogo";
import studioLogo from "@/image/logo.png";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { FacebookShareButton } from "react-share";
import { AllPublishedSeries } from "src/api";
import { Series } from "src/generated/graphql";
import Link from "next/link";

export const getServerSideProps: GetServerSideProps = async (context) => {
  let data;

  try {
    data = await AllPublishedSeries();
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
  }

  if (data.allPublishedSeries.length === 0) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      data,
    },
  };
};

const IndexSeriesPage = (props) => {
  const router = useRouter();
  const toast = useRef<Toast>(null);

  const dataset = props;

  const plainUrl = process.env.NEXT_PUBLIC_APP_URL + router.asPath;
  const pageUrl = new URL(plainUrl);
  const encodedPageUrl = encodeURIComponent(pageUrl.href);

  const whatsappText = `Check available class series at ${process.env.NEXT_PUBLIC_STUDIO_NAME}.%0a%0a ${encodedPageUrl}`;

  const title = `Available class series at ${process.env.NEXT_PUBLIC_STUDIO_NAME}`;
  const description = `Available class series at ${process.env.NEXT_PUBLIC_STUDIO_NAME}`;

  return (
    <LayoutNoAuth>
      <Toast ref={toast}></Toast>

      <Head>
        <title>{title}</title>
        <meta name="description" key="description" content={description} />
        {/* <meta name="keywords" key="keywords" content={tags} />
        <meta
          name="instructors"
          key="instructors"
          content={metadata.instructors.toString()}
        /> */}
        <meta
          property="image"
          content={`${process.env.NEXT_PUBLIC_APP_URL}${studioLogo.src}`}
        />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta
          property="og:quote"
          content={`Let's join class series at ${process.env.NEXT_PUBLIC_STUDIO_NAME}`}
        />
        {/* <meta property="og:hashtag" content={hashtag} /> */}
        <meta
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_APP_URL}${studioLogo.src}`}
        />
        <meta property="og:image:type" content="image/*" />
        <meta property="og:url" content={plainUrl} />
        <meta
          property="og:site_name"
          content={process.env.NEXT_PUBLIC_APP_NAME}
        />
        <meta
          property="fb:app_id"
          content={process.env.NEXT_PUBLIC_FB_APP_ID}
        />
      </Head>
      <StudioLogo />
      {/* Content */}

      {dataset.data.allPublishedSeries.map((series: Series, i: number) => {
        return (
          <Link key={i} href={`/series/${series.title}`}>
            <div className="list-element">
              <div className="text-2xl md:text-3xl ">{series.title}</div>
              <div className="text-base md:text-xl">{series.description}</div>
            </div>
          </Link>
        );
      })}

      {/* Social Media Share */}
      <div className="p-2">
        <div className="text-sm text-right mr-2 italic my-auto text-500">
          Share this page
        </div>
        <div className="flex justify-end">
          <CopyToClipboard text={plainUrl}>
            <Button
              className="p-button-link"
              aria-label="Copy page link"
              onClick={() =>
                toast.current.show({
                  severity: "info",
                  summary: "Link copied to clipboard",
                  detail: plainUrl,
                })
              }
            >
              <i className="pi pi-share-alt" />
            </Button>
          </CopyToClipboard>
          <FacebookShareButton
            url={plainUrl}
            quote={`Join class series at ${process.env.NEXT_PUBLIC_STUDIO_NAME}`}
          >
            <i className="pi pi-facebook p-button p-button-link" />
          </FacebookShareButton>
          <div>
            <Button
              className="p-button-link"
              aria-label="Share to Whatsapp"
              onClick={() => {
                window.open(
                  `https://api.whatsapp.com/send?text=${whatsappText}`
                );
              }}
            >
              <span className="pi pi-whatsapp" />
            </Button>
          </div>
        </div>
      </div>
    </LayoutNoAuth>
  );
};

IndexSeriesPage.auth = {
  role: "public",
};

export default IndexSeriesPage;
