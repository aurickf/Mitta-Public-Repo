import LayoutNoAuth from "@/components/Layout/LayoutNoAuth";
import StudioLogo from "@/components/UI/StudioLogo";
import { signOut } from "next-auth/react";
import { Button } from "primereact/button";

const LogoutPage = () => {
  return (
    <LayoutNoAuth>
      <StudioLogo />
      <div className="text-center">
        <div className="text-3xl my-3">Sign Out</div>
        <div className="my-3">Are you sure you want to sign out?</div>
        <div>
          <Button label="Sign Out" onClick={() => signOut()} />
        </div>
      </div>
    </LayoutNoAuth>
  );
};

LogoutPage.auth = {
  role: "private",
  loading: <></>,
  unauthorized: "/auth/unauthorized",
};

export default LogoutPage;
