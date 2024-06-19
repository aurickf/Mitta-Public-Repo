import FaqUserMembership from "./FaqUserMembership.mdx";
import FaqUserRegistration from "./FaqUserRegistration.mdx";
import FaqUserBooking from "./FaqUserBooking.mdx";
import FaqUserGeneral from "./FaqUserGeneral.mdx";
import FaqUserPriceList from "./FaqUserPriceList.mdx";
import { Divider } from "primereact/divider";

const FaqUser = () => {
  return (
    <div>
      <FaqUserRegistration />
      <Divider />
      <FaqUserPriceList />
      <Divider />
      <FaqUserMembership />
      <Divider />
      <FaqUserBooking />
      <Divider />
      <FaqUserGeneral />
    </div>
  );
};

export default FaqUser;
