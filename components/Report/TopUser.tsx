import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { useState } from "react";
import { useQuery } from "react-query";
import { TopUserReport } from "src/api";
import { dropdownBookingStatusOptions, dropdownTimeFrameOptions } from ".";
import { ProgressBar } from "primereact/progressbar";

const TopUser = () => {
  const [timeFrame, setTimeFrame] = useState("allTime");
  const [bookingStatus, setBookingStatus] = useState("Confirmed");
  const dataset = useQuery(["topUser", bookingStatus, timeFrame], () =>
    TopUserReport({ bookingStatus, timeFrame })
  );

  const cardTitle = (
    <div className="flex gap-2 justify-end">
      <Dropdown
        value={timeFrame}
        options={dropdownTimeFrameOptions}
        onChange={(e) => setTimeFrame(e.value)}
      />
      <Dropdown
        value={bookingStatus}
        options={dropdownBookingStatusOptions}
        onChange={(e) => setBookingStatus(e.value)}
      />
    </div>
  );

  return (
    <>
      <Card title={cardTitle} className="bg-white/80">
        <div className="w-full my-2">
          {dataset.isLoading && <ProgressBar mode="indeterminate" />}
          {dataset.data?.topUserReport.length === 0 && (
            <div className="text-center">No data found</div>
          )}
          <ol className="ml-8">
            {dataset.data?.topUserReport.map((user, i) => {
              return (
                <li key={i} className="list-decimal">
                  <div className="flex justify-between gap-2 ml-1">
                    <div>{user._id.user}</div>
                    <div className="report-number">{user.totalCost} points</div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </Card>
    </>
  );
};

export default TopUser;
