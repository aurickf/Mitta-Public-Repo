import LayoutNoAuth from "@/components/Layout/LayoutNoAuth";
import ShareClass from "@/components/RegularClass/ShareClass";
import StudioLogo from "@/components/UI/StudioLogo";
import studioLogo from "@/image/logo.png";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FacebookShareButton } from "react-share";
import { SearchClassTitleAndDate } from "src/api";
import { RegularClass, SpecialEvent } from "src/generated/graphql";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;
  const { classTitle, date } = params as {
    classTitle: string;
    date: string;
  };

  let data;

  try {
    data = await SearchClassTitleAndDate({
      classTitle: classTitle.split(" ").join("_"),
      date,
    });
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
  }

  if (data.searchClassTitleAndDate.length === 0) {
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

const ShareClassPage = (props) => {
  const router = useRouter();
  const toast = useRef<Toast>(null);

  const dataset = props;

  const plainUrl = process.env.NEXT_PUBLIC_APP_URL + router.asPath;
  const pageUrl = new URL(plainUrl);
  const encodedPageUrl = encodeURIComponent(pageUrl.href);

  const classes = dataset.data?.searchClassTitleAndDate;

  const classTitle = classes[0]?.details?.title.split("_").join(" ");

  // const metadata = classes.map((item) => {
  //   return {
  //     instructors: item.instructors.map((instructor) => instructor.name),
  //     tags: item.details.tag(),
  //   };
  // });

  // const tags = metadata.tags.toString();

  // const hashtag = tags.map((tag) => `#${tag.replace(/\s/g, "")}`).join(" ");

  const whatsappText = `Let's join *${classTitle}*.%0a%0aPlease register yourself at ${encodedPageUrl}`;

  return (
    <LayoutNoAuth>
      <Toast ref={toast}></Toast>
      <Head>
        <title>{`${classTitle} at ${process.env.NEXT_PUBLIC_STUDIO_NAME}`}</title>
        {/* <meta
          name="description"
          key="description"
          content={`${classes.details.description}`}
        />
        <meta name="keywords" key="keywords" content={tags} />
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
          content={`${classTitle} at ${process.env.NEXT_PUBLIC_STUDIO_NAME}`}
        />
        {/* <meta property="og:description" content={classes.details.description} /> */}
        <meta
          property="og:quote"
          content={`Let's join ${classTitle} at ${process.env.NEXT_PUBLIC_STUDIO_NAME}`}
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
            quote={`Join ${classTitle} at ${process.env.NEXT_PUBLIC_STUDIO_NAME}`}
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

ShareClassPage.auth = {
  role: "public",
};

export default ShareClassPage;
