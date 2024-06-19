import { InputTextForm } from "@/components/Form/InputForm";
import { signOut, useSession } from "next-auth/react";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Messages } from "primereact/messages";
import { ProgressSpinner } from "primereact/progressspinner";
import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import {
  DeleteProfileImage,
  EditUser,
  IsUsernameAvailable,
  UploadProfileImage,
  User,
} from "src/api";
import UsernameValidationResult from "./UsernameValidationResult";

interface IProfileFormProps {
  userId: String;
  firstSignIn?: Boolean;
  onSuccess: (string) => void;
  onError: (any) => void;
}

const ProfileForm = ({ firstSignIn = false, ...props }: IProfileFormProps) => {
  const { data: session } = useSession();

  const { userId, onSuccess, onError } = props;

  const dataset = useQuery(["user", userId], () => User({ _id: userId }));

  const [username, setUsername] = useState("");
  const [triggerUsernameValidation, setTriggerUsernameValidation] =
    useState(false);

  const fileUploadRef = useRef<FileUpload>(null);
  const fileUploadMessageRef = useRef<Messages>(null);

  const usernameInput = useQuery(
    ["usernameQuery", username],
    () => IsUsernameAvailable({ username }),
    {
      enabled: triggerUsernameValidation,
    }
  );

  const validateUsername = (input: string) => {
    setUsername(input);
    methods.setValue("username", input);
  };

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setTriggerUsernameValidation(true);
    }, 1500);

    return () => {
      clearTimeout(timeOut);
      setTriggerUsernameValidation(false);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  const editUser = useMutation(EditUser);

  const methods = useForm({
    defaultValues: {
      _id: "",
      name: "",
      username: "",
      email: "",
      phone: "",
      image: "",
    },
  });

  useEffect(() => {
    methods.setValue("_id", dataset.data?.user?._id || session?.user?._id);
    methods.setValue("name", dataset.data?.user?.name || session?.user?.name);
    methods.setValue(
      "username",
      dataset.data?.user?.username || session?.user?.username
    );
    setUsername(methods.getValues().username);
    methods.setValue(
      "email",
      dataset.data?.user?.email || session?.user?.email
    );
    methods.setValue("phone", dataset.data?.user?.phone || "");
    methods.setValue("image", dataset.data?.user?.image || "");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataset.data]);

  const onSubmit = async () => {
    const values = methods.getValues();

    try {
      await editUser.mutateAsync(values);
      onSuccess("Profile updated");
    } catch (error) {
      error.response.errors.forEach((err) => onError(err));
    }
  };

  const chooseOptions = {
    icon: "pi pi-fw pi-cloud-upload",
    className: "p-button-rounded p-button-outlined p-button-sm",
    label: "Change profile image",
  };

  const uploadProfileImage = useMutation(UploadProfileImage);
  const deleteProfileImage = useMutation(DeleteProfileImage);

  const uploadHandler = async (e) => {
    const image = e.files[0];

    try {
      await uploadProfileImage.mutateAsync({ _id: userId, image });
      onSuccess("Profile image updated");
    } catch (error) {
      error.response.errors.forEach((err) => onError(err));
    }
    e.options.clear();
  };

  const selectHandler = (e) => {
    const fileSize = e.files[0].size;
    const { maxFileSize } = fileUploadRef.current.props;

    if (fileSize > maxFileSize)
      fileUploadMessageRef.current.show({
        severity: "error",
        summary: fileUploadRef.current.props.invalidFileSizeMessageSummary,
      });
  };

  const deleteHandler = async () => {
    try {
      await deleteProfileImage.mutateAsync({ _id: userId });
      onSuccess("Image deleted");
    } catch (error) {
      error.response.errors.forEach((err) => onError(err));
    }
  };

  const isSameUsername =
    username === (dataset.data?.user?.username || session.user.username);

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="hidden">
            <InputTextForm name="_id" label="_id" disabled />
          </div>
          <div className="">
            <div className="text-center mx-auto h-6rem w-6rem shadow-2">
              {uploadProfileImage.isLoading || deleteProfileImage.isLoading ? (
                <div className="mx-auto my-auto">
                  <ProgressSpinner />
                </div>
              ) : (
                <div className="relative">
                  <Avatar
                    size="large"
                    shape="circle"
                    image={dataset.data?.user?.image || "/img/icon/user.png"}
                    className="mx-3 my-4"
                    onImageError={(e) => {
                      (e.target as HTMLImageElement).src = "/img/icon/user.png";
                    }}
                  />

                  {dataset.data?.user?.image && (
                    <div className="absolute top-0 right-0">
                      <Button
                        className="p-button-outlined p-button-danger p-button-rounded w-1rem h-1rem"
                        icon="pi pi-times"
                        tooltip="Remove profile image"
                        type="button"
                        onClick={deleteHandler}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="my-4 text-center">
              <FileUpload
                ref={fileUploadRef}
                mode="basic"
                name="image"
                accept="image/*"
                auto
                customUpload
                maxFileSize={2 * 1024 * 1024}
                uploadHandler={uploadHandler}
                onSelect={selectHandler}
                chooseOptions={chooseOptions}
                invalidFileSizeMessageSummary="Invalid file size"
              />
              <div className="my-1 text-xs italic">Max file size : 2 MB</div>
              <Messages ref={fileUploadMessageRef} />
            </div>
            <div className="my-4 text-center">
              <div className="my-4">
                <InputTextForm name="email" label="Email" disabled />
              </div>
              <div className="my-4">
                <div className="p-inputgroup">
                  <InputTextForm
                    name="username"
                    label="Username"
                    rules={{ required: "Username* (mandatory field)" }}
                    value={username}
                    onChange={(e) => validateUsername(e.target.value)}
                    tooltip="Alphanumeric only"
                    tooltipOptions={{ event: "focus", position: "top" }}
                  />
                  <UsernameValidationResult
                    loading={usernameInput.isLoading}
                    validationResult={usernameInput.data?.isUsernameAvailable}
                    isSameUsername={isSameUsername}
                  />
                </div>
              </div>
              <div className="my-4">
                <InputTextForm
                  name="name"
                  label="Name"
                  rules={{ required: "Name* (mandatory field)" }}
                />
              </div>
              <div className="my-4">
                <InputTextForm
                  name="phone"
                  label="Mobile Phone"
                  keyfilter="pint"
                  rules={{ required: "Mobile Phone* (mandatory field)" }}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-between my-4">
            {firstSignIn && (
              <Button
                type="button"
                className="p-button-text"
                label="Sign Out"
                onClick={() => signOut()}
              />
            )}
            <div className="ml-auto">
              <Button
                icon="pi pi-save"
                label="Save My Profile"
                loading={editUser.isLoading}
                disabled={
                  !isSameUsername && !usernameInput.data?.isUsernameAvailable
                }
              />
            </div>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default ProfileForm;
