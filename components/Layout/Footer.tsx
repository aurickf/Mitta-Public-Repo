import Link from "next/link";

const Footer = () => {
  return (
    <footer className="footer w-full fixed bottom-0 z-50  border-t">
      <div className="footer-text py-2 text-sm text-center">
        <Link href={process.env.NEXT_PUBLIC_FOOTER_LINK}>
          {`© ${process.env.NEXT_PUBLIC_FOOTER_COPYRIGHT} - 2022`}
        </Link>
      </div>
    </footer>
  );
};
export default Footer;
