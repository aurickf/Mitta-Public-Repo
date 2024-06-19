import { ISeriesFormProps } from "@/interface/SeriesForm";
import { sortDate } from "@/utils/sort";
import { DateTime } from "luxon";
import { Types } from "mongoose";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { useDebounce } from "primereact/hooks";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { PickList } from "primereact/picklist";
import { ProgressBar } from "primereact/progressbar";
import { useReducer, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import {
  AddSeries,
  DeleteSeries,
  EditSeries,
  IsSeriesTitleExist,
  SearchAllClassesQuery,
  Series,
} from "src/api";
import DTFormat from "../UI/DTFormat";
import Instructors from "../User/Instructors";
import Loading from "./Feedback/Loading";
import NotOk from "./Feedback/NotOk";
import Ok from "./Feedback/Ok";
import { InputTextarea } from "primereact/inputtextarea";
import LoadingData from "../LoadingData";

const from = DateTime.now().startOf("day").toJSDate();
const to = DateTime.now().plus({ days: 30 }).endOf("day").toJSDate();

const initialValue = {
  from,
  to,
};

const init = (value) => {
  return value;
};

const reducer = (state, action) => {
  switch (action.type) {
    case "from":
      return {
        ...state,
        from: DateTime.fromJSDate(action.value).startOf("day").toJSDate(),
      };

    case "to":
      return {
        ...state,
        to: DateTime.fromJSDate(action.value).startOf("day").toJSDate(),
      };

    case "reset":
      return init(action.value);

    default:
      break;
  }
};

const SeriesForm = (props: ISeriesFormProps) => {
  const { onError, onSuccess, selectedSeriesId } = props;

  const [source, setSource] = useState([]);
  const [target, setTarget] = useState([]);
  const [isPublished, setIsPublished] = useState(true);

  const onChange = (event) => {
    setSource(event.source);
    setTarget(event.target);
  };

  const methods = useForm();
  const [state, dispatch] = useReducer(reducer, initialValue, init);
  const [inputTitle, debouncedTitle, setInputTitle] = useDebounce("", 400);
  const [description, setDescription] = useState("");

  const selectedSeriesData = useQuery(
    ["Series", selectedSeriesId],
    () => Series({ _id: selectedSeriesId }),
    {
      enabled: !!selectedSeriesId,
      refetchOnMount: true,
      onSuccess(data) {
        setInputTitle(data.series.title);
        setIsPublished(data.series.isPublished);
        setDescription(data.series.description ?? "");

        const _target = [
          ...data.series.regularClass,
          ...data.series.specialEvent,
        ];

        setTarget(_target.sort(sortDate));
      },
    }
  );

  const dataset = useQuery(
    ["SearchAllClassesQuery", state],
    () => SearchAllClassesQuery(state),
    {
      enabled: !!state,
      refetchOnMount: true,
      onSuccess(data) {
        //@ts-ignore
        setSource(data.searchAllClassesQuery);
      },
    }
  );

  const seriesTitleCheck = useQuery(
    ["IsSeriesTitleExist", debouncedTitle],
    () => IsSeriesTitleExist({ title: debouncedTitle }),
    {
      enabled: !!debouncedTitle,
    }
  );

  const addNewSeries = useMutation(AddSeries);
  const editSeries = useMutation(EditSeries);
  const deleteSeries = useMutation(DeleteSeries);

  const prepareDataForMutation = () => {
    const classesData: {
      regularClass: Array<Types.ObjectId>;
      specialEvent: Array<Types.ObjectId>;
    } = {
      regularClass: [],
      specialEvent: [],
    };

    target.map((event) => {
      if (event.__typename === "RegularClass")
        classesData.regularClass.push(event._id);
      else classesData.specialEvent.push(event._id);
    });

    return {
      isPublished,
      title: debouncedTitle,
      description,
      ...classesData,
    };
  };

  const onSubmit = async () => {
    try {
      if (!selectedSeriesId) {
        await addNewSeries.mutateAsync(prepareDataForMutation());
        onSuccess("New series added");
      } else {
        await editSeries.mutateAsync({
          _id: selectedSeriesId,
          ...prepareDataForMutation(),
        });
        onSuccess("Series updated");
      }
    } catch (error) {
      error.response.errors.forEach((err) => onError(err));
    }
  };

  const deleteHandler = async () => {
    try {
      await deleteSeries.mutateAsync({ _id: selectedSeriesId });
      onSuccess("Series deleted");
    } catch (error) {
      error.response.errors.forEach((err) => onError(err));
    }
  };

  const itemTemplate = (event) => {
    return (
      <div>
        <div className="flex flex-wrap justify-between">
          {event.details.title}
          <Instructors value={event.instructors} />
        </div>
        <div>
          <DTFormat value={event.schedule.date} />
        </div>
      </div>
    );
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="input-form">
          <InputSwitch
            checked={isPublished}
            onChange={(e) => setIsPublished(!isPublished)}
            name="isPublished"
          />
          <label htmlFor="isPublished" className="ml-4">
            Publish
          </label>
        </div>
        <div className="input-form">
          <div className="p-inputgroup bg-slate-100">
            <div className="p-float-label">
              <InputText
                name="title"
                id="title"
                placeholder="Series title is case sensitive, and must be unique."
                value={inputTitle}
                onChange={(e) => setInputTitle(e.target.value)}
                keyfilter={/^[^<>&`'"/]+$/}
              />
              <label htmlFor="title">Series Title</label>
            </div>

            {seriesTitleCheck.isLoading ? (
              <Loading />
            ) : seriesTitleCheck.data?.isSeriesTitleExist ? (
              debouncedTitle !== selectedSeriesData.data?.series.title && (
                <NotOk />
              )
            ) : (
              debouncedTitle !== "" && <Ok />
            )}
          </div>
        </div>
        <div className="input-form p-float-label">
          <InputTextarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="w-full"
          />
          <label htmlFor="description">Series Description</label>
        </div>
        <div className="input-form flex gap-2">
          <Calendar
            className="w-full my-2"
            placeholder="Select start date"
            dateFormat="D, dd M yy"
            value={state.from}
            onChange={(e) => dispatch({ type: "from", value: e.value })}
          />
          <Calendar
            className="w-full my-2"
            placeholder="Select end date"
            dateFormat="D, dd M yy"
            value={state.to}
            onChange={(e) => dispatch({ type: "to", value: e.value })}
          />
        </div>
        {(dataset.isFetching || selectedSeriesData.isFetching) && (
          <LoadingData />
        )}
        <div className="input-form text-sm text-center text-victoria-600 list-disc">
          Duplicate class entries will be automatically removed.
        </div>
        <div className="input-form">
          <PickList
            sourceHeader="Available"
            targetHeader="Selected"
            itemTemplate={itemTemplate}
            source={source}
            target={target}
            onChange={onChange}
            filter
            filterBy="details.title"
            sourceFilterPlaceholder="Filter by class name"
            targetFilterPlaceholder="Filter by class name"
          />
        </div>

        <div className="input-form pt-10 flex flex-wrap justify-between">
          <div>
            <Button
              type="button"
              label="Delete"
              severity="danger"
              icon="pi pi-trash"
              text
              onClick={deleteHandler}
            />
          </div>
          <div>
            <Button
              type="button"
              label="Reset"
              text
              onClick={() => {
                dispatch({ type: "reset", value: initialValue });
                setInputTitle(selectedSeriesData.data?.series.title);
                setIsPublished(selectedSeriesData.data?.series.isPublished);
                //@ts-ignore
                setSource(dataset.data?.searchAllClassesQuery);
                setTarget(
                  [
                    ...selectedSeriesData.data?.series.regularClass,
                    ...selectedSeriesData.data?.series.specialEvent,
                  ].sort(sortDate)
                );
              }}
            />
            <Button
              label="Save"
              icon="pi pi-save"
              loading={addNewSeries.isLoading || editSeries.isLoading}
              disabled={
                seriesTitleCheck.data?.isSeriesTitleExist &&
                debouncedTitle !== selectedSeriesData.data?.series.title
              }
            />
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default SeriesForm;
