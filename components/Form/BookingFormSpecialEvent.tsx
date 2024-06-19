import DTFormat from "@/components/UI/DTFormat";
import Instructors from "@/components/User/Instructors";
import { Types } from "mongoose";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Chips } from "primereact/chips";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Message } from "primereact/message";
import { RadioButton } from "primereact/radiobutton";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import { useReducer, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  AddEventBookingCard,
  PaymentMethod,
  SpecialEventBookingData,
} from "src/api";
import { SpecialEvent, User } from "src/generated/graphql";
import { EventBookingCardInput } from "src/schema/eventBookingCard";
import CustomFileUpload from "./CustomFileUpload";
import BankAccountInfo from "../BankAccountInfo";

interface BookingFormSpecialEventI {
  booker: Partial<User>;
  user: Partial<User>;
  event?: SpecialEvent;
  onBookSuccess: Function;
  onBookFailed: Function;
}

const BookingFormSpecialEvent = (props: BookingFormSpecialEventI) => {
  const { booker, user, event } = props;

  const toast = useRef<Toast>(null);

  const dataset = useQuery(["bookingFormSpecialEvent"], () =>
    SpecialEventBookingData()
  );

  const queryClient = useQueryClient();

  let maxSeat = {
    offline: 1,
    online: 1,
  };

  if (user.membership.isVIP) {
    maxSeat = {
      offline: event.offline.availability,
      online: event.online.availability,
    };
  }

  if (booker.role.isAdmin) {
    maxSeat = {
      offline: event.offline.availability + 10,
      online: event.online.availability + 10,
    };
  }

  const defaultValues: Omit<Partial<EventBookingCardInput>, "status"> & {
    status: {
      updatedBy: Types.ObjectId;
    };
  } = {
    user: user._id,
    event: event._id,
    classType: null,
    seat: 1,
    participants: [`${user.name}`],
    booker: booker._id,
    status: {
      updatedBy: booker._id,
    },
    payment: {
      method: null,
      date: new Date(),
      image: "",
    },
    image: null,
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "classType":
        return {
          ...state,
          classType: action.value,
        };

      case "seat":
        return {
          ...state,
          seat: action.value,
        };

      case "participants": {
        return {
          ...state,
          participants: action.value,
        };
      }

      case "selectImage": {
        return {
          ...state,
          image: action.value,
        };
      }

      case "clearImage": {
        return {
          ...state,
          image: null,
        };
      }

      case "paymentMethod":
        return {
          ...state,
          payment: {
            ...state.payment,
            method: action.value,
          },
        };

      case "paymentDate":
        return {
          ...state,
          payment: {
            ...state.payment,
            date: action.value,
          },
        };

      case "reset":
        return init(defaultValues);
      default:
        throw new Error("Invalid action type");
    }
  };

  const init = (value) => {
    return value;
  };

  const [state, dispatch] = useReducer(reducer, defaultValues, init);

  const selectedPaymentMethod = useQuery(
    ["selectedPaymentMethod", state.payment.method],
    () => PaymentMethod({ _id: state.payment.method }),
    {
      enabled: !!state.payment.method,
    }
  );

  const addEventBookingCard = useMutation(AddEventBookingCard);

  const onSubmit = async () => {
    try {
      let newBooking = state;

      if (!selectedPaymentMethod.data?.paymentMethod?.requireProof) {
        // Clear image selection
        delete newBooking.image;
      }

      await addEventBookingCard.mutateAsync(newBooking);
      props.onBookSuccess(
        "Registration submitted. You will be notified upon confirmation."
      );

      queryClient.invalidateQueries(["MyBookingSection"]);
      queryClient.invalidateQueries(["SearchClassesQuery"]);
    } catch (error) {
      error.response?.errors.forEach((err) => props.onBookFailed(err));
    }
  };

  return (
    <div>
      <Toast ref={toast} />
      <div className="flex flex-wrap gap-2 justify-between">
        <div className="text-2xl my-auto mr-2">{event.details.title}</div>
        <div>
          <Instructors value={event.instructors} />
        </div>
      </div>
      <div className="my-3">
        <DTFormat value={event.schedule.date} />
      </div>

      <div className="flex-inline md:flex justify-around gap-2 my-4">
        <div>
          <RadioButton
            id="rb-1"
            name="classType"
            value="online"
            checked={state?.classType === "online"}
            onChange={(e) => {
              dispatch({ type: "classType", value: e.value });
              dispatch({ type: "seat", value: 1 });
            }}
            disabled={event.online.availability < 1}
          />
          <label
            htmlFor="rb-1"
            className="ml-2"
          >{`🌏 Online - ${event.online.availability} seat left `}</label>
        </div>
        <div>
          <RadioButton
            id="rb-2"
            name="classType"
            value="offline"
            checked={state?.classType === "offline"}
            onChange={(e) => {
              dispatch({ type: "classType", value: e.value });
              dispatch({ type: "seat", value: 1 });
            }}
            disabled={event.offline.availability < 1}
          />
          <label
            htmlFor="rb-2"
            className="ml-2"
          >{`🏠 Offline - ${event.offline.availability}  seat left`}</label>
        </div>
      </div>
      <div className="my-auto">
        {booker.role.isAdmin && (
          <span className="text-xs text-red-500">
            As admin you have access to 10 overbook
          </span>
        )}
      </div>
      {state.classType && (
        <div>
          <div className="p-float-label my-3">
            <InputNumber
              className="w-full"
              name="seat"
              suffix=" seat"
              min={1}
              max={maxSeat[state?.classType]}
              value={state.seat}
              onValueChange={(e) => dispatch({ type: "seat", value: e.value })}
              disabled={state?.classType ? false : true}
              showButtons
            />
            <label htmlFor="seat">Number of seat</label>
          </div>
          <div className="flex flex-wrap gap-2 my-3">
            <div className="p-float-label">
              <Chips
                className={classNames({
                  "": true,
                  "p-invalid": state.seat !== state.participants.length,
                })}
                name="participants"
                value={state.participants}
                onChange={(e) =>
                  dispatch({ type: "participants", value: e.value })
                }
                addOnBlur
                max={state.seat}
              />
              <label htmlFor="participants">
                {state.classType === "online"
                  ? "Participants Zoom name"
                  : "Participants name"}
              </label>
            </div>

            {state.seat !== state.participants.length && (
              <div>
                <Message
                  severity="error"
                  text="Please enter all participants name"
                />
              </div>
            )}
          </div>

          <div className="p-float-label">
            <InputNumber
              className="w-full"
              name="payment.amount"
              value={
                state.seat * event[state?.classType]?.cost
                  ? state.seat * event[state?.classType]?.cost
                  : 0
              }
              disabled={true}
              mode="currency"
              currencyDisplay="code"
              currency="IDR"
            />
            <label htmlFor="payment.amount">Amount to be paid</label>
          </div>
          <div className="flex flex-wrap gap-3 my-3">
            <div className="grow p-float-label">
              <Dropdown
                className="w-full"
                name="payment.method"
                options={dataset.data?.activePaymentMethodsSpecialEvent || []}
                optionLabel="via"
                optionValue="_id"
                value={state.payment.method}
                onChange={(e) =>
                  dispatch({ type: "paymentMethod", value: e.value })
                }
                placeholder="Select your payment method"
              />
              <label htmlFor="payment.method">Payment Method</label>
            </div>
            <div className="grow p-float-label">
              <Calendar
                className="w-full"
                name="payment.date"
                dateFormat="D, dd M yy"
                value={state.payment.date}
                onChange={(e) =>
                  dispatch({ type: "paymentDate", value: e.value })
                }
              />
              <label htmlFor="payment.date">Payment Date</label>
            </div>
          </div>

          <div className="my-4">
            {selectedPaymentMethod.data?.paymentMethod?.requireProof &&
              state.classType && (
                <>
                  <BankAccountInfo />
                  <CustomFileUpload
                    maxFileSize={5 * 1024 * 1024}
                    dispatch={dispatch}
                    onError={props.onBookFailed}
                  />
                  <ul className="text-xs italic">
                    <li>We only accept 1 file</li>
                    <li>Maximum size : 5 MB</li>
                    <li>Format : image file / screenshot only</li>
                  </ul>
                </>
              )}
            <div className="text-right">
              <Button
                label="Submit Request"
                onClick={onSubmit}
                disabled={
                  state?.classType && state.payment.method ? false : true
                }
                loading={addEventBookingCard.isLoading}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingFormSpecialEvent;
