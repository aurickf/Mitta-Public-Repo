import { ProgressSpinner } from "primereact/progressspinner";
import { useQuery } from "react-query";
import { ClassTemplatePriceList } from "src/api";

const RegularClassPriceList = () => {
  const dataset = useQuery(["ClassTemplatePriceList"], () =>
    ClassTemplatePriceList({ title: "_" })
  );

  if (dataset.isLoading)
    return (
      <div className="text-center">
        <ProgressSpinner />
      </div>
    );

  return (
    <div className="mx-auto bg-purple-100 rounded border-purple-200 border py-2 px-4 table w-full">
      <div className="my-auto table-row">
        <div className="table-cell my-auto border-wisteria-200">
          Online class via Zoom
        </div>
        <div className="table-cell my-auto text-right">
          {dataset.data?.classTemplatePriceList.online.cost + " points"}
        </div>
      </div>
      <div className="my-auto table-row">
        <div className="table-cell my-auto border-wisteria-200">
          Offline class at our studio
        </div>
        <div className="table-cell my-auto text-right">
          {dataset.data?.classTemplatePriceList.offline.cost + " points"}
        </div>
      </div>
    </div>
  );
};

export default RegularClassPriceList;
