import LayoutNoAuth from "@/components/Layout/LayoutNoAuth";
import StudioLogo from "@/components/UI/StudioLogo";
import Link from "next/link";
import { Button } from "primereact/button";
import { Card } from "primereact/card";

const MittaPage = () => {
  return (
    <LayoutNoAuth>
      <Card>
        <StudioLogo />
        <div className="text-xl">Welcome to Kalyana - MITTA</div>
        <i className="text-sm">
          Membership Integrated Timetable & Tracking App
        </i>
        <hr />
        <div className="my-5">
          <div>
            Kalyana Yoga Studio is using MITTA to integrate our membership
            programme and class reservation for our member.
            <br />
            By using this app, you can purchase membership, check schedule and
            also book our weekly class and special events.
          </div>
          <div className="my-3 text-center">
            <Link href="../" passHref>
              <Button>Go To Login Page</Button>
            </Link>
          </div>
        </div>
        <div className="text-sm text-right italic underline text-purple-600 mt-5">
          <Link href="/privacy" passHref>
            <Button link label="View our Privacy Policy" />
          </Link>
        </div>
      </Card>
    </LayoutNoAuth>
  );
};

MittaPage.auth = {
  role: "public",
};

export default MittaPage;
