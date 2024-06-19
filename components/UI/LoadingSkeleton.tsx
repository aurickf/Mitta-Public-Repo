import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Menubar } from "primereact/menubar";
import { Skeleton } from "primereact/skeleton";
import Footer from "../Layout/Footer";

const menuModel = [
  {
    label: "Home",
    icon: "pi pi-home",
    target: "/",
  },
];

const menuBarEnd = () => {
  return (
    <Button className="p-button-link" loading={true}>
      <div className={"flex p-2 rounded-md"}>
        <Avatar shape="circle" />
      </div>
    </Button>
  );
};

const LoadingSkeleton = () => {
  return (
    <div>
      <Menubar
        model={menuModel}
        end={menuBarEnd}
        className="bg-wisteria-100 "
      />
      <div className="h-full w-full md:w-11/12 mt:3 md:mt-5 pb-5 md:pb-8 mx-auto">
        <Skeleton className="my-2" height="10vh" />
        <Skeleton className="my-2" height="30vh" />
        <Skeleton className="my-2" height="30vh" />
      </div>
      <Footer />
    </div>
  );
};

export default LoadingSkeleton;
