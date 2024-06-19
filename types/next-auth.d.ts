import NextAuth, { DefaultSession } from "next-auth";
import { Membership, UserAccess, UserRole } from "src/generated/graphql";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /**
       * User Id
       */
      _id: Types.ObjectId;
      /**
       * User phone number
       */
      phone: string;
      /**
       * Username
       */
      username: string;
      /**
       * Admin or instructor roles
       */
      role: UserRole;
      /**
       * User access
       */
      access: UserAccess;
      /**
       * User membership
       */
      membership: {
        /**
         * VIP user
         */
        isVIP: boolean;
        /**
         * Latest membership
         */
        latest: Membership;
      };
    } & DefaultSession["user"];
  }
}
