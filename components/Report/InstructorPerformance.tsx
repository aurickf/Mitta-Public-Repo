import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import { Dropdown } from "primereact/dropdown";
import { useState } from "react";
import { useQuery } from "react-query";
import { InstructorPerformanceReport, Instructors } from "src/api";
import { dropdownTimeFrameOptions, getLightTheme } from ".";
import { ProgressBar } from "primereact/progressbar";

const InstructorPerformance = () => {
  const [timeFrame, setTimeFrame] = useState("allTime");
  const [selectedInstructor, setSelectedInstructor] = useState("");

  const [chartData] = useState({
    labels: [],

    datasets: [
      {
        label: "",
        backgroundColor: "rgba(153, 102, 255, 0.4)",
        borderColor: "rgb(153, 102, 255)",
        borderWidth: 1,
        data: [],
      },
    ],
  });

  const dataset = useQuery(
    ["instructorPerformance", timeFrame, selectedInstructor],
    () =>
      InstructorPerformanceReport({
        instructorId: selectedInstructor,
        timeFrame,
      }),
    {
      retry: 0,
      enabled: !!selectedInstructor,
      onSuccess(data) {
        chartData.labels = [];
        chartData.datasets[0].data = [];

        data.instructorPerformanceReport.map((item, i) => {
          let _labels;

          switch (item._id.status) {
            case "true":
              _labels = "Confirmed";
              break;
            case "false":
              _labels = "Cancelled";
              break;
            case null:
              _labels = "Scheduled";
            default:
              break;
          }

          chartData.labels.push(_labels);
          chartData.datasets[0].label = item._id.instructor;
          chartData.datasets[0].data.push(item.count);
        });
      },
    }
  );

  const instructorsData = useQuery(["instructors"], () => Instructors());

  const dropdownInstructorOptions = (
    instructorsData.data?.instructors || []
  ).map((instructor) => {
    return {
      label: instructor.name,
      value: instructor._id,
    };
  });

  const { basicOptions } = getLightTheme();

  const cardTitle = (
    <div className="flex gap-2 justify-end">
      <Dropdown
        options={dropdownInstructorOptions}
        value={selectedInstructor}
        onChange={(e) => setSelectedInstructor(e.value)}
        placeholder="Select instructor"
      />
      <Dropdown
        options={dropdownTimeFrameOptions}
        value={timeFrame}
        onChange={(e) => setTimeFrame(e.value)}
      />
    </div>
  );

  return (
    <Card title={cardTitle}>
      {dataset.isLoading && <ProgressBar mode="indeterminate" />}
      {selectedInstructor && (
        <Chart type="bar" data={chartData} options={basicOptions} />
      )}
    </Card>
  );
};

export default InstructorPerformance;
