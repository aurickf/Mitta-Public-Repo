import { Membership, User } from "src/generated/graphql";

export interface IMembershipCardProps {
  isLoading: Boolean;
  value: Partial<Membership>;
  onRequestHandler?: () => any;
  onViewHandler?: () => any;
}
