import { classNames } from "primereact/utils";
import { Tooltip } from "primereact/tooltip";

const Boolean = (props: { value: boolean; tooltip?: string }) => {
  return (
    <>
      <Tooltip target=".tooltip-target" />
      <span className="tooltip-target" data-pr-tooltip={props.tooltip || ""}>
        <i
          className={classNames("pi", {
            "true-icon pi-check-circle text-green-500": props.value,
            "false-icon pi-times-circle text-pink-500": !props.value,
          })}
        />
      </span>
    </>
  );
};

export default Boolean;
