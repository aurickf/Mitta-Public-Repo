import { InputTextForm } from "../InputForm";

const EventTitle = () => {
  return (
    <InputTextForm
      name="details.title"
      label="Title"
      rules={{ required: "Title* (mandatory field)" }}
    />
  );
};

export default EventTitle;
