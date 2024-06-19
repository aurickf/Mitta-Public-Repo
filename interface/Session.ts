import { Session, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { Membership, UserAccess, UserRole } from "src/generated/graphql";

export interface CustomUser extends Partial<User>, Partial<AdapterUser> {
  _id: string;
  phone: string;
  username: string;
  role: UserRole;
  access: UserAccess;
  membership: {
    isVIP: boolean;
    latest: Membership;
  };
}

export interface CustomSession extends Omit<Session, "user"> {
  user: CustomUser;
}
