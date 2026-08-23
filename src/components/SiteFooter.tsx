import Link from "next/link";
import { cx, ui } from "@/lib/css";

export function SiteFooter({ children }: { children?: React.ReactNode }) {
  return (
    <footer className={ui.foot}>
      <div className={cx(ui.col, ui.footBar)}>
        <Link href="/" className={ui.footLogo}>
          500 Words
        </Link>
        {children}
      </div>
    </footer>
  );
}
