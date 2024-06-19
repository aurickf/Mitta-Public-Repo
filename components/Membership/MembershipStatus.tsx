import { Tag } from "primereact/tag";

const MembershipStatus = (props: { isActive: boolean }) => {
  const { isActive } = props;
  if (isActive) {
    return <Tag severity="success">Active Membership</Tag>;
  } else return <Tag severity="warning">Inactive Membership</Tag>;
};

export default MembershipStatus;
