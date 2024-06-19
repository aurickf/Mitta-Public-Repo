import { Divider } from "primereact/divider";
import styles from "./ClassColorAndIcon.module.css";

const ClassColorAndIcon = () => {
  return (
    <div className="text-sm">
      <Divider className="text-xs">Colors</Divider>

      <div className="flex gap-2 my-1">
        <i className={`pi pi-circle-fill ${styles.colorPeru}`} />
        Scheduled to run
      </div>
      <div className="flex gap-2 my-1">
        <i className={`pi pi-circle-fill ${styles.colorDarkViolet}`} />
        Confirmed
      </div>
      <div className="flex gap-2 my-1">
        <i className={`pi pi-circle-fill ${styles.colorSlateGray}`} />
        Cancelled
      </div>
      <Divider className="text-xs">Icons</Divider>
      <div className="flex gap-2 my-1">⭐ VIP members only</div>
      <div className="flex gap-2 my-1">🔇 Not published</div>
    </div>
  );
};

export default ClassColorAndIcon;
