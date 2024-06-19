import LayoutNoAuth from "@/components/Layout/LayoutNoAuth";
import ShareClass from "@/components/RegularClass/ShareClass";
import StudioLogo from "@/components/UI/StudioLogo";
import studioLogo from "@/image/logo.png";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { sortDate } from "@/utils/sort";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { FacebookShareButton } from "react-share";
import { SeriesTitle } from "src/api";
import { RegularClass, SpecialEvent } from "src/generated/graphql";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;
  const { title } = params as {
    title: string;
  };

  let data;

  try {
    data = await SeriesTitle({
      title,
    });
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
  }

  if (!data) {
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

const ShareSeriesPage = (props) => {
  const router = useRouter();
  const toast = useRef<Toast>(null);

  const dataset = props;

  const classes = [
    ...dataset.data.seriesTitle.regularClass,
    ...dataset.data.seriesTitle.specialEvent,
  ];
  classes.sort(sortDate);

  const { title, description } = dataset.data.seriesTitle;
  const plainUrl = process.env.NEXT_PUBLIC_APP_URL + router.asPath;
  const pageUrl = new URL(plainUrl);
  const encodedPageUrl = encodeURIComponent(pageUrl.href);

  const whatsappText = `Let's join *${title} series*.%0a%0aPlease register yourself at ${encodedPageUrl}`;

  return (
    <LayoutNoAuth>
      <Toast ref={toast}></Toast>

      <Head>
        <title>{`${title} at ${process.env.NEXT_PUBLIC_STUDIO_NAME}`}</title>
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
        <meta
          property="og:title"
          content={`${title} at ${process.env.NEXT_PUBLIC_STUDIO_NAME}`}
        />
        <meta property="og:description" content={description} />
        <meta
          property="og:quote"
          content={`Let's join ${title} at ${process.env.NEXT_PUBLIC_STUDIO_NAME}`}
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
      <div className="series-info p-4 rounded">
        <div className="text-2xl md:text-3xl text-center">{title}</div>
        <div className="text-base md:text-xl text-center">{description}</div>
      </div>
      {classes.map((event: RegularClass | SpecialEvent, i: number) => {
        return <ShareClass key={i} event={event} toast={toast} />;
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
            quote={`Join ${title} series at ${process.env.NEXT_PUBLIC_STUDIO_NAME}`}
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

ShareSeriesPage.auth = {
  role: "public",
};

export default ShareSeriesPage;
