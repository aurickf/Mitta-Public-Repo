import Footer from "@/components/Layout/Footer";
import { useSession } from "next-auth/react";

import { Card } from "primereact/card";
import TopMenu from "./TopMenu";

const LayoutNoAuth = (props) => {
  const { data: session } = useSession();

  if (session)
    return (
      <div>
        <TopMenu />
        <div className="w-11/12 md:w-8/12 lg:w-6/12 mx-auto mt-4 border-wisteria-100">
          <Card className="mt-28 mb-16">
            <div>{props.children}</div>
          </Card>
        </div>
        <Footer />
      </div>
    );

  return (
    <div>
      <div className="w-11/12 md:w-8/12 lg:w-6/12 mx-auto mt-4 border-wisteria-100">
        <Card className="mt-5 mb-16">
          <div>{props.children}</div>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default LayoutNoAuth;
