import LayoutNoAuth from "@/components/Layout/LayoutNoAuth";
import LoadingSkeleton from "@/components/UI/LoadingSkeleton";
import React from "react";
import StudioLogo from "@/components/UI/StudioLogo";

const FeatureInactive = () => {
  return (
    <LayoutNoAuth>
      <div className="text-2xl text-wisteria-600 text-center">
        <StudioLogo />
        This feature is not available for your application.
      </div>
    </LayoutNoAuth>
  );
};

FeatureInactive.auth = {
  role: "admin",
  loading: <LoadingSkeleton />,
  unauthorized: "/auth/unauthorized",
};

export default FeatureInactive;
