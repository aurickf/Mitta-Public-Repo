import { RadioButton } from "primereact/radiobutton";

const ApplyChangesTo = ({ showOptionAllOcurrence = true, ...props }) => {
  const { dispatch, selectionMode, firstRDate, selectedDate } = props;

  const singleEvent = (
    <div className="my-3 mr-3">
      <RadioButton
        name="rb1"
        value="single"
        checked={selectionMode === "single"}
        onChange={(e) => dispatch({ type: "mode", val: e.value })}
      />
      <label htmlFor="rb1" className="ml-1">
        This event only
      </label>
    </div>
  );

  const followingOccurence = (
    <div className="my-3 mr-3">
      <RadioButton
        name="rb2"
        value="following"
        checked={selectionMode === "following"}
        onChange={(e) => {
          dispatch({ type: "mode", val: e.value });
          if (firstRDate && selectedDate)
            dispatch({ type: "dtstart", val: selectedDate });
        }}
      />
      <label htmlFor="rb2" className="ml-1">
        This and following events
      </label>
    </div>
  );

  const allOcurrence = showOptionAllOcurrence && (
    <div className="my-3 mr-3">
      <RadioButton
        name="rb3"
        value="all"
        checked={selectionMode === "all"}
        onChange={(e) => {
          dispatch({ type: "mode", val: e.value });
          if (firstRDate && selectedDate)
            dispatch({ type: "dtstart", val: firstRDate });
        }}
      />
      <label htmlFor="rb3" className="ml-1">
        All occurrence
      </label>
    </div>
  );

  return (
    <div className="mb-5">
      <div className="my-2 flex-none md:flex gap-3 justify-between text-sm">
        {singleEvent}
        {followingOccurence}
        {allOcurrence}
      </div>
    </div>
  );
};

export default ApplyChangesTo;
