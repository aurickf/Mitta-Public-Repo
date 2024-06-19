import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Carousel } from "primereact/carousel";
import { useQuery } from "react-query";
import { TeachingScheduleQuery } from "src/api";
import MyClass from "../RegularClass/MyClass";

const responsiveOptions = [
  {
    breakpoint: "1024px",
    numVisible: 3,
    numScroll: 1,
  },
  {
    breakpoint: "768px",
    numVisible: 2,
    numScroll: 1,
  },
  {
    breakpoint: "560px",
    numVisible: 1,
    numScroll: 1,
  },
];

const myClassTemplate = (item) => {
  return <MyClass value={item} />;
};

const MyTeachingScheduleSection = () => {
  const { data: session } = useSession();

  const dataset = useQuery(
    ["MyTeachingScheduleSection", session.user._id],
    () => TeachingScheduleQuery({ _id: session.user._id }),
    {
      enabled: !!session.user._id,
    }
  );

  const teachingScheduleHeader = (
    <div className="flex flex-wrap justify-between">
      <div className="my-auto">Teaching Schedule</div>
      <div>
        <Link href={`/attendance/${session?.user?.username}`}>
          <Button icon="pi pi-check-square" label="My Attendance" />
        </Link>
      </div>
    </div>
  );

  return (
    <div id="my_teaching_schedule">
      <Card title={teachingScheduleHeader} className="my-2 bg-white/50">
        {dataset.data?.activeClassesByInstructors?.length > 0 ? (
          <Carousel
            value={dataset.data.activeClassesByInstructors}
            itemTemplate={myClassTemplate}
            responsiveOptions={responsiveOptions}
            numVisible={4}
            numScroll={1}
          />
        ) : (
          <div>You have no upcoming class scheduled.</div>
        )}
      </Card>
    </div>
  );
};

export default MyTeachingScheduleSection;
