import studioLogo from "@/image/logo.png";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { DataView } from "primereact/dataview";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { Menubar } from "primereact/menubar";
import { OverlayPanel } from "primereact/overlaypanel";
import { ProgressSpinner } from "primereact/progressspinner";
import { ScrollPanel } from "primereact/scrollpanel";
import { Sidebar } from "primereact/sidebar";
import { Toast } from "primereact/toast";
import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  DeleteAllReadMessagesForUser,
  GetMessage,
  GetMessagesForUser,
  MarkAllMessagesAsReadForUser,
} from "src/api";
import ProfileForm from "../Form/ProfileForm";
import DTFormat from "../UI/DTFormat";
import UserAvatar from "../UI/UserAvatar";

const templateMenu = (item, options) => {
  return (
    <Link href={item.target}>
      <a className={`${options.className}`}>
        <i className={options.iconClassName}></i>
        {item.label}
      </a>
    </Link>
  );
};

const menuManageItems = [
  {
    label: "Yoga Class",
    icon: "pi pi-heart",
    items: [
      {
        label: "Schedule",
        icon: "pi pi-calendar",
        target: "/manage/schedule",
        template: templateMenu,
      },
      {
        label: "Template",
        icon: "pi pi-clone",
        target: "/manage/template",
        template: templateMenu,
      },
      {
        label: "Special Class Registration",
        icon: "pi pi-file",
        target: "/manage/event",
        template: templateMenu,
      },
      {
        label: "Series",
        icon: "pi pi-list",
        target: "/manage/series",
        template: templateMenu,
      },
    ],
  },
  {
    label: "Membership",
    icon: "pi pi-id-card",
    items: [
      {
        label: "Request and Approval",
        icon: "pi pi-check",
        target: "/manage/membership",
        template: templateMenu,
      },
    ],
  },

  {
    label: "Archived Proof of Payment",
    icon: "pi pi-money-bill",
    target: "/manage/archived",
    template: templateMenu,
  },
  {
    label: "Booking",
    icon: "pi pi-ticket",
    target: "/manage/booking",
    template: templateMenu,
  },

  {
    label: "User",
    icon: "pi pi-users",
    target: "/manage/user",
    template: templateMenu,
  },

  {
    separator: true,
  },

  {
    label: "Application Settings",
    icon: "pi pi-cog",
    target: "/manage/settings",
    template: templateMenu,
  },

  {
    label: "Feature",
    icon: "pi pi-box",
    target: "/manage/feature",
    template: templateMenu,
  },
];

export const menuSpeedDial = menuManageItems
  .map((item) => {
    if (item.icon)
      return {
        icon: item.icon,
        target: item.target,
        template: templateMenu,
      };
  })
  .filter((item) => item);

const menuHome = {
  label: "Home",
  icon: "pi pi-home",
  target: "/",
  template: templateMenu,
};

const menuManage = {
  label: "Manage",
  icon: "pi pi-briefcase",
  items: menuManageItems,
};

const menuTools = {
  label: "Tools",
  icon: "pi pi-wrench",
  items: [
    {
      label: "Analysis",
      icon: "pi pi-chart-line",
      items: [
        {
          label: "Log",
          icon: "pi pi-book",
          target: "/tools/log",
          template: templateMenu,
        },
        {
          label: "Statistic Report",
          icon: "pi pi-th-large",
          target: "/tools/report",
          template: templateMenu,
        },
      ],
    },
    {
      label: "Other",
      icon: "pi pi-ellipsis-h",
      items: [
        {
          label: "Storage Clean Up",
          icon: "pi pi-trash",
          target: "/tools/storage",
          template: templateMenu,
        },
      ],
    },
  ],
};

const menuAttendance = {
  label: "Attendance",
  icon: "pi pi-check-square",
  target: "/attendance",
  template: templateMenu,
};

const menuFaq = {
  label: "FAQ",
  icon: "pi pi-question-circle",
  target: "/faq",
  template: templateMenu,
};

