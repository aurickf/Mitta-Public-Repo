import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import { useState } from "react";
import { useQuery } from "react-query";
import { OverallBookingReport } from "src/api";
import { getLightTheme } from ".";
import { ProgressBar } from "primereact/progressbar";

const OverallBooking = () => {
  const { backgroundColor, hoverBackgroundColor } = getLightTheme();

  let labelsOverall = [],
    datasetsOverall = [
      {
        data: [],
        backgroundColor,
        hoverBackgroundColor,
      },
    ];

  const { lightOptions } = getLightTheme();

  const dataset = useQuery(
    ["overallBookingReport"],
    () => OverallBookingReport(),
    {
      onSuccess(data) {
        let _data = [];

        data.overallBookingReport.map((item) => {
          labelsOverall.push(`${item._id.status} - ${item._id.classType}`);
          _data.push(item.count);
        });

        datasetsOverall[0].data = _data;
      },
    }
  );

  const [chartData] = useState({
    labels: labelsOverall,
    datasets: datasetsOverall,
  });

  return (
    <Card className="bg-white/80">
      {dataset.isLoading && <ProgressBar mode="indeterminate" />}
      <Chart
        type="pie"
        data={chartData}
        options={lightOptions}
        className="w-8/12 mx-auto"
      />
    </Card>
  );
};

export default OverallBooking;
