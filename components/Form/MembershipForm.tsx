import { MembershipFormProps } from "@/interface/MembershipForm";
import { Types } from "mongoose";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dropdown } from "primereact/dropdown";
import { Image } from "primereact/image";
import { Inplace, InplaceContent, InplaceDisplay } from "primereact/inplace";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import { useReducer, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  AddMembership,
  DeleteProofOfPayment,
  EditMembership,
  MarkThisAndFollowingMembershipAsInvalid,
  MarkThisMembershipAsInvalid,
  MembershipFormData,
  PaymentMethod,
} from "src/api";
import { Membership, MembershipVerifiedInput } from "src/generated/graphql";
import { NewMembershipInput } from "src/schema/membership";
import BankAccountInfo from "../BankAccountInfo";
import { membershipItemTemplate, membershipValueTemplate } from "../Template";
import { ResetButton } from "../UI/Buttons";
import CustomFileUpload from "./CustomFileUpload";
import { InputTextForm, SelectButtonForm } from "./InputForm";

const MembershipForm = ({
  adminMode = false,
  ...props
}: MembershipFormProps) => {
  const { userId, data, by } = props;

  let initialValue: Omit<NewMembershipInput, "membershipPackageId"> & {
    membershipPackageId: Types.ObjectId | "";
    verified: MembershipVerifiedInput;
  } = {
    user: userId,
    membershipPackageId: "",
    note: "",
    payment: {
      date: new Date(),
      method: "",
      amount: 0,
      url: "",
    },
    verified: {
      isVerified: false,
      by: null,
      reason: "",
    },
    image: null,
  };

  if (data) {
    initialValue = {
      _id: data._id,
      // @ts-ignore
      user: data.user?.name ?? "Deleted User",
      note: data?.note,
      balance: {
        additional: data.balance.additional,
        validUntil: new Date(data.balance.validUntil),
      },
      payment: {
        date: new Date(data.payment.date),
        method: data.payment.method,
        amount: data.payment.amount,
        url: data.payment?.url,
      },
      verified: {
        isVerified: data.verified?.isVerified,
        reason: data.verified?.reason ?? "",
        by,
      },
    };
  }

  const init = (value) => {
    return value;
  };

  const reducer = (state, action) => {
    switch (action.type) {
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
      case "paidAmount":
        return {
          ...state,
          payment: {
            ...state.payment,
            amount: action.value,
          },
        };
      case "proofOfPayment":
        return {
          ...state,
          payment: {
            ...state.payment,
            url: action.value,
          },
        };
      case "membershipPackage":
        return {
          ...state,
          membershipPackageId: action.value,
        };
      case "note":
        return {
          ...state,
          note: action.value,
        };
      case "additionalBalance": {
        return {
          ...state,
          balance: {
            ...state.balance,
            additional: action.value,
          },
        };
      }
      case "validity": {
        return {
          ...state,
          balance: {
            ...state.balance,
            validUntil: action.value,
          },
        };
      }
      case "isVerified": {
        return {
          ...state,
          verified: {
            ...state.verified,
            isVerified: action.value,
          },
        };
      }
      case "reason": {
        return {
          ...state,
          verified: {
            ...state.verified,
            reason: action.value,
          },
        };
      }

      case "reset":
        return init(action.value);
      default:
        break;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialValue, init);

  const dataset = useQuery(["membershipFormData"], () => MembershipFormData());
  const selectedPaymentMethod = useQuery(
    ["selectedPaymentMethod", state.payment.method],
    () => PaymentMethod({ _id: state.payment.method }),
    {
      enabled: !data && !!state.payment.method,
    }
  );

  let defaultValues: Membership;

  const methods = useForm({ defaultValues: defaultValues });
  const toast = useRef<Toast>(null);
  const addMembership = useMutation(AddMembership);
  const editMembership = useMutation(EditMembership);
  const invalidateThisMembership = useMutation(MarkThisMembershipAsInvalid);
  const invalidateThisAndFollowingMembership = useMutation(
    MarkThisAndFollowingMembershipAsInvalid
  );

  const queryClient = useQueryClient();

  const deleteProofOfPayment = useMutation(DeleteProofOfPayment);

  const deleteHandler = async () => {
    try {
      await deleteProofOfPayment.mutateAsync({ _id: data._id });
      dispatch({ type: "proofOfPayment", value: "" });
      toast.current.show({
        severity: "success",
        summary: "Done",
        detail: "Proof of payment deleted",
      });
      queryClient.invalidateQueries(["memberships"]);
    } catch (error) {
      error.response.errors.forEach((err) => props.onError(err));
    }
  };

  const onSubmit = async () => {
    try {
      if (!data) {
        let newMembership = state;

        if (!selectedPaymentMethod.data.paymentMethod.requireProof)
          delete newMembership.payment.image;

        await addMembership.mutateAsync(newMembership);
        props.onSuccess("Request submitted");
      } else {
        await editMembership.mutateAsync(state);
        props.onSuccess("Membership updated");
      }

      await Promise.all([
        queryClient.invalidateQueries(["membershipsByUser", userId]),
        queryClient.invalidateQueries(["memberships"]),
        queryClient.invalidateQueries(["MembershipSection"]),
      ]);
    } catch (error) {
      error.response.errors.forEach((err) => props.onError(err));
    }
    dispatch({ type: "reset", value: initialValue });
  };

  const confirmInvalidateThis = (event) => {
    confirmDialog({
      // @ts-ignore missing key definition from 3rd party
      trigger: event.currentTarget,
      header: "Confirmation",
      message:
        "This action will invalidate THIS membership requests and bookings within, please proceed with extra caution. Are you sure to continue?",
      icon: "pi pi-warning",
      accept: () => acceptInvalidateThis(),
      acceptClassName: "p-button-danger",
      acceptIcon: "pi pi-trash",
      acceptLabel: "Invalide This",
    });
  };

  const confirmInvalidateThisAndFollowing = (event) => {
    confirmDialog({
      // @ts-ignore missing key definition from 3rd party
      trigger: event.currentTarget,
      header: "Confirmation",
      message:
        "This action will invalidate this and ALL following membership requests and bookings within, please proceed with extra caution. Are you sure to continue?",
      icon: "pi pi-warning",
      accept: () => acceptInvalidateThisAndFollowing(),
      acceptClassName: "p-button-danger",
      acceptIcon: "pi pi-trash",
      acceptLabel: "Invalide This and Following",
    });
  };

  const acceptInvalidateThis = async () => {
    try {
      await invalidateThisMembership.mutateAsync({
        _id: data._id,
        updatedBy: by,
      });
      props.onSuccess("Membership invalidated");
    } catch (error) {
      error.response.errors.forEach((err) => props.onError(err));
    }
  };

  const acceptInvalidateThisAndFollowing = async () => {
    try {
      await invalidateThisAndFollowingMembership.mutateAsync({
        _id: data._id,
        updatedBy: by,
      });
      props.onSuccess("Membership invalidated");
    } catch (error) {
      error.response.errors.forEach((err) => props.onError(err));
    }
  };

  /**
   * Renders
   */
  const userProfile = (
    <div className="my-2 w-full">
      {data?.user ? (
        <span className="p-float-label">
          <InputText
            name="user.name"
            className="w-full"
            value={state.user}
            disabled
            readOnly
          />
          <label htmlFor="user.name">User</label>
        </span>
      ) : (
        <div>Deleted User</div>
      )}
    </div>
  );

  const paidAmount = (
    <div className="my-2 w-full md:w-1/2">
      <span className="p-float-label">
        <InputNumber
          value={state.payment.amount}
          onValueChange={(e) =>
            dispatch({ type: "paidAmount", value: e.value })
          }
          className="w-full"
          name="payment.amount"
          locale="ID"
          mode="currency"
          currency="IDR"
          min={0}
          step={1000}
        />
        <label htmlFor="payment.amount">Paid Amount</label>
      </span>
    </div>
  );

  const additionalBalance = (
    <div className="my-2 w-full">
      <span className="p-float-label">
        <InputNumber
          id="additionalBalanceInput"
          className="w-full"
          showButtons
          value={state.balance?.additional}
          onChange={(e) =>
            dispatch({ type: "additionalBalance", value: e.value })
          }
        />
        <label htmlFor="additionalBalanceInput">Additional Balance</label>
      </span>
    </div>
  );

  const membershipPackage = (
    <>
      <div className="my-2 w-full">
        <span className="p-float-label">
          <Dropdown
            className="w-full"
            name="membershipPackageId"
            options={dataset.data?.activeMembershipPackages || []}
            optionLabel="name"
            optionValue="_id"
            itemTemplate={membershipItemTemplate}
            valueTemplate={membershipValueTemplate}
            value={state?.membershipPackageId}
            onChange={(e) => {
              dispatch({ type: "membershipPackage", value: e.value });
            }}
          />
          <label htmlFor="membershipPackageId">Membership Package</label>
        </span>
      </div>
    </>
  );

  const method = (
    <div className="my-2 w-full">
      <span className="p-float-label">
        {data ? (
          <InputText
            value={state.payment.method}
            className="w-full"
            onChange={(e) =>
              dispatch({ type: "paymentMethod", value: e.target.value })
            }
          />
        ) : (
          <Dropdown
            className="w-full"
            name="payment.method"
            options={dataset.data?.activePaymentMethodsMembership || []}
            optionLabel="via"
            optionValue="_id"
            value={state.payment?.method}
            onChange={(e) => {
              dispatch({ type: "paymentMethod", value: e.value });
            }}
          />
        )}

        <label htmlFor="payment.method">Payment Method</label>
      </span>
    </div>
  );

  const paymentDate = (
    <div className="my-2 w-full md:w-1/2 ">
      <span className="p-float-label">
        <Calendar
          className="w-full"
          name="payment.date"
          dateFormat="dd MM yy"
          value={state?.payment?.date}
          onChange={(e) => dispatch({ type: "paymentDate", value: e.value })}
        />
        <label htmlFor="payment.date">Payment Date</label>
      </span>
    </div>
  );

  const notes = (
    <div
      className={classNames(
        { "my-2 w-full md:w-1/2": adminMode },
        { "my-2 w-full ": !adminMode }
      )}
    >
      <span className="p-float-label">
        <InputText
          className="w-full"
          name="note"
          disabled={adminMode}
          value={state?.note}
          onChange={(e) => {
            dispatch({ type: "note", value: e.target.value });
          }}
        />
        <label htmlFor="note">Notes</label>
      </span>
    </div>
  );

  const validityDate = (
    <div className="field col-12">
      <span className="p-float-label">
        <Calendar
          name="balance.validUntil"
          dateFormat="dd MM yy"
          className="w-full"
          value={state.balance?.validUntil}
          onChange={(e) => dispatch({ type: "validity", value: e.value })}
        />
        <label htmlFor="balance.validUntil">Valid Until</label>
      </span>
    </div>
  );

  const membershipStatus = (
    <>
      <div className="my-2 w-full text-center">
        <SelectButtonForm
          name="verified.isVerified"
          value={state.verified.isVerified}
          onChange={(e) =>
            dispatch({ type: "isVerified", value: e.target.value })
          }
          options={[
            {
              label: "Pending",
              value: null,
            },
            {
              label: "Approve",
              value: true,
            },
            {
              label: "Reject",
              value: false,
            },
          ]}
          optionValue="value"
          optionLabel="label"
        />
      </div>
      {state.verified.isVerified === false && (
        <div className="my-2 w-full p-float-label">
          <InputText
            name="verified.reason"
            className="w-full"
            value={state.verified.reason}
            onChange={(e) =>
              dispatch({ type: "reason", value: e.target.value })
            }
          />
          <label htmlFor="verified.reason">Rejection reason</label>
        </div>
      )}
    </>
  );

  const proofOfPayment = state.payment?.url?.length > 0 && (
    <div className="my-2 w-full">
      <div>Proof of Payment</div>
      <div className="flex justify-center ">
        <div className="relative">
          <Image
            src={state.payment.url}
            alt="payment"
            height="200px"
            width="100px"
            preview
            downloadable
            role="img"
            className="px-12"
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
  );

  const fileUpload = (
    <div className="my-2 w-full">
      <BankAccountInfo />
      <CustomFileUpload
        maxFileSize={5 * 1024 * 1024}
        dispatch={dispatch}
        onError={props.onError}
      />
      <div className="my-2 text-xs italic">
        <ul>
          <li>Proof of payment is mandatory for selected payment method</li>
          <li>We only accept 1 file</li>
          <li>Maximum size : 5 MB</li>
          <li>Format : image file / screenshot only</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="mt-3">
      <Toast ref={toast}></Toast>
      <ConfirmDialog className="w-full md:w-6/12" />

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="">
            <div className="hidden">
              <InputTextForm name="user" label="User._Id" disabled={true} />
            </div>
            {adminMode ? (
              <>
                <div className="md:flex gap-2">
                  {userProfile}
                  {notes}
                </div>
                {method}
                <div className="md:flex gap-2">
                  {paymentDate}
                  {paidAmount}
                </div>
                {validityDate}
                {additionalBalance}
                {proofOfPayment}
                {data.verified.isVerified === null && membershipStatus}
              </>
            ) : (
              <>
                {membershipPackage}
                <div className="md:flex gap-2">
                  {state.membershipPackageId && method}
                  {state.membershipPackageId && paymentDate}
                </div>
                {selectedPaymentMethod.data && notes}
                {selectedPaymentMethod.data?.paymentMethod?.requireProof &&
                  state.payment?.url?.length === 0 &&
                  fileUpload}
              </>
            )}
          </div>
          <div className="flex gap-2 flex-wrap justify-end mt-3">
            <div className="flex">
              <ResetButton
                onClick={() => {
                  dispatch({ type: "reset", value: initialValue });
                }}
              />
              <Button
                icon="pi pi-save"
                label={!adminMode ? "Request for Validation" : "Save"}
                onSubmit={onSubmit}
                loading={addMembership.isLoading || editMembership.isLoading}
                disabled={
                  (!adminMode && !selectedPaymentMethod.data) ||
                  invalidateThisMembership.isLoading ||
                  invalidateThisMembership.isLoading
                }
              />
            </div>
          </div>
          {adminMode && data.verified.isVerified && (
            <Inplace className="mt-5">
              <InplaceDisplay>
                <div className="w-full">
                  <Button
                    type="button"
                    text
                    severity="danger"
                    label="Mark as Invalid"
                    className="w-full text-center"
                  />
                </div>
              </InplaceDisplay>
              <InplaceContent>
                <div className="flex gap-5 flex-wrap justify-between mt-12">
                  <div className="text-red-600 mx-auto font-bold flex gap-2 items-center">
                    <i className="pi pi-exclamation-triangle" />
                    Please proceed with caution
                  </div>
                  <Button
                    type="button"
                    label="Mark This as Invalid"
                    severity="danger"
                    onClick={confirmInvalidateThis}
                    loading={invalidateThisMembership.isLoading}
                    disabled={
                      addMembership.isLoading ||
                      editMembership.isLoading ||
                      invalidateThisAndFollowingMembership.isLoading
                    }
                    className="w-full"
                  />
                  <Button
                    type="button"
                    label="Mark This and Following as Invalid"
                    severity="danger"
                    onClick={confirmInvalidateThisAndFollowing}
                    loading={invalidateThisAndFollowingMembership.isLoading}
                    disabled={
                      addMembership.isLoading ||
                      editMembership.isLoading ||
                      invalidateThisMembership.isLoading
                    }
                    className="w-full"
                  />
                </div>
              </InplaceContent>
            </Inplace>
          )}
        </form>
      </FormProvider>
    </div>
  );
};

export default MembershipForm;
