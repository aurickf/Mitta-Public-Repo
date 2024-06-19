import { IFeatureProps } from "@/interface/Feature";
import { Divider } from "primereact/divider";
import React from "react";

const Feature = ({
  name,
  description,
  featureKey,
  children,
}: IFeatureProps) => {
  return (
    <div className="my-4 p-2 rounded bg-wisteria-100">
      <div className="text-xl">{name}</div>
      <div className="text-xs">{description}</div>
      <div className="text-xs italic my-2 text-violet-800">{featureKey}</div>
      <Divider />
      <div>{children}</div>
    </div>
  );
};

export default Feature;
