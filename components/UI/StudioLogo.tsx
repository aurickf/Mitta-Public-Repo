import React from "react";
import studioLogo from "@/image/logo.png";
import Image from "next/image";

const StudioLogo = () => {
  return (
    <div className="text-center my-3">
      <Image
        src={studioLogo}
        alt={process.env.NEXT_PUBLIC_STUDIO_NAME}
        priority
        height={120}
        width={120}
      />
    </div>
  );
};

export default StudioLogo;
