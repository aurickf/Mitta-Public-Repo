import { Badge } from "primereact/badge";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { useState } from "react";
import { useQuery } from "react-query";
import { TopInstructorReport } from "src/api";
import { dropdownBookingStatusOptions, dropdownTimeFrameOptions } from ".";
import { ProgressBar } from "primereact/progressbar";

const TopInstructor = () => {
  const [bookingStatus, setBookingStatus] = useState("Confirmed");
  const [timeFrame, setTimeFrame] = useState("allTime");

  const dataset = useQuery(["topInstructor", bookingStatus, timeFrame], () =>
    TopInstructorReport({ bookingStatus, timeFrame })
  );

  const cardTitle = (
    <div className="flex gap-2 justify-end">
      <Dropdown
        options={dropdownTimeFrameOptions}
        value={timeFrame}
        onChange={(e) => setTimeFrame(e.value)}
      />
      <Dropdown
        options={dropdownBookingStatusOptions}
        value={bookingStatus}
        onChange={(e) => setBookingStatus(e.value)}
      />
    </div>
  );

  return (
    <Card title={cardTitle} className="bg-white/80">
      <div className="w-full my-2">
        {dataset.isLoading && <ProgressBar mode="indeterminate" />}
        {dataset.data?.topInstructorReport.length === 0 && (
          <div className="text-center">No data found</div>
        )}
        <ol className="ml-8">
          {dataset.data?.topInstructorReport.map((item, i) => {
            return (
              <li key={i} className="list-decimal">
                <div className="flex justify-between">
                  <div>{item._id.instructor}</div>
                  <div className="report-number">{item.totalCost} points</div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </Card>
  );
};

export default TopInstructor;
