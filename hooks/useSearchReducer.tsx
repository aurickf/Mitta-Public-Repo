import { DateTime } from "luxon";
import Link from "next/link";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Card } from "primereact/card";
import { Checkbox } from "primereact/checkbox";
import { MultiSelect } from "primereact/multiselect";
import { useReducer } from "react";
import { useQuery } from "react-query";
import { Instructors } from "src/api";

interface stateInterface {
  from: Date | string;
  to: Date | string;
  online: boolean;
  offline: boolean;
  instructors: string[];
}

interface actionInterface {
  type: String;
  val: any;
}

const earlyToday = DateTime.now().startOf("day").toJSDate();
const nextMonth = DateTime.now().plus({ day: 30 }).endOf("day").toJSDate();

const init = (initialState) => {
  return { ...initialState };
};

const reducer = (state: stateInterface, action: actionInterface) => {
  switch (action.type) {
    case "from":
      return {
        ...state,
        from: action.val,
        to: DateTime.fromJSDate(action.val)
          .plus({ day: 6 })
          .endOf("day")
          .toJSDate(),
      };
    case "to":
      if (
        state.from > DateTime.fromJSDate(action.val).endOf("day").toJSDate()
      ) {
        return {
          ...state,
          from: DateTime.fromJSDate(action.val).startOf("day").toJSDate(),
          to: DateTime.fromJSDate(action.val).endOf("day").toJSDate(),
        };
      }
      return {
        ...state,
        to: DateTime.fromJSDate(action.val).endOf("day").toJSDate(),
      };
    case "online":
      return {
        ...state,
        online: action.val,
      };
    case "offline":
      return {
        ...state,
        offline: action.val,
      };
    case "instructors":
      return {
        ...state,
        instructors: action.val,
      };
    case "reset":
      return init(action.val);

    default:
      throw new Error("Invalid action type");
  }
};

const useSearchReducer = (
  initialState = {
    from: earlyToday,
    to: nextMonth,
    online: true,
    offline: true,
    instructors: [],
  }
) => {
  const [state, dispatch] = useReducer(reducer, initialState, init);
  const dataset = useQuery(["instructors"], () => Instructors());

  let classType: string;

  if (state.online && state.offline) classType = "all";
  if (state.online && !state.offline) classType = "online";
  if (!state.online && state.offline) classType = "offline";

  const SearchYogaClass = (props) => {
    const { loading }: { loading: boolean } = props;

    return (
      <Card title="Search and Book">
        <div className="">
          <div className="md:flex gap-2 justify-between">
            {/* From */}
            <div className="my-3 md:mx-1 w-full">
              <span className="p-float-label">
                <Calendar
                  name="from"
                  minDate={earlyToday}
                  value={state.from}
                  dateFormat="D, dd M yy"
                  onChange={(e) => dispatch({ type: "from", val: e.value })}
                  className="w-full"
                />
                <label htmlFor="from">From</label>
              </span>
            </div>
            {/* To */}
            <div className="my-3 md:mx-1 w-full">
              <span className="p-float-label">
                <Calendar
                  name="to"
                  minDate={earlyToday}
                  value={state.to}
                  dateFormat="D, dd M yy"
                  onChange={(e) => dispatch({ type: "to", val: e.value })}
                  className="w-full"
                />
                <label htmlFor="to">To</label>
              </span>
            </div>
          </div>

          {/* Instructor */}
          <div className="my-3 md:mx-1">
            <span className="p-float-label ">
              <MultiSelect
                options={(dataset.data?.instructors || []).map((instructor) => {
                  return {
                    label: instructor?.name,
                    value: instructor?._id,
                  };
                })}
                value={state.instructors}
                onChange={(e) =>
                  dispatch({ type: "instructors", val: e.value })
                }
                name="selectInstructors"
                className="w-full"
                selectAll={true}
                display="chip"
              />
              <label htmlFor="selectInstructors">Instructors</label>
            </span>
          </div>
        </div>

        {/* Checkbox */}
        <div className="flex gap-4 justify-around mx-1 my-4 lg:justify-end">
          <div>
            <Checkbox
              name="rbOnline"
              value="online"
              className="mr-2"
              checked={state.online}
              onChange={(e) => dispatch({ type: "online", val: e.checked })}
            />
            <label htmlFor="rbOnline">Online class</label>
          </div>
          <div>
            <Checkbox
              name="rbOffline"
              value="offline"
              className="mr-2"
              checked={state.offline}
              onChange={(e) => dispatch({ type: "offline", val: e.checked })}
            />
            <label htmlFor="rbOffline">Offline class</label>
          </div>
        </div>

        <div className="flex">
          <Button
            label="Clear"
            icon="pi pi-filter-slash"
            className="p-button-text"
            onClick={() => dispatch({ type: "reset", val: initialState })}
          />
          <Link
            href={{
              pathname: "/search/[classType]",
              query: {
                from: DateTime.fromJSDate(state.from).toISODate(),
                to: DateTime.fromJSDate(state.to).toISODate(),
                classType: classType ?? "all",
                instructors: state.instructors,
              },
            }}
            passHref
          >
            <Button
              label="Search"
              icon="pi pi-search"
              className="grow"
              loading={loading}
            />
          </Link>
        </div>
      </Card>
    );
  };

  return {
    state,
    dispatch,
    SearchYogaClass,
  };
};

export default useSearchReducer;
