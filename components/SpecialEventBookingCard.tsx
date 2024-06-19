import { Types } from "mongoose";
import { useSession } from "next-auth/react";
import { Button } from "primereact/button";
import { Chips } from "primereact/chips";
import { Image } from "primereact/image";
import { Inplace, InplaceDisplay, InplaceContent } from "primereact/inplace";
import { ProgressSpinner } from "primereact/progressspinner";
import { Tag } from "primereact/tag";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import {
  DeleteEventBookingPaymentImage,
  EventBookingCard,
  queryClient,
  UpdateEventBookingRequestStatus,
  UpdateSpecialEventBookingParticipants,
} from "src/api";
import { EventBookingCardStatusInput } from "src/generated/graphql";
import { EventBookingStatusValue } from "src/schema/eventBookingCard";
import { InputTextForm, SelectButtonForm } from "./Form/InputForm";
import { SaveButton } from "./UI/Buttons";
import DTFormat from "./UI/DTFormat";

interface SpecialEventBookingCardI {
  bookingId: Types.ObjectId;
  onSuccess: Function;
  onError: Function;
  onHide: Function;
}

const SpecialEventBookingCard = (props: SpecialEventBookingCardI) => {
  const { bookingId } = props;

  /**
   * Hooks
   */
  const [bookingStatus, setBookingStatus] = useState<EventBookingStatusValue>();
  const [participants, setParticipants] = useState<Array<string>>();

  /**
   * Custom hooks
   */
  const { data: session } = useSession();
  const eventBookingCardData = useQuery(
    ["EventBookingCard", bookingId],
    () => EventBookingCard({ _id: bookingId }),
    {
      refetchOnMount: true,
      onSuccess(data) {
        setParticipants(data.eventBookingCard.participants);
        setBookingStatus(
          data.eventBookingCard.status.value as EventBookingStatusValue
        );
      },
    }
  );
  const updateBookingStatus = useMutation(UpdateEventBookingRequestStatus);
  const deleteProofOfPayment = useMutation(DeleteEventBookingPaymentImage);
  const updateSpecialEventBookingParticipants = useMutation(
    UpdateSpecialEventBookingParticipants
  );

  let defaultValues: {
    _id: Types.ObjectId;
    status: EventBookingCardStatusInput;
  } = {
    _id: bookingId,
    status: {
      value: bookingStatus,
      updatedBy: session.user._id,
      reason: "",
    },
  };

  const methods = useForm({ defaultValues: defaultValues });

  /**
   * Utils
   */
  const onSubmit = async () => {
    // @ts-ignore
    methods.setValue("status.value", bookingStatus);
    const values = methods.getValues();

    try {
      await updateBookingStatus.mutateAsync(values);
      props.onSuccess();
      props.onHide();
    } catch (error) {
      error.response.errors.forEach((err) => props.onError(err));
    }
  };

  const onUpdateParticipants = async () => {
    try {
      await updateSpecialEventBookingParticipants.mutateAsync({
        _id: bookingId,
        participants,
      });
      queryClient.invalidateQueries(["EventBookingCard"]);
      queryClient.invalidateQueries(["SelectedEventBookingCards"]);
      props.onSuccess();
    } catch (error) {
      error.response.errors.forEach((err) => props.onError(err));
    }
  };

  const deleteHandler = async () => {
    try {
      await deleteProofOfPayment.mutateAsync(bookingId);
      props.onSuccess();
    } catch (error) {
      error.response.errors.forEach((err) => props.onError(err));
    }
  };

  if (eventBookingCardData.isLoading)
    return (
      <div className="mt-3 text-center">
        <ProgressSpinner />
      </div>
    );

  const { eventBookingCard } = eventBookingCardData.data;

  return (
    <>
      <div className="bg-wisteria-50 p-2 rounded-sm shadow-1">
        <div className="my-2">
          <div className="flex flex-wrap justify-end gap-2 text-right my-2">
            <Tag>{eventBookingCard.status.value}</Tag>
            <Tag className="bg-wisteria-600">{eventBookingCard.classType}</Tag>
          </div>
          <div className="flex flex-wrap justify-between my-2">
            <div>Booking Code</div>
            <div>{eventBookingCard.bookingCode}</div>
          </div>
          <div className="flex flex-wrap justify-between my-2">
            <div>User</div>
            <div>{eventBookingCard.user.name}</div>
          </div>
          <div className="flex flex-wrap justify-between my-2">
            <div>Seat</div>
            <div>
              <div className="text-right">{eventBookingCard.seat} seat</div>
            </div>
          </div>
          <div>
            <div>Participant names</div>
            <Inplace closable onClose={onUpdateParticipants}>
              <InplaceDisplay>
                <div className="border-wisteria-100 border-1 rounded-md p-2">
                  <div className="text-xs italic text-gray-500 mt-auto">
                    click to edit
                  </div>
                  <div className="my-2 ml-3">
                    {eventBookingCard.participants.join(", ")}
                  </div>
                </div>
              </InplaceDisplay>
              <InplaceContent>
                <div className="my-2">
                  <Chips
                    tooltip="Press enter after every entry update, close to auto save changes"
                    tooltipOptions={{ position: "top" }}
                    value={participants}
                    onChange={(e) => setParticipants(e.value)}
                    addOnBlur
                  />
                </div>
              </InplaceContent>
            </Inplace>
          </div>
        </div>
        <div className="bg-gray-200 p-2 rounded-sm text-sm md:text-base">
          <div className="text-center italic text-sm my-2">Payment</div>
          <div className="flex flex-wrap justify-between">
            <div>Date</div>
            <DTFormat value={eventBookingCard.payment.date} dateOnly />
          </div>
          <div className="flex flex-wrap justify-between my-2">
            <div>Amount</div>
            <div className="ml-auto">
              {`${eventBookingCard.payment.method} - ${new Intl.NumberFormat(
                "id-ID",
                {
                  style: "currency",
                  currency: "IDR",
                  maximumFractionDigits: 0,
                }
              ).format(eventBookingCard.payment.amount)}`}
            </div>
          </div>
          {eventBookingCard.payment.image && (
            <div className="w-full my-2">
              <div>Proof of Payment</div>
              <div className="flex flex-wrap justify-center my-2">
                <div className="relative">
                  <Image
                    src={eventBookingCard.payment.image}
                    alt="payment"
                    width="150"
                    preview
                    downloadable
                    className="px-6 md:px-8"
                  />
                  <div className="absolute top-0 right-0">
                    <Button
                      tooltip="Delete proof of payment"
                      tooltipOptions={{ position: "right" }}
                      icon="pi pi-trash"
                      type="button"
                      className="p-button-danger p-button-outlined p-button-rounded p-button-sm"
                      loading={deleteProofOfPayment.isLoading}
                      onClick={deleteHandler}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {eventBookingCard.status.value === "Pending" && (
        <FormProvider {...methods}>
          <div className="text-center my-4">
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <SelectButtonForm
                name="status.value"
                value={bookingStatus}
                onChange={(e) => {
                  setBookingStatus(e.value);
                }}
                options={[
                  {
                    label: "Pending",
                    value: "Pending",
                  },
                  {
                    label: "Approve",
                    value: "Confirmed",
                  },
                  {
                    label: "Reject",
                    value: "Rejected",
                  },
                ]}
                optionValue="value"
                optionLabel="label"
              />
              {bookingStatus === "Rejected" && (
                <div className="my-3">
                  <InputTextForm
                    label="Rejection reason"
                    name="status.reason"
                  />
                </div>
              )}
              <div className="text-right mt-3">
                <SaveButton
                  onSubmit={onSubmit}
                  loading={updateBookingStatus.isLoading}
                />
              </div>
            </form>
          </div>
        </FormProvider>
      )}
    </>
  );
};

export default SpecialEventBookingCard;
