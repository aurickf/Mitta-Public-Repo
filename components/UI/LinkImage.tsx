import Image from "next/image";
import Link from "next/link";

const LinkImage = ({
  image = null,
  href = "#",
  height = "80px",
  width = "120px",
  ...props
}) => {
  return (
    <div className="border-1 border-wisteria-600 rounded-md bg-white/70 px-2 py-2">
      <Link href={href}>
        <a>
          {image ? (
            <div className="">
              <Image
                src={image}
                alt={props.label}
                height={height}
                width={width}
              />
              <div className="text-center text-wisteria-400 pt-3 ">
                {props.label}
              </div>
            </div>
          ) : (
            <div>{props.label}</div>
          )}
        </a>
      </Link>
    </div>
  );
};

export default LinkImage;
