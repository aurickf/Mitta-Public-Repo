import { DataView } from "primereact/dataview";
import { Image } from "primereact/image";
import { Inplace, InplaceContent, InplaceDisplay } from "primereact/inplace";
import { Tag } from "primereact/tag";
import { useQuery } from "react-query";
import { MembershipsByUser } from "src/api";
import { Membership } from "src/generated/graphql";
import DTFormat from "../UI/DTFormat";

interface IMembershipHistory {
  userId: string;
}

const itemTemplate = (membership: Membership) => {
  return (
    <div className="w-full py-3 px-2 my-2 rounded border-1 shadow-1 membership-history">
      <div className="flex justify-between">
        <div className="text-sm italic text-gray-600 my-auto">
          Requested on <DTFormat value={membership.createdAt} />
        </div>
        <div>
          <Tag value={membership.note} />
        </div>
      </div>
      <div className="flex justify-between pt-2">
        <div className="text-sm italic text-gray-600 my-auto">Status</div>
        <div>
          {membership.verified.isVerified && <Tag value="Approved" />}
          {membership.verified.isVerified === false && (
            <Tag value="Rejected" severity="danger" />
          )}
          {membership.verified.isVerified === null && (
            <Tag value="Pending" severity="warning" />
          )}
        </div>
      </div>
      {membership.verified.isVerified && (
        <div className="flex justify-between pt-2">
          <div className="text-sm italic text-gray-600 my-auto">
            Valid until
          </div>
          <div>
            <DTFormat value={membership.balance.validUntil} dateOnly />
          </div>
        </div>
      )}

      {membership.verified.isVerified === false && (
        <div className="flex justify-between pt-2">
          <div className="text-sm italic text-gray-600 my-auto">
            Rejection reason
          </div>
          <div>{membership.verified.reason}</div>
        </div>
      )}

      <div className="text-center pt-4">
        <Inplace>
          <InplaceDisplay>
            <span className="text-sm text-gray-600">Request Details</span>
          </InplaceDisplay>
          <InplaceContent>
            <div className="surface-50 p-2 border-1 border-gray-400 rounded-lg">
              <div className="flex gap-2 justify-between">
                <div className="text-sm italic text-gray-600 my-auto">
                  Payment date
                </div>
                <div>
                  <DTFormat value={membership.payment.date} dateOnly />
                </div>
              </div>
              <div className="flex gap-2 justify-between pt-2">
                <div className="text-sm italic text-gray-600 my-auto">
                  Payment method & amount
                </div>
                <div>{`${membership.payment.method} - ${new Intl.NumberFormat(
                  "id-ID",
                  {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }
                ).format(membership.payment.amount)}`}</div>
              </div>
              <div className="flex justify-between pt-2">
                <div className="text-sm italic text-gray-600 my-auto">
                  Purchased
                </div>
                <div>{membership.balance.additional}</div>
              </div>
              {membership.verified.isVerified === null &&
                membership.payment.url && (
                  <div className="flex justify-between pt-2">
                    <div className="text-sm italic text-gray-600 my-auto">
                      Proof of payment
                    </div>
                    <div>
                      <Image
                        src={membership.payment.url}
                        alt="payment"
                        height="100px"
                        width="50px"
                        preview
                        downloadable
                      />
                    </div>
                  </div>
                )}
            </div>
          </InplaceContent>
        </Inplace>
      </div>
    </div>
  );
};

const MembershipHistory = ({ userId, ...props }: IMembershipHistory) => {
  const dataset = useQuery(
    ["membershipsByUser", userId],
    () => MembershipsByUser({ _id: userId }),
    {
      refetchOnMount: true,
    }
  );

  return (
    <DataView
      value={dataset.data?.membershipsByUser}
      layout="list"
      itemTemplate={itemTemplate}
      emptyMessage="You do not have membership yet"
      loading={dataset.isLoading}
    />
  );
};

export default MembershipHistory;
