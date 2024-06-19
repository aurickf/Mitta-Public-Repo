import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { ProgressBar } from "primereact/progressbar";
import { useState } from "react";
import { useQuery } from "react-query";
import { TopUserMembershipReport } from "src/api";
import { dropdownTimeFrameOptions } from ".";

const TopUserMembership = () => {
  const [timeFrame, setTimeFrame] = useState("allTime");
  const dataset = useQuery(["topUserMembership", , timeFrame], () =>
    TopUserMembershipReport({ timeFrame })
  );

  const cardTitle = (
    <div className="flex gap-2 justify-end">
      <Dropdown
        value={timeFrame}
        options={dropdownTimeFrameOptions}
        onChange={(e) => setTimeFrame(e.value)}
      />
    </div>
  );

  return (
    <Card title={cardTitle} className="bg-white/80">
      <div className="w-full my-2">
        {dataset.isLoading && <ProgressBar mode="indeterminate" />}
        {dataset.data?.topUserMembershipReport.length === 0 && (
          <div className="text-center">No data found</div>
        )}
        <ol className="ml-8">
          {dataset.data?.topUserMembershipReport.map((user, i) => {
            return (
              <li key={i} className="list-decimal">
                <div className="flex justify-between gap-2 ml-1">
                  <div>{user._id.user}</div>
                  <div className="report-number">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      maximumFractionDigits: 0,
                    }).format(user.totalCost)}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </Card>
  );
};

export default TopUserMembership;
