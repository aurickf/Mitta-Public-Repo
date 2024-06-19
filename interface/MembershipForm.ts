import { Types } from "mongoose";
import { Membership } from "src/generated/graphql";

export interface MembershipFormProps {
  /**
   * by : ObjectId
   * admin userId
   */
  by?: Types.ObjectId;
  /**
   * userId : ObjectId
   * Membership owner
   */
  userId?: Types.ObjectId;
  /**
   * data : Membership data
   */
  data?: Membership;
  /**
   * adminMode : boolean
   * true : used by administrator for membership approval
   * false : used by user to request activation, or to request by admin on behalf of user
   */
  adminMode?: boolean;
  onSuccess: Function;
  onError?: Function;
}
