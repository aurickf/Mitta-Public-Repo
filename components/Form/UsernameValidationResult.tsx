import { IUsernameValidationResultProps } from "@/interface/UsernameValidationResult";
import { Message } from "primereact/message";

const UsernameValidationResult = (props: IUsernameValidationResultProps) => {
  const { loading, validationResult, isSameUsername } = props;

  if (validationResult) return <Message severity="success" text="OK" />;

  if (validationResult !== undefined && !validationResult)
    return (
      <div hidden={isSameUsername}>
        <Message severity="error" text="Not available" />
      </div>
    );

  if (loading)
    return (
      <span className="p-inputgroup-addon">
        <i className="pi pi-spin pi-spinner text-3xl" />
      </span>
    );
};

export default UsernameValidationResult;
