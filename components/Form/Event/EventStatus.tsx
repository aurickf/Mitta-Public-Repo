import React from "react";
import { InputSwitchForm } from "../InputForm";

const EventStatus = () => {
  return (
    <div className="flex justify-around my-3">
      <InputSwitchForm label="Publish" name="status.isPublished" />
      <InputSwitchForm label="VIP Only" name="status.isVIPOnly" />
    </div>
  );
};

export default EventStatus;
