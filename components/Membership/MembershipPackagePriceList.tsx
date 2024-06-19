import { ProgressSpinner } from "primereact/progressspinner";
import { useQuery } from "react-query";
import { MembershipFormData } from "src/api";

const MembershipPackagePriceList = () => {
  const dataset = useQuery(["MembershipFormData"], () => MembershipFormData());

  if (dataset.isLoading)
    return (
      <div className="text-center">
        <ProgressSpinner />
      </div>
    );

  return (
    <>
      <div className="w-full hidden md:table">
        <div className="table-header-group price-list-bg price-list-package">
          <div className="table-row">
            <div className="table-cell py-2 text-center border-y-2 price-list-border">
              Package Name
            </div>
            <div className="table-cell py-2 text-center border-y-2 price-list-border">
              Additional Points
            </div>
            <div className="table-cell py-2 text-center border-y-2 price-list-border">
              Price
            </div>
            <div className="table-cell py-2 text-center border-y-2 price-list-border">
              Validity
            </div>
          </div>
        </div>
        {dataset.data?.activeMembershipPackages.map((membershipPackage, i) => {
          return (
            <div key={i} className="table-row my-auto  ">
              <div className="table-cell border-b price-list-border py-2">
                {membershipPackage.name}
              </div>
              <div className="table-cell border-b price-list-border py-2 text-right">
                {membershipPackage.additional} points
              </div>
              <div className="table-cell border-b price-list-border py-2 text-right">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  maximumFractionDigits: 0,
                }).format(membershipPackage.price)}
              </div>
              <div className="table-cell border-b price-list-border py-2 text-right">
                {membershipPackage.validity} days
              </div>
            </div>
          );
        })}
      </div>
      <div className="w-full md:hidden inline">
        {dataset.data?.activeMembershipPackages.map((membershipPackage, i) => {
          return (
            <div
              key={i}
              className=" w-full sm:w-8/12 mx-auto my-2 rounded-md border price-list-bg price-list-border"
            >
              <div className="text-center py-2 rounded-t-md price-list-bg price-list-package">
                {membershipPackage.name}
              </div>
              <div className="flex flex-wrap justify-around p-2">
                <div className="my-auto">
                  <div className="text-xl">
                    {membershipPackage.additional} points
                  </div>
                </div>
                <div className="my-auto text-center">
                  <div className="text-gray-600 text-xs italic">Valid for</div>
                  <div>{membershipPackage.validity} days</div>
                </div>
              </div>
              <div className="italic text-center p-2 text-xl price-list-price">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  maximumFractionDigits: 0,
                }).format(membershipPackage.price)}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default MembershipPackagePriceList;
