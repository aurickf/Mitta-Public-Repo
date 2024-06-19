import MembershipSection from "@/components/HomePage/MembershipSection";
import MyBookingSection from "@/components/HomePage/MyBookingSection";
import MyTeachingScheduleSection from "@/components/HomePage/MyTeachingScheduleSection";
import UpcomingClass from "@/components/HomePage/UpcomingClass";
import MembershipPackagePriceList from "@/components/Membership/MembershipPackagePriceList";
import RegularClassPriceList from "@/components/RegularClass/RegularClassPriceList";
import LoadingSkeleton from "@/components/UI/LoadingSkeleton";
import useSearchReducer from "@/hooks/useSearchReducer";
import { useSession } from "next-auth/react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import { Messages } from "primereact/messages";
import { SpeedDial } from "primereact/speeddial";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { ActivePrivateAnnouncements } from "src/api";
import Layout from "../components/Layout/Layout";
import { useRouter } from "next/router";
import { Tooltip } from "primereact/tooltip";

export default function HomePage() {
  const { data: session } = useSession();
  const haveLatestMembership = !!session.user.membership?.latest;

  const toast = useRef<Toast>(null);
  const messagesRef = useRef<Messages>(null);
  const { SearchYogaClass } = useSearchReducer();

  const [announcements, setAnnouncements] = useState([]);
  const announcementData = useQuery(["privateAnnouncement"], () =>
    ActivePrivateAnnouncements()
  );

  const router = useRouter();

  const speedDialItems = [
    {
      label: "My Booking",
      icon: "pi pi-book",
      command: () => router.push("/#my_booking"),
    },
    {
      label: "Membership",
      icon: "pi pi-id-card",
      command: () => router.push("/#my_membership"),
    },
  ];

  useEffect(() => {
    if (announcementData.isSuccess) {
      setAnnouncements(
        announcementData.data.activePrivateAnnouncements.map((item) => {
          return {
            severity: "info",
            detail: item.text,
            sticky: true,
            closable: false,
          };
        })
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [announcementData.data]);

  useEffect(() => {
    messagesRef.current?.show(announcements);
  }, [announcements]);

  const searchCardTitle = (
    <div className="text-right">
      <div className="md:hidden">
        <Button
          icon="pi pi-id-card"
          label="My Membership"
          onClick={() => setHideMembershipCard(!hideMembershipCard)}
          disabled={!haveLatestMembership}
        />
      </div>
      <Button
        label="Price List"
        className="p-button-text p-button-sm"
        icon="pi pi-info-circle"
        onClick={() => setShowPriceList(true)}
      />
    </div>
  );

  const [hideMembershipCard, setHideMembershipCard] = useState(true);
  const [showPriceList, setShowPriceList] = useState(false);

  return (
    <Layout>
      <Toast ref={toast} />

      <div className="md:w-11/12 lg:w-10/12 xl:w-9/12 mx-auto">
        {announcements.length > 0 && (
          <div className="bg-white/70 rounded-md px-4 py-2">
            <div className="text-gray-800 text-center text-xl">
              Announcements
            </div>
            <Messages ref={messagesRef} />
          </div>
        )}
        <div id="my_membership">
          <Card title={searchCardTitle} className="bg-white/60 my-2">
            <div className="md:flex gap-2">
              <div
                className={classNames({
                  "mb-3 mx-auto w-full md:w-5/12 lg:w-4/12 md:inline hidden mt-4 md:grow":
                    hideMembershipCard && haveLatestMembership,
                  "mb-3 mx-auto w-full md:w-5/12 lg:w-4/12 md:inline mt-4 text-center md:grow":
                    !hideMembershipCard || !haveLatestMembership,
                })}
              >
                <MembershipSection toast={toast} />
              </div>
              <div className="md:grow">
                <UpcomingClass toast={toast} />
              </div>
            </div>
          </Card>
        </div>
        {session.user?.role?.isInstructor && <MyTeachingScheduleSection />}
        <MyBookingSection toast={toast} />
        <Tooltip target=".speeddial-button .p-speeddial-action" />
        <SpeedDial
          showIcon="pi pi-caret-up"
          hideIcon="pi pi-times"
          model={speedDialItems}
          className="speeddial-button"
          radius={80}
          type="linear"
          direction="up"
          style={{ bottom: 50, left: "calc(50% - 2rem)", position: "fixed" }}
          buttonClassName="border border-violet-900 hover:border-white rounded-full md:hidden"
        />
      </div>
      <Dialog
        className="w-full md:w-8/12 lg:w-6/12 xl:w-5/12"
        visible={showPriceList}
        onHide={() => setShowPriceList(false)}
        header="Price List"
        blockScroll
      >
        <div className="mb-4">
          <div>
            We offer various packages, for both on line and in-person session.
          </div>
          <div>Below are the options :</div>
        </div>
        <MembershipPackagePriceList />
        <div className="sm:w-8/12 md:w-10/12 lg:w-8/12 mx-auto mt-6 mb-4">
          <RegularClassPriceList />
        </div>
      </Dialog>
    </Layout>
  );
}

HomePage.auth = {
  role: "private",
  loading: <LoadingSkeleton />,
  unauthorized: "/auth/unauthorized",
};
