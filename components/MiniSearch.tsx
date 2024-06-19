import { DateTime } from "luxon";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { DataView } from "primereact/dataview";
import { Dialog } from "primereact/dialog";
import { useReducer, useState } from "react";
import { useQuery } from "react-query";
import { SearchAllClassesQuery } from "src/api";
import { RegularClass, SearchResult, User } from "src/generated/graphql";
import BookingForm from "./Form/BookingForm";
import DTFormat from "./UI/DTFormat";
import BookingFormSpecialEvent from "./Form/BookingFormSpecialEvent";

const earlyToday = DateTime.now().startOf("day").toJSDate();
const laterToday = DateTime.now().endOf("day").toJSDate();

const initialValue = {
  from: earlyToday,
  to: laterToday,
};

const init = (value) => {
  return value;
};

const reducer = (state, action) => {
  switch (action.type) {
    case "date":
      return {
        ...state,
        from: DateTime.fromJSDate(action.value).startOf("day").toJSDate(),
        to: DateTime.fromJSDate(action.value).endOf("day").toJSDate(),
      };

    case "reset":
      return init(action.value);

    default:
      break;
  }
};

interface IMiniSearchProps {
  user: Partial<User>;
  booker: Partial<User>;
  onSuccess: Function;
  onError: Function;
}

const MiniSearch = (props: IMiniSearchProps) => {
  const [state, dispatch] = useReducer(reducer, initialValue, init);

  const dataset = useQuery(
    ["SearchAllClassesQuery", state],
    () => SearchAllClassesQuery(state),
    {
      enabled: !!state,
    }
  );

  const [selectedData, setSelectedData] = useState<SearchResult>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const onSelectHandler = (regularClass) => {
    setSelectedData(regularClass);
    setShowBookingForm(true);
  };

  const onUnselectHandler = () => {
    setShowBookingForm(false);
  };

  const itemTemplate = (regularClass) => {
    return (
      <div className="w-full my-2 py-2 flex justify-around">
        <div className="">
          <div className="text-lg">{regularClass.details.title}</div>
          <div>
            <DTFormat value={regularClass.schedule.date} dateOnly />
          </div>
        </div>
        <div className="">
          <Button
            className="p-button-text p-button-outlined w-full"
            label="Book on Behalf"
            onClick={() => onSelectHandler(regularClass)}
          />
        </div>
      </div>
    );
  };

  return (
    <div>
      <Calendar
        className="w-full my-3"
        placeholder="Select date"
        showIcon
        showButtonBar
        dateFormat="D, dd M yy"
        onChange={(e) => {
          dispatch({ type: "date", value: e.value });
        }}
      />
      <DataView
        value={dataset.data?.searchAllClassesQuery}
        itemTemplate={itemTemplate}
        emptyMessage="No class found for selected date"
        loading={dataset.isLoading}
      />
      <Dialog
        visible={showBookingForm}
        onHide={onUnselectHandler}
        header={`Book on Behalf of ${props?.user?.name}`}
        className="w-full md:w-7/12 lg:w-5/12"
      >
        {selectedData?.__typename === "RegularClass" ? (
          <BookingForm
            booker={props.booker}
            user={props.user}
            regularClass={selectedData}
            onBookSuccess={props.onSuccess}
            onBookFailed={props.onError}
          />
        ) : (
          <BookingFormSpecialEvent
            booker={props.booker}
            user={props.user}
            event={selectedData}
            onBookSuccess={props.onSuccess}
            onBookFailed={props.onError}
          />
        )}
      </Dialog>
    </div>
  );
};

export default MiniSearch;
