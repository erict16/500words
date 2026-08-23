"use client";

import { useApp } from "./AppProvider";
import { SiteFooter } from "./SiteFooter";

export function SignInGate({ children }: { children: React.ReactNode }) {
  const { configured, user, signIn, startLocal, error } = useApp();

  if (user) return <>{children}</>;

  return (
    <>
      <header className="site-bar">
        <div className="site-bar-inner site-col">
          <span className="site-mark">500 Words</span>
        </div>
      </header>
      <main className="site-col">
        <div className="sign-page" data-testid="signin-form">
          {configured ? (
            <button type="button" onClick={() => void signIn()} className="btn-google" data-testid="google-signin">
              Continue with Google
            </button>
          ) : null}
          <div>
            <button type="button" onClick={startLocal} className="chrome-link" data-testid="local-write">
              Write on this device
            </button>
          </div>
          {error ? <p className="mt-4 text-[14px] text-red-700">{error}</p> : null}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