const TopMenu = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  /**
   * Toast Message
   */
  const toast = useRef<Toast>(null);

  const onSubmitSuccess = (message) => {
    setShowSidebar(false);
    toast.current.show({
      severity: "success",
      summary: "Done",
      detail: message,
    });
    queryClient.invalidateQueries(["user", session.user._id]);
    router.reload();
  };

  const onSubmitError = (error) => {
    toast.current.show({
      severity: "error",
      summary: "Failed",
      detail: `${error.message}`,
    });
  };

  /**
   * Inbox message
   */
  const op = useRef<OverlayPanel>(null);
  const messagesQuery = useQuery(["allMessage"], () =>
    GetMessagesForUser({ _id: session.user._id })
  );
  const [selectedMessage, setSelectedMessage] = useState(null);
  const selectedMessageQuery = useQuery(
    ["selectedMessage", selectedMessage],
    () => GetMessage({ _id: selectedMessage }),
    {
      enabled: !!selectedMessage,
      onSuccess() {
        queryClient.invalidateQueries(["allMessage"]);
      },
    }
  );

  const markAsRead = useMutation(MarkAllMessagesAsReadForUser, {
    onSuccess() {
      queryClient.invalidateQueries(["allMessage"]);
    },
  });

  const deleteAllRead = useMutation(DeleteAllReadMessagesForUser, {
    onSuccess() {
      queryClient.invalidateQueries(["allMessage"]);
    },
  });

  const markAsReadHandler = async () => {
    try {
      const res = await markAsRead.mutateAsync({ _id: session.user._id });
      op.current?.hide();
      onSubmitSuccess(
        `${res.markAllMessagesAsReadForUser} message(s) marked as read.`
      );
    } catch (error) {
      error.response.errors.forEach((err) => onSubmitError(err));
    }
  };

  const deleteAllReadHandler = async () => {
    try {
      const res = await deleteAllRead.mutateAsync({ _id: session.user._id });
      op.current?.hide();
      onSubmitSuccess(
        `${res.deleteAllReadMessagesForUser} message(s) deleted.`
      );
    } catch (error) {
      error.response.errors.forEach((err) => onSubmitError(err));
    }
  };

  const messageTemplate = (message) => {
    return (
      <div className="w-full">
        <div className="my-1 text-sm italic text-500">
          <DTFormat value={message?.createdAt} />
        </div>
        <div className="my-1">
          <Button
            className="p-button-link"
            onClick={() => {
              setShowMessageDialog(true);
              setSelectedMessage(message._id);
            }}
          >
            {!message.isRead && (
              <i className="pi pi-circle-fill text-wisteria-400 text-xs pr-2 " />
            )}
            <div className={`${!message.isRead ? "font-bold" : "text-500"}  `}>
              {message.title}
            </div>
          </Button>
        </div>
      </div>
    );
  };

  /**
   * Renders
   */
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const menuBarEnd = (
    <div id="menuAvatar">
      <div className="flex gap-1">
        <Button
          className="p-button-rounded my-auto"
          onClick={(e) => op.current?.toggle(e)}
        >
          <i className="pi pi-envelope p-overlay-badge mx-auto">
            {messagesQuery.data?.getUnreadNumberForUser > 0 && (
              <Badge
                value={messagesQuery.data?.getUnreadNumberForUser}
                severity="warning"
                className="p-0"
              />
            )}
          </i>
        </Button>
        <Button
          className="p-button-link p-0"
          onClick={() => {
            setShowSidebar(true);
          }}
        >
          <div className="ml-auto">
            <UserAvatar />
          </div>
        </Button>
      </div>
    </div>
  );

  const menuLogo = (
    <div className="rounded-full border border-wisteria-400 bg-white shadow-md py-1 px-2 mr-2">
      <Image
        loading="lazy"
        src={studioLogo}
        alt="studio logo"
        height={45}
        width={45}
      />
    </div>
  );

  let menuModel = [];

  menuModel = [menuHome];

  if (session?.user?.role?.isInstructor && !session?.user?.role?.isAdmin)
    menuModel = [menuHome, menuAttendance, menuFaq];

  if (session?.user?.role?.isAdmin)
    menuModel = [menuHome, menuManage, menuTools, menuAttendance, menuFaq];

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        visible={showMessageDialog}
        onHide={() => setShowMessageDialog(false)}
        header={selectedMessageQuery.data?.getMessage.title}
        className="w-full md:w-6/12 lg:w-4/12"
      >
        {selectedMessageQuery.isLoading ? (
          <div className="mb-4 text-center">
            <ProgressSpinner />
          </div>
        ) : (
          <div className="mb-4">
            <div className="text-500 text-sm italic">
              Sent on{" "}
              <DTFormat
                value={selectedMessageQuery.data?.getMessage.createdAt}
              />
            </div>
            <div>{selectedMessageQuery.data?.getMessage.message}</div>
          </div>
        )}
      </Dialog>

      <Sidebar
        position="right"
        visible={showSidebar}
        onHide={() => setShowSidebar(false)}
      >
        <ProfileForm
          userId={session?.user._id}
          onSuccess={onSubmitSuccess}
          onError={onSubmitError}
        />
        <Divider />
        <div className="text-center">
          <Button
            label="Logout"
            icon="pi pi-sign-out"
            className="p-button-text"
            onClick={() => signOut()}
          />
        </div>
      </Sidebar>
      <div className="w-full fixed top-0 z-50 shadow-md">
        <Menubar
          model={menuModel}
          start={menuLogo}
          end={menuBarEnd}
          className="bg-wisteria-100"
        />
        <OverlayPanel
          ref={op}
          onBlur={() => op.current.hide()}
          className="w-full md:w-6/12 lg:w-5/12"
        >
          <ScrollPanel style={{ height: "300px" }}>
            <DataView
              emptyMessage="No message found."
              value={messagesQuery.data?.getMessagesForUser}
              itemTemplate={messageTemplate}
            />
          </ScrollPanel>
          <div className="text-center">
            {messagesQuery.data?.getUnreadNumberForUser > 0 && (
              <Button
                className="p-button-link text-xs pb-0"
                label="Mark all as read"
                onClick={markAsReadHandler}
              />
            )}

            {messagesQuery.data?.getMessagesForUser?.length > 0 && (
              <Button
                className="p-button-link text-xs pb-0"
                label="Delete all read messages"
                onClick={deleteAllReadHandler}
              />
            )}
          </div>
        </OverlayPanel>
      </div>
    </>
  );
};

export default TopMenu;
