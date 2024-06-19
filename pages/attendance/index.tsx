import Layout from "@/components/Layout/Layout";
import LoadingSkeleton from "@/components/UI/LoadingSkeleton";
import Instructors from "@/components/User/Instructors";
import Link from "next/link";
import { Card } from "primereact/card";
import { Skeleton } from "primereact/skeleton";
import { useQuery } from "react-query";
import { Instructors as InstructorsQuery } from "src/api";

const AttendancePage = () => {
  const dataset = useQuery(["instructors"], () => InstructorsQuery());
  return (
    <Layout>
      <Card title="Instructors" className="bg-white/80 my-2 ">
        <div className="max-w-2xl mx-auto">
          {!dataset.isLoading ? (
            dataset.data?.instructors.map((instructor, i) => {
              return (
                <Link
                  key={i}
                  href={`attendance/${instructor.username}`}
                  passHref
                >
                  <div className="flex justify-between list-element">
                    <div className="pl-4 my-auto text-xl text-center drop-shadow-md">
                      {instructor.name}
                    </div>
                    <Instructors mode="image" value={[instructor]} />
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="my-auto">
              <Skeleton width="max-w-2xl" height="4rem" className="my-2" />
              <Skeleton width="max-w-2xl" height="4rem" className="my-2" />
              <Skeleton width="max-w-2xl" height="4rem" className="my-2" />
              <Skeleton width="max-w-2xl" height="4rem" className="my-2" />
            </div>
          )}
        </div>
      </Card>
    </Layout>
  );
};

AttendancePage.auth = {
  role: "instructor",
  loading: <LoadingSkeleton />,
  unauthorized: "/auth/unauthorized",
};

export default AttendancePage;
