import { IClassTagProps } from "@/interface/ClassTag";
import { Chip } from "primereact/chip";

const ClassTag = (props: IClassTagProps) => {
  const { tags } = props;

  return (
    <span>
      {tags.map((tag: string, i) => {
        return (
          <Chip
            className="text-center m-1 bg-wisteria-100 text-wisteria-600"
            key={i}
            label={tag}
          />
        );
      })}
    </span>
  );
};

export default ClassTag;
