import "@fullcalendar/common/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/list/main.css";
import "@fullcalendar/timegrid/main.css";

import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/md-light-deeppurple/theme.css";

import "../styles/globals.css";

import LayoutNoAuth from "@/components/Layout/LayoutNoAuth";
import {
  Heading,
  OrderedList,
  ResponsiveImage,
  Text,
  UnorderedList,
  Url,
} from "@/components/Mdx";
import { MDXProvider } from "@mdx-js/react";
import { ErrorBoundary } from "@sentry/nextjs";
import { SessionProvider, useSession } from "next-auth/react";
import Head from "next/head";
import router from "next/router";
import { updateLocaleOption } from "primereact/api";
import { Button } from "primereact/button";
import { useEffect } from "react";
import { Hydrate, QueryClientProvider } from "react-query";
import { queryClient } from "../src/api";

export default function MyApp({
  Component,
  pageProps: { session, dehydratedState, ...pageProps },
}) {
  /**
   * Reference:
   * https://mdxjs.com/table-of-components/
   */
  const components = {
    img: ResponsiveImage,
    h1: Heading.H1,
    h2: Heading.H2,
    h3: Heading.H3,
    h4: Heading.H4,
    h5: Heading.H5,
    h6: Heading.H6,
    p: Text,
    a: Url,
    ol: OrderedList,
    ul: UnorderedList,
    // pre: Pre,
    // code: InlineCode,
  };

  useEffect(() => {
    updateLocaleOption("firstDayOfWeek", 1, "en");
  }, []);

  const fallback = ({ error, componentStack, resetError }) => {
    return (
      <LayoutNoAuth>
        <Head>
          <meta name="robots" content="noindex" />
        </Head>
        <div className="text-center">
          <div>An error has occured.</div>
          <div>{error.toString()}</div>
          <div>{componentStack}</div>
          <div>
            <Button onClick={() => resetError()} label="Refresh" />
          </div>
        </div>
      </LayoutNoAuth>
    );
  };

  return (
    <SessionProvider session={session}>
      <Head>
        <title>{process.env.NEXT_PUBLIC_APPLICATION_NAME}</title>
        <link rel="icon" href="/favicon.ico"></link>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="application-name"
          content={process.env.NEXT_PUBLIC_APPLICATION_NAME}
        />
      </Head>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={dehydratedState}>
          <ErrorBoundary fallback={fallback}>
            {Component.auth?.role !== "public" ? (
              <Auth
                role={Component.auth?.role}
                loading={Component.auth?.loading}
                unauthorized={Component.auth?.unauthorized}
              >
                <MDXProvider components={components}>
                  <Component {...pageProps} />
                </MDXProvider>
              </Auth>
            ) : (
              <MDXProvider components={components}>
                <Component {...pageProps} />
              </MDXProvider>
            )}
          </ErrorBoundary>
        </Hydrate>
      </QueryClientProvider>
    </SessionProvider>
  );
}

function Auth({ role, loading, unauthorized, children }) {
  const { data: session, status } = useSession({
    required: true,
  });

  if (status === "loading") return loading;

  if (role === "super" && session?.user?.role?.isSuperAdmin) return children;
  if (
    (role === "admin" && session?.user?.role?.isAdmin) ||
    session?.user?.role?.isSuperAdmin
  )
    return children;
  if (
    role === "instructor" &&
    (session?.user?.role?.isInstructor ||
      session?.user?.role?.isAdmin ||
      session?.user?.role?.isSuperAdmin)
  )
    return children;
  if (role === "private" && status === "authenticated") return children;

  router.replace(unauthorized);
}
