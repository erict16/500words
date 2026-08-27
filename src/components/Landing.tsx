"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ui } from "@/lib/css";
import { isLocalUid } from "@/lib/identity";
import { WRITE_HREF } from "@/lib/nav";
import { useApp } from "./AppProvider";

export function Landing() {
  const { signIn, configured, profile } = useApp();
  const router = useRouter();
  const signedIn = Boolean(profile && !isLocalUid(profile.uid));

  const auth = () => {
    if (signedIn) {
      router.push(WRITE_HREF);
      return;
    }
    if (configured) void signIn();
    else router.push(WRITE_HREF);
  };

  return (
    <div className="landing-page" data-testid="landing" data-ready="landing">
      <a href="#welcome" className={ui.skip}>
        Skip to content
      </a>
      <header className="landing-bar" id="words-app-bar">
        <div className="landing-bar-inner">
          <Link href="/" className="landing-mark" id="logo" translate="no">
            500 Words
          </Link>
          <div className="landing-auth">
            {signedIn ? (
              <Link href={WRITE_HREF} className="landing-auth-btn" data-testid="landing-write-header">
                Write
              </Link>
            ) : (
              <>
                <button
                  type="button"
                  className="landing-auth-btn"
                  data-testid="landing-login"
                  onClick={auth}
                >
                  Log In
                </button>
                <button
                  type="button"
                  className="landing-auth-btn"
                  data-testid="landing-signup"
                  onClick={auth}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="landing-main" id="welcome">
        <h1 className="landing-h1">Welcome to 500 Words!</h1>
        <p className="landing-lead">
          Private daily writing. Five hundred words, on this device, with no audience
          and no analysis of what you wrote.
        </p>
        <div className="landing-cta">
          {signedIn ? (
            <button type="button" className="landing-cta-btn" onClick={auth} data-testid="landing-write-cta">
              WRITE
            </button>
          ) : (
            <>
              <button type="button" className="landing-cta-btn" onClick={auth}>
                LOG IN
              </button>
              <span className="landing-cta-or">or</span>
              <button type="button" className="landing-cta-btn" onClick={auth}>
                SIGN UP
              </button>
            </>
          )}
        </div>
        <p className="landing-guest">
          <Link href={WRITE_HREF} data-testid="landing-write">
            Write on this device
          </Link>
        </p>
      </main>
    </div>
  );
}
