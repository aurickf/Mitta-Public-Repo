import FaqAdmin from "@/components/Faq/FaqAdmin";
import FaqHeader from "@/components/Faq/FaqHeader.mdx";
import FaqInstructor from "@/components/Faq/FaqInstructor";
import FaqUser from "@/components/Faq/FaqUser";
import Layout from "@/components/Layout/Layout";
import LayoutNoAuth from "@/components/Layout/LayoutNoAuth";
import StudioLogo from "@/components/UI/StudioLogo";
import { useSession } from "next-auth/react";
import { Card } from "primereact/card";
import { TabPanel, TabView } from "primereact/tabview";

const FaqPage = () => {
  const { data: session } = useSession();

  const cardClassNames = "w-full md:w-10/12 mx-auto bg-white/70";
  if (session)
    return (
      <Layout>
        <Card className={cardClassNames}>
          <FaqHeader />
          <TabView>
            <TabPanel header="Member">
              <FaqUser />
            </TabPanel>
            {(session.user.role.isInstructor || session.user.role.isAdmin) && (
              <TabPanel header="Instructor">
                <FaqInstructor />
              </TabPanel>
            )}
            {session.user.role.isAdmin && (
              <TabPanel header="Admin">
                <FaqAdmin />
              </TabPanel>
            )}
          </TabView>
        </Card>
      </Layout>
    );
  return (
    <LayoutNoAuth>
      <StudioLogo />
      <FaqHeader />
      <FaqUser />
    </LayoutNoAuth>
  );
};

FaqPage.auth = {
  role: "public",
};

export default FaqPage;
