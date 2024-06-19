import { DateTime } from "luxon";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { RegularClass } from "src/generated/graphql";
import DTFormat from "../UI/DTFormat";

const MyClass = (props) => {
  const { details, schedule, online, offline, status, zoom }: RegularClass =
    props.value;
  let classStatus,
    classInfo,
    isDisabled = false;

  switch (status.isRunning) {
    case true:
      classStatus = `Confirmed `;
      classInfo = `👥 ${online.booked.length + offline.booked.length}`;
      isDisabled = true;
      break;
    case false:
      classStatus = `Cancelled`;
      classInfo = `-`;
      isDisabled = true;
      break;
    case null:
      classStatus = `Scheduled to run`;
      classInfo = `🌏 Online ${online.booked.length} - 🏠 Offline ${offline.booked.length}`;
      break;

    default:
      break;
  }

  const title = (
    <div className="flex justify-between overflow-hidden h-2rem">
      <div className="text-sm my-auto">{details.title}</div>
      <div className="flex">
        <Button
          className="p-button-sm p-button-link"
          icon="pi pi-share-alt"
          aria-label="Share this class"
          tooltip="Share this class"
          tooltipOptions={{ position: "top" }}
          onClick={() => {
            window.open(
              `/${details.title.split(" ").join("_")}/${DateTime.fromISO(
                schedule.date
              ).toISODate()}`
            );
          }}
        />
        {status.isVIPOnly === true ? (
          <Tag value="VIP" severity="warning" />
        ) : (
          <Tag value="Public" severity="warning" />
        )}
      </div>
    </div>
  );

  const footer = () => {
    if (zoom?.joinUrl)
      return (
        <Button
          className="p-button-sm w-full"
          label="Join Via Zoom"
          icon="pi pi-external-link"
          iconPos="right"
          onClick={() => {
            window.open(zoom.joinUrl, "_blank", "noopener,noreferrer");
          }}
        />
      );
    return (
      <Button
        className="p-button-sm w-full"
        disabled={true}
        label="No Zoom Meeting Linked"
      />
    );
  };

  return (
    <Card
      title={title}
      footer={footer}
      className="mx-2 rounded-sm bg-white/70 h-full"
    >
      <div>
        <div>
          <DTFormat value={schedule.date} dateOnly />
        </div>
        <div>
          <DTFormat
            value={schedule.date}
            duration={schedule.duration}
            timeOnly
          />
        </div>
        <div className="text-sm mx-auto my-2">{classInfo}</div>
        <div className="text-center my-auto">{classStatus}</div>
      </div>
    </Card>
  );
};

export default MyClass;
