import { IMembershipCardProps } from "interface/Membership";
import { DateTime } from "luxon";
import { useSession } from "next-auth/react";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { Skeleton } from "primereact/skeleton";
import { Tag } from "primereact/tag";
import { useState } from "react";
import styles from "./MembershipCard.module.css";

const animateMembershipData = (isLoading, data, returnValue = "0") => {
  if (isLoading) return <Skeleton height="1.5rem" width="1rem" />;
  if (data) return data;
  return returnValue;
};

const animateMembershipTag = ({
  isLoading,
  dataValidation,
  trueValue,
  falseValue = null,
}) => {
  if (isLoading) return <Skeleton height="2rem" width="3rem" />;

  if (dataValidation) {
    return <Tag>{trueValue}</Tag>;
  } else if (falseValue) return <Tag>{falseValue}</Tag>;
};

const MembershipCard = (props: IMembershipCardProps) => {
  const { data: session } = useSession();
  const { value: membership, isLoading } = props;

  const isVIP = session.user.membership?.isVIP || false;
  const haveLatestMembership = !!membership;

  const [showBalanceDetail, setShowBalanceDetail] = useState(false);

  return (
    <>
      <div className="w-full drop-shadow-lg">
        <div className=" md:text-lg lg:text-xl rounded-t-md px-2 py-2 font-light flex justify-between membership-header">
          <div className="flex">
            <div className="my-auto mr-2">Membership</div>
            {isLoading ? (
              <Skeleton className="h-2rem w-3rem" />
            ) : (
              isVIP && (
                <Badge
                  value="VIP"
                  severity="warning"
                  className="ml-2 my-auto"
                />
              )
            )}
          </div>
          {animateMembershipTag({
            dataValidation: membership?.verified?.isVerified,
            trueValue: membership?.note,
            isLoading,
          })}
        </div>
        {haveLatestMembership || isLoading ? (
          <div className={`flex ${styles.contentLayer}`}>
            <div className="w-full py-5 bg-white/80 my-auto">
              <div className="mx-4 md:mx-6 py-3 md:py-1 ">
                <div className="flex flex-wrap gap-2 justify-center mb-2 my-auto text-xl">
                  <div className="text-right my-auto text-gray-600">
                    Available
                  </div>
                  <div className="flex flex-wrap md:justify-center text-center">
                    <div className="my-auto membership-text">
                      {animateMembershipData(
                        isLoading,
                        membership?.balance?.available
                      )}
                    </div>
                    <Button
                      className="p-button-rounded p-button-text p-button-sm"
                      icon="pi pi-info-circle"
                      onClick={() => setShowBalanceDetail(true)}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-2 justify-center px-2 mt-2 text-xl">
                  <div className="mt-auto text-right text-gray-600">
                    Valid Until
                  </div>
                  <div className="mt-auto membership-text flex md:justify-end text-center">
                    {animateMembershipData(
                      isLoading,
                      DateTime.fromISO(
                        membership?.balance?.validUntil
                      ).toFormat("ccc, dd LLL yy")
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={`flex ${styles.contentLayer}`}>
            <div className="text-wisteria-50 bg-black/70 w-full h-12rem text-center my-auto relative">
              <div className="py-3 md:py-4 lg:py-5">
                <div className="py-3 px-6 text-base italic">
                  Submit your membership purchase validation to book our weekly
                  class
                </div>
                <div className="pb-2 text-xl">Click on left button below</div>
              </div>
              <div className="absolute bottom-0 left-0 pl-5 text-violet-500">
                <i className="pi pi-arrow-down text-3xl animate-bounce border rounded-full px-2 py-1 bg-violet-50/90" />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between rounded-b-md membership-footer">
          <div>
            <Button
              label="Request New"
              className="p-button-text p-button-sm"
              icon="pi pi-plus"
              onClick={props.onRequestHandler}
            />
          </div>
          <div>
            <Button
              label="View History"
              className="p-button-text p-button-sm"
              icon="pi pi-book"
              onClick={props.onViewHandler}
            />
          </div>
        </div>
      </div>

      <Dialog
        header="Balance Detail"
        className="w-full md:w-6/12 lg:w-4/12 xl:w-3/12"
        visible={showBalanceDetail}
        onHide={() => setShowBalanceDetail(false)}
      >
        <div className="align-content-between mb-5">
          <Divider align="right">Purchased</Divider>
          <div className="flex">
            <div className="align-self-center">
              <div>Carried from previous</div>
              <div className="text-xs italic">
                Unused balance from previous purchase
              </div>
            </div>
            <div className="text-2xl ml-auto">
              {animateMembershipData(
                isLoading,
                membership?.balance?.transferIn
              )}
            </div>
          </div>
          <div className="flex my-3">
            <div className="align-self-center">
              <div>Current purchase</div>
              <div className="text-xs italic">Your latest purchase</div>
            </div>
            <div className="text-2xl ml-auto">
              {animateMembershipData(
                isLoading,
                membership?.balance?.additional
              )}
            </div>
          </div>
          <Divider align="right">Usage</Divider>
          <div className="flex">
            <div className="align-self-center">
              <div className="flex">
                <div className="mr-1">
                  {animateMembershipData(
                    isLoading,
                    membership?.confirmed?.length
                  )}
                </div>
                <div>confirmed classes </div>
              </div>
              <div className="text-xs italic">Numbers of class you joined</div>
            </div>
            <div className="text-2xl ml-auto">
              {animateMembershipData(
                isLoading,
                membership?.balance?.totalConfirmedCost
              )}
            </div>
          </div>

          <div className="flex my-3">
            <div className="align-self-center">
              <div className="flex">
                <div className="mr-1">
                  {animateMembershipData(isLoading, membership?.booked?.length)}
                </div>
                <div>upcoming classes</div>
              </div>
              <div className="text-xs italic">
                Numbers of classes in progress
              </div>
            </div>
            <div className="text-2xl ml-auto">
              {animateMembershipData(
                isLoading,
                membership?.balance?.totalBookedCost
              )}
            </div>
          </div>

          <Divider />

          <div className="flex">
            <div className="align-self-center">
              Available
              <div className="text-xs italic">(Total of Purchased - Usage)</div>
            </div>
            <div className="text-2xl ml-auto px-2 py-1 rounded-md membership-text membership-text-bg">
              {animateMembershipData(isLoading, membership?.balance?.available)}
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default MembershipCard;
