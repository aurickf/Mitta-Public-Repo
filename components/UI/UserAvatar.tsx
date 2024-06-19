import React from "react";
import { Avatar } from "primereact/avatar";
import { useSession } from "next-auth/react";

const UserAvatar = (props) => {
  const { className } = props;

  const { data: session } = useSession();

  return (
    <div
      onClick={props.onClick}
      className={`flex p-2 rounded-md ${className} text-wisteria-700 hover:bg-wisteria-200 hover:text-purple-800 `}
    >
      <span className="pr-3 my-auto hidden md:inline ">
        {session.user.name}
      </span>
      <Avatar
        image={session.user?.image || "/img/icon/user.png"}
        onImageError={(e) => {
          (e.target as HTMLImageElement).src = "/img/icon/user.png";
        }}
        imageAlt="user avatar"
        shape="circle"
        size="large"
      />
    </div>
  );
};

export default UserAvatar;
