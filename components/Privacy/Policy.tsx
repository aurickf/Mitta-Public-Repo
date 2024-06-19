import React from "react";
import PolicyGeneral from "@/components/Privacy/PolicyGeneral.mdx";
import { Button } from "primereact/button";
import Link from "next/link";

const Policy = () => {
  return (
    <div>
      <PolicyGeneral />
      <div className="my-3 text-center">
        <Link href="../" passHref>
          <Button>Go To Login Page</Button>
        </Link>
      </div>
    </div>
  );
};

export default Policy;
