import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import { Dropdown } from "primereact/dropdown";
import { useState } from "react";
import { useQuery } from "react-query";
import { SpecialClassReport } from "src/api";
import { getLightTheme } from ".";
import { ProgressBar } from "primereact/progressbar";

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

const SpecialClass = () => {
  const [timeFrame, setTimeFrame] = useState("thisYear");

  let [datastackOnline] = useState({
    type: "bar",
    label: "Online",
    backgroundColor: "rgba(54, 162, 235, 0.2)",
    borderColor: "rgb(54, 162, 235)",
    borderWidth: 1,
    data: [],
  });
  let [datastackOffline] = useState({
    type: "bar",
    label: "Offline",
    backgroundColor: "rgba(153, 102, 255, 0.2)",
    borderColor: "rgb(153, 102, 255)",
    borderWidth: 1,
    data: [],
  });

  const dataset = useQuery(
    ["SpecialClassReport", timeFrame],
    () => SpecialClassReport({ timeFrame }),
    {
      onSuccess(data) {
        datastackOffline.data = [];
        datastackOnline.data = [];

        data.specialClassReport.map((item) => {
          if (item._id.classType === "online") {
            datastackOnline.data[item._id.week - 1] = item.totalSeat;
          }
          if (item._id.classType === "offline") {
            datastackOffline.data[item._id.week - 1] = item.totalSeat;
          }
        });
      },
    }
  );

  const stackedData = {
    labels: stackDataLabels,
    datasets: [datastackOnline, datastackOffline],
  };

  const { stackedOptions } = getLightTheme();

  const cardTitle = (
    <div className="flex gap-2 justify-end">
      <Dropdown
        options={dropdownYear}
        value={timeFrame}
        onChange={(e) => setTimeFrame(e.value)}
      />
    </div>
  );

  return (
    <Card title={cardTitle} className="bg-white/80">
      {dataset.isLoading && <ProgressBar mode="indeterminate" />}
      <Chart
        className="mx-auto"
        type="bar"
        data={stackedData}
        options={stackedOptions}
        width="80vw"
        height="30vw"
      />
    </Card>
  );
};

export default SpecialClass;
