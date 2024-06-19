import DTFormat from "@/components/UI/DTFormat";
import Instructors from "@/components/User/Instructors";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { AddBookingCard } from "src/api";
import { RegularClass, User } from "src/generated/graphql";
import { InputNumberForm, InputTextForm, RadioButtonForm } from "./InputForm";

interface IBookingFormProps {
  booker: Partial<User>;
  user: Partial<User>;
  regularClass?: RegularClass;
  onBookSuccess: Function;
  onBookFailed: Function;
}

const BookingForm = (props: IBookingFormProps) => {
  const { booker, user, regularClass } = props;

  const toast = useRef<Toast>();
  const [classType, setClassType] = useState(null);
  const queryClient = useQueryClient();

  let maxSeat = {
    offline: 1,
    online: 1,
  };

  if (user.membership.isVIP || booker.role.isAdmin) {
    maxSeat = {
      offline: regularClass.offline.availability,
      online: regularClass.online.availability,
    };
  }

  if (booker.role.isAdmin) {
    maxSeat = {
      offline: regularClass.offline.availability + 10,
      online: regularClass.online.availability + 10,
    };
  }

  const defaultValues = {
    user: user._id,
    regularClass: regularClass._id,
    classType,
    seat: 1,
    booker: booker._id,
    updatedBy: booker._id,
  };

  const methods = useForm({ defaultValues: defaultValues });

  const invalidateQuery = async () => {
    await Promise.all([
      queryClient.invalidateQueries(["MembershipSection"]),
      queryClient.invalidateQueries(["MyBookingSection"]),
      queryClient.invalidateQueries(["SearchClassesQuery"]),
    ]);
  };

  const addBookingCard = useMutation(AddBookingCard, {
    onSuccess(data) {
      if (data.addBookingCard.length > 1) {
        props.onBookSuccess(`${data.addBookingCard.length} bookings confirmed`);
      } else {
        props.onBookSuccess(
          `Booking ${data.addBookingCard[0].bookingCode} confirmed`
        );
      }
      invalidateQuery();
    },
  });

  const onSubmit = async () => {
    try {
      const values = methods.getValues();
      values.classType = classType;
      await addBookingCard.mutateAsync(values);
    } catch (error) {
      error.response?.errors.forEach((err) => props.onBookFailed(err));
    }
  };

  const updateClassTypeandMaxSeat = (e) => {
    setClassType(e.value);
    methods.reset();
  };

  return (
    <>
      <Toast ref={toast} />
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="hidden">
            <InputTextForm label="user" name="user" disabled={true} />
            <InputTextForm
              label="regularClass"
              name="regularClass"
              disabled={true}
            />
          </div>
          <div className="flex justify-between">
            <div className="text-2xl my-auto mr-2">
              {regularClass.details.title}
            </div>
            <div className="">
              <Instructors value={regularClass.instructors} />
            </div>
          </div>
          <div className="my-3">
            <DTFormat value={regularClass.schedule.date} />
          </div>
          <div className="flex-inline md:flex justify-around gap-3 my-4">
            <div className="field-radiobutton">
              <RadioButtonForm
                id="rb-1"
                name="classType"
                label={`🌏 Online - ${regularClass.online.availability} seat left `}
                value="online"
                checked={classType === "online"}
                onChange={updateClassTypeandMaxSeat}
                disabled={
                  !booker.role.isAdmin && regularClass.online.availability < 1
                }
              />
            </div>
            <div className="field-radiobutton">
              <RadioButtonForm
                id="rb-2"
                name="classType"
                label={`🏠 Offline - ${regularClass.offline.availability}  seat left`}
                value="offline"
                checked={classType === "offline"}
                onChange={updateClassTypeandMaxSeat}
                disabled={
                  !booker.role.isAdmin && regularClass.offline.availability < 1
                }
              />
            </div>
          </div>
          <div>
            <div>
              <InputNumberForm
                name="seat"
                label="Number of seat"
                suffix=" seat"
                min={1}
                max={maxSeat[classType]}
                disabled={
                  (classType ? false : true) ||
                  !(user.membership.isVIP || booker.role.isAdmin)
                }
                showButtons
              />
            </div>
            <div className="flex gap-4 justify-between my-4">
              <div className="my-auto">
                {booker.role.isAdmin && (
                  <span className="text-xs text-red-500">
                    As admin you have access to 10 overbook
                  </span>
                )}
              </div>
              <Button
                label="Book Now"
                loading={addBookingCard.isLoading}
                disabled={classType ? false : true}
              />
            </div>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default BookingForm;
