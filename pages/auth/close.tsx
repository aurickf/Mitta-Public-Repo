import Layout from "@/components/Layout/Layout";
import { Card } from "primereact/card";
import { useEffect } from "react";

const ClosePage = () => {
  useEffect(() => {
    window.open("", "_self");
    window.close();
  }, []);

  return (
    <Layout>
      <div className="my-3 text-center ">
        <Card className="w-full md:w-8/12 w-6/12 mx-auto bg-white/70 text-800">
          <div className="text-lg">Sign in completed</div>
          <div className="my-4">You can now close this window.</div>
        </Card>
      </div>
    </Layout>
  );
};

ClosePage.auth = {
  role: "private",
  loading: <></>,
  unauthorized: "/auth/unauthorized",
};

export default ClosePage;
