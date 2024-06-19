import Layout from "@/components/Layout/Layout";
import InstructorPerformance from "@/components/Report/InstructorPerformance";
import OverallBooking from "@/components/Report/OverallBooking";
import SpecialClass from "@/components/Report/SpecialClass";
import TopInstructor from "@/components/Report/TopInstructor";
import TopUser from "@/components/Report/TopUser";
import TopUserMembership from "@/components/Report/TopUserMembership";
import WeeklyBooking from "@/components/Report/WeeklyBooking";
import LoadingSkeleton from "@/components/UI/LoadingSkeleton";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Fieldset } from "primereact/fieldset";
import { Inplace, InplaceDisplay, InplaceContent } from "primereact/inplace";
import { useQuery } from "react-query";
import { FeatureAnalytics } from "src/api";
import FeatureInactive from "pages/auth/no-feature";

const clickToLoad = (
  <div className="w-full text-center text-white/50 hover:text-white">
    Click to load data
  </div>
);

const BookingReportPage = () => {
  const feature = useQuery("FeatureAnalytics", () => FeatureAnalytics());

  if (feature.isLoading) return <LoadingSkeleton />;

  if (!feature.data?.featureAnalytics?.isEnabled) return <FeatureInactive />;

  return (
    <Layout>
      <Card className="w-full bg-white/30 my-4">
        <div className="text-white font-light">
          To prevent heavy load on our database, this page content will only
          loaded upon clicking required section.
        </div>
      </Card>
      <div className="md:flex gap-2">
        <Fieldset
          legend="Overall Booking"
          className="w-full bg-white/30 mb-4"
          toggleable
        >
          <div className="report-legend">
            Overall booking since application launched.
          </div>
          <Inplace>
            <InplaceDisplay>{clickToLoad}</InplaceDisplay>
            <InplaceContent>
              <OverallBooking />
            </InplaceContent>
          </Inplace>
        </Fieldset>

        <Fieldset
          legend="Top Users"
          className="w-full bg-white/30 mb-4"
          toggleable
        >
          <div className="report-legend">
            Top 20 users based on points spent for selected booking status and
            time period.
          </div>
          <Inplace>
            <InplaceDisplay>{clickToLoad}</InplaceDisplay>
            <InplaceContent>
              <TopUser />
            </InplaceContent>
          </Inplace>
          <Divider />
          <div className="report-legend">
            Top 20 users based on verified membership purchase within selected
            time period.
          </div>
          <Inplace>
            <InplaceDisplay>{clickToLoad}</InplaceDisplay>
            <InplaceContent>
              <TopUserMembership />
            </InplaceContent>
          </Inplace>

          <Card className="bg-white/20 my-2">
            <div>Notes</div>
            <div className="text-xs">
              <ul className="list-disc ml-4">
                <li>
                  Time frame with prefix <span className="italic">this</span>{" "}
                  will populate bookings until end of selected period.
                </li>
                <li>
                  Status scheduled will show only small amount of numbers as it
                  will be changed upon instructor confirmation.
                </li>
              </ul>
            </div>
          </Card>
        </Fieldset>
      </div>
      <div className="md:flex gap-2 my-2">
        <Fieldset
          legend="Instructor Performance"
          className="w-full bg-white/30 mb-4"
          toggleable
        >
          <div className="report-legend">
            Instructor&apos;s class confirmation status.
          </div>
          <Inplace>
            <InplaceDisplay>{clickToLoad}</InplaceDisplay>
            <InplaceContent>
              <InstructorPerformance />
            </InplaceContent>
          </Inplace>
        </Fieldset>

        <Fieldset
          legend="Top Instructor"
          className="w-full bg-white/30 mb-4"
          toggleable
        >
          <div className="report-legend">
            Top instructors based on generated revenue and potential revenue.
          </div>
          <Inplace>
            <InplaceDisplay>{clickToLoad}</InplaceDisplay>
            <InplaceContent>
              <TopInstructor />
            </InplaceContent>
          </Inplace>
        </Fieldset>
      </div>
      <div>
        <Fieldset
          legend="Weekly Statistic"
          className="bg-white/30 mb-4"
          toggleable
        >
          <div className="report-legend">Weekly regular class statistic.</div>
          <Inplace>
            <InplaceDisplay>{clickToLoad}</InplaceDisplay>
            <InplaceContent>
              <WeeklyBooking />
            </InplaceContent>
          </Inplace>
        </Fieldset>
      </div>
      <div className="my-2">
        <Fieldset
          legend="Special Class Analytics"
          className="w-full bg-white/30 mb-4"
          toggleable
        >
          <div className="report-legend">Special class confirmed seat.</div>
          <Inplace>
            <InplaceDisplay>{clickToLoad}</InplaceDisplay>
            <InplaceContent>
              <SpecialClass />
            </InplaceContent>
          </Inplace>
        </Fieldset>
      </div>
    </Layout>
  );
};

BookingReportPage.auth = {
  role: "admin",
  loading: <LoadingSkeleton />,
  unauthorized: "/auth/unauthorized",
};

export default BookingReportPage;
