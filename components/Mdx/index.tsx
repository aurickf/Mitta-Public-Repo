import Image from "next/image";
import Link from "next/link";

export const ResponsiveImage = (props) => (
  <Image alt={props.alt} layout="responsive" {...props} />
);

export const Heading = {
  H1: (props) => <h1 className="faq-header text-3xl my-4">{props.children}</h1>,
  H2: (props) => (
    <h2 className="faq-header text-2xl mt-4 mb-2">{props.children}</h2>
  ),
  H3: (props) => (
    <h3 className="faq-header text-xl mt-4 mb-2">{props.children}</h3>
  ),
  H4: (props) => (
    <h4 className="faq-header text-lg mt-4 mb-2">{props.children}</h4>
  ),
  H5: (props) => <h5 className="faq-header mt-4 mb-2">{props.children}</h5>,
  H6: (props) => <h6 className="faq-header mt-4 mb-2">{props.children}</h6>,
};

export const Url = (props) => {
  return (
    <Link href={props.href}>
      <a className="faq-url">{props.children}</a>
    </Link>
  );
};

export const Text = (props) => (
  <p className="text-neutral-800">{props.children}</p>
);

export const OrderedList = (props) => (
  <ol className="pl-4 list-decimal">{props.children}</ol>
);

export const UnorderedList = (props) => (
  <ol className="pl-4 list-disc">{props.children}</ol>
);
