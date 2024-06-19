import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import { Dropdown } from "primereact/dropdown";
import { useState } from "react";
import { useQuery } from "react-query";
import { WeeklyBookingReport } from "src/api";
import { dropdownBookingStatusOptions, getLightTheme } from ".";
import { ProgressBar } from "primereact/progressbar";
import { Divider } from "primereact/divider";

const stackDataLabels = [];

const dropdownYear = [
  {
    label: "This year",
    value: "thisYear",
  },
  {
    label: "Last year",
    value: "lastYear",
  },
];

for (let i = 1; i <= 53; i++) {
  stackDataLabels.push(`W${i}`);
}

const WeeklyBooking = () => {
  const [bookingStatus, setBookingStatus] = useState("Confirmed");
  const [timeFrame, setTimeFrame] = useState("thisYear");

  let [datastackOnline] = useState({
    label: "Online",
    backgroundColor: "rgba(54, 162, 235, 0.2)",
    borderColor: "rgb(54, 162, 235)",
    borderWidth: 1,
    data: [],
  });
  let [datastackOffline] = useState({
    label: "Offline",
    backgroundColor: "rgba(153, 102, 255, 0.2)",
    borderColor: "rgb(153, 102, 255)",
    borderWidth: 1,
    data: [],
  });
  let [revenueOnline] = useState({
    label: "Online",
    backgroundColor: "rgba(54, 162, 235, 0.2)",
    borderColor: "rgb(54, 162, 235)",
    borderWidth: 1,
    tension: 0.4,
    data: [],
  });
  let [revenueOffline] = useState({
    label: "Offline",
    backgroundColor: "rgba(153, 102, 255, 0.2)",
    borderColor: "rgb(153, 102, 255)",
    borderWidth: 1,
    tension: 0.4,
    data: [],
  });

  const dataset = useQuery(
    ["weeklyBookingReport", bookingStatus, timeFrame],
    () => WeeklyBookingReport({ bookingStatus, timeFrame }),
    {
      onSuccess(data) {
        datastackOffline.data = [];
        datastackOnline.data = [];
        revenueOffline.data = [];
        revenueOnline.data = [];

        data.weeklyBookingReport.map((item) => {
          if (item._id.classType === "online") {
            datastackOnline.data[item._id.week - 1] = item.count;
            revenueOnline.data[item._id.week - 1] = item.totalCost;
          }
          if (item._id.classType === "offline") {
            datastackOffline.data[item._id.week - 1] = item.count;
            revenueOffline.data[item._id.week - 1] = item.totalCost;
          }
        });
      },
    }
  );

  const stackedData = {
    labels: stackDataLabels,
    datasets: [datastackOnline, datastackOffline],
  };

  const revenueData = {
    labels: stackDataLabels,
    datasets: [revenueOnline, revenueOffline],
  };

  const { stackedOptions, basicOptions } = getLightTheme();

  const cardTitle = (
    <div className="flex justify-end gap-2 my-3">
      <Dropdown
        options={dropdownYear}
        value={timeFrame}
        onChange={(e) => setTimeFrame(e.value)}
      />
      <Dropdown
        options={dropdownBookingStatusOptions}
        value={bookingStatus}
        onChange={(e) => {
          setBookingStatus(e.value);
        }}
      />
    </div>
  );

  return (
    <Card title={cardTitle} className="bg-white/80 mx-auto">
      {dataset.isLoading && <ProgressBar mode="indeterminate" />}
      <div className="text-center my-4">
        <div className="text-2xl">Booking Trend</div>
        <div className="text-xs italic">
          Based on seat amount for each class type.
        </div>
      </div>
      <Chart
        className="mx-auto"
        type="bar"
        data={stackedData}
        options={stackedOptions}
        width="80vw"
        height="30vw"
      />
      <Divider />
      <div className="text-center my-4">
        <div className="text-2xl">Point Spending Trend</div>
        <div className="text-xs italic">
          Based on points for each class type.
        </div>
      </div>
      <Chart
        className="mx-auto"
        type="line"
        data={revenueData}
        options={basicOptions}
        width="80vw"
        height="30vw"
      />
    </Card>
  );
};

export default WeeklyBooking;
