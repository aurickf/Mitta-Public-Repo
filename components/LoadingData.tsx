import { ProgressBar } from "primereact/progressbar";

const LoadingData = () => {
  return (
    <div>
      <div className="text-sm text-center italic text-victoria-600 my-2">
        Loading data...
      </div>
      <ProgressBar mode="indeterminate" />
    </div>
  );
};

export default LoadingData;
