import { useSession } from "next-auth/react";
import router from "next/router";
import { useEffect } from "react";
import Footer from "./Footer";
import styles from "./Layout.module.css";
import TopMenu from "./TopMenu";

const Layout = (props) => {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session.user?.access?.approval?.isApproved || !session.user?.phone) {
      /**
       * Redirect to complete profile
       */
      router.push("/auth/complete-profile");
    } else if (
      !(session.user?.role?.isInstructor || session.user?.role?.isAdmin) &&
      !session.user?.membership?.latest
    ) {
      /*
       * Redirect Paywall
       * if user does not have membership, is not instructor or admin
       */
      // router.push("/auth/request-membership");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <TopMenu />
      <div className={styles.mainDiv}>
        <main className="w-full md:w-11/12 pt-28 pb-10 mx-auto">
          {props.children}
        </main>
      </div>
      <Footer />
    </div>
  );
  // }
};

export default Layout;
