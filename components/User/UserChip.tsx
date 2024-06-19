import { Avatar } from "primereact/avatar";
import { Chip } from "primereact/chip";

interface UserChipInterface {
  key?: number;
  instructor?: Boolean;
  name?: string;
  image?: string;
}

const UserChip = ({ instructor = false, ...props }: UserChipInterface) => {
  const { name, image } = props;

  let color = "bg-neutral-100";

  if (instructor) {
    color = "bg-purple-200 text-purple-600";
  }

  if (!image)
    return (
      <Chip
        label={name || "n/a"}
        className={`${color} py-0 px-2 text-xs text-center`}
      />
    );

  return (
    <Chip
      label={name || "n/a"}
      image={image || "/img/icon/user.png"}
      className={`${color} py-0 px-2 text-sm text-center`}
      onImageError={(e) => {
        (e.target as HTMLImageElement).src = "/img/icon/user.png";
      }}
    />
  );
};

export default UserChip;
