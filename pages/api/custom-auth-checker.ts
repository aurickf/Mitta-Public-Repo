import { AccessException, accessError } from "@/utils/error_message";
import { Session } from "next-auth";
import { AuthChecker } from "type-graphql";

export const customAuthChecker: AuthChecker<Session> = (
  { root, args, context, info },
  roles
) => {
  const userIsAdmin = context?.user?.role?.isAdmin;
  const userIsInstructor = context?.user?.role?.isInstructor;
  const userIsSuperAdmin = context?.user?.role?.isSuperAdmin;

  /**
   * @Authorized(["SUPER"])
   */
  if (userIsSuperAdmin) return true;
  /**
   * @Authorized(["ADMIN"])
   */
  if (
    userIsAdmin &&
    (roles.some((role) => role === "ADMIN") ||
      roles.some((role) => role === "INSTRUCTOR"))
  )
    return true;
  /**
   * @Authorized(["INSTRUCTOR"])
   */
  if (userIsInstructor && roles.some((role) => role === "INSTRUCTOR"))
    return true;
  /**
   * @Authorized()
   */
  if (context.user !== undefined && roles.length === 0) return true;

  throw new AccessException(accessError.INVALID_ACCESS);
};
