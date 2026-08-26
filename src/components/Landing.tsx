"use client";

import Link from "next/link";
import { ui } from "@/lib/css";
import { WRITE_HREF } from "@/lib/nav";
import { LandingMenu } from "./LandingMenu";

export function Landing() {
  return (
    <div className="landing-page" data-testid="landing" data-ready="landing">
      <a href="#lets-write" className={ui.skip}>
        Skip to Let’s write
      </a>
      <header className="landing-top">
        <Link href="/" className="landing-mark" id="logo" translate="no">
          500 Words
        </Link>
        <LandingMenu />
      </header>
      <main className="landing-stage">
        <Link href={WRITE_HREF} className="landing-lets-write" id="lets-write" data-testid="landing-write">
          <h1 className="landing-lets-write-text">Let’s write</h1>
          <span className="landing-rule" aria-hidden="true" />
        </Link>
      </main>
    </div>
  );
}
