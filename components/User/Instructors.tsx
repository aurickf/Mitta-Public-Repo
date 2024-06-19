import { Avatar } from "primereact/avatar";
import { Tooltip } from "primereact/tooltip";
import { EventInstructor, User } from "src/generated/graphql";
import { AvatarGroup } from "primereact/avatargroup"; //Optional for grouping

import UserChip from "./UserChip";

interface InstructorsInterface {
  value: Array<User> | Array<EventInstructor>;
  mode?: "image" | null;
  size?: "normal" | "large";
}

const Instructors = ({
  value,
  mode,
  size = "normal",
}: InstructorsInterface) => {
  if (value[0] === null) return <></>;

  const instructorNames = value.flatMap((v) => v.name).join(", ");

  switch (mode) {
    case "image":
      return (
        <div className="w-min">
          <Tooltip target=".avatar-target" showDelay={100} />
          <AvatarGroup
            className="avatar-target cursor-pointer"
            data-pr-tooltip={instructorNames}
            data-pr-position="bottom"
          >
            {value.map((instructor, i) => {
              const nameSplit = instructor?.name.split(" ");
              const initial = nameSplit.map((word: string) =>
                word[0].toUpperCase()
              );
              if (instructor?.image)
                return (
                  <Avatar
                    key={i}
                    // className="border-circle surface-border border-1 shadow-1"
                    className="rounded-full avatar-border"
                    shape="circle"
                    size={size}
                    image={instructor?.image}
                    imageAlt={initial.join("")}
                    onImageError={(e) =>
                      ((e.target as HTMLImageElement).src =
                        "/img/icon/user.png")
                    }
                  />
                );

              return (
                <Avatar
                  key={i}
                  // className="bg-purple-600 text-purple-200 border-1 border-circle  cursor-pointer"
                  className="rounded-full bg-wisteria-600 text-wisteria-300 avatar-border cursor-pointer"
                  shape="circle"
                  size={size}
                  label={initial.join("")}
                />
              );
            })}
          </AvatarGroup>
        </div>
      );

    default:
      return (
        <div className="flex gap-1 flex-wrap">
          {value.map((instructor, i) => (
            <div key={i}>
              <UserChip instructor name={instructor?.name} />
            </div>
          ))}
        </div>
      );
  }
};

export default Instructors;
