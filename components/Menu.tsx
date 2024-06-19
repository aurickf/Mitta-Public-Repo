import LinkImage from "@/components/UI/LinkImage";
import yogaClass from "@/image/navigation/yogaClass.jpg";
import { Divider } from "primereact/divider";

export const userMenu = (
  <div className="flex justify-evenly my-5 ">
    <LinkImage image={yogaClass} href="/book" label="Weekly Class" />
    <LinkImage image={yogaClass} href="/book" label="Event" />
  </div>
);

export const instructorMenu = (
  <div className="flex justify-evenly my-5">
    <LinkImage image={yogaClass} href="/attendance" label="Attendance" />
  </div>
);

export const adminMenu = (
  <>
    <div className="flex flex-wrap justify-evenly my-5 gap-3">
      <LinkImage image={yogaClass} href="/manage/schedule" label="Schedule" />
      <LinkImage image={yogaClass} href="/manage/template" label="Template" />
      <LinkImage
        image={yogaClass}
        href="/manage/attendance"
        label="Attendance"
      />
      <Divider></Divider>
      <LinkImage image={yogaClass} href="/manage/booking" label="Bookings" />
      <LinkImage
        image={yogaClass}
        href="/manage/membership"
        label="Membership"
      />
      <LinkImage image={yogaClass} href="/manage/user" label="User" />
      <LinkImage image={yogaClass} href="/manage/settings" label="Settings" />
    </div>
  </>
);
