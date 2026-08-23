import Link from "next/link";

export function SiteFooter({ children }: { children?: React.ReactNode }) {
  return (
    <footer className="site-foot">
      <div className="site-col foot-bar">
        <Link href="/" className="foot-logo">
          500 Words
        </Link>
        {children}
      </div>
    </footer>
  );
}
