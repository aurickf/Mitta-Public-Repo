import React from "react";
import FaqAdminGeneral from "./FaqAdminGeneral.mdx";
import FaqAdminLimitation from "./FaqAdminLimitation.mdx";
import FaqAdminBestPractice from "./FaqAdminBestPractice.mdx";
import FaqAdminDataRetention from "./FaqAdminDataRetention.mdx";
import FaqAdminRoleAndAccess from "./FaqAdminRoleAndAccess.mdx";
import FaqAdminMembership from "./FaqAdminMembership.mdx";
import FaqAdminBooking from "./FaqAdminBooking.mdx";
import FaqAdminSchedule from "./FaqAdminSchedule.mdx";
import { Divider } from "primereact/divider";

const FaqAdmin = () => {
  return (
    <div>
      <FaqAdminGeneral />
      <Divider />
      <FaqAdminRoleAndAccess />
      <Divider />
      <FaqAdminSchedule />
      <Divider />
      <FaqAdminMembership />
      <Divider />
      <FaqAdminBooking />
      <Divider />
      <FaqAdminLimitation />
      <Divider />
      <FaqAdminBestPractice />
      <Divider />
      <FaqAdminDataRetention />
    </div>
  );
};

export default FaqAdmin;
