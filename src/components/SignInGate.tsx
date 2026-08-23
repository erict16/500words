"use client";

import { useApp } from "./AppProvider";

export function SignInGate({ children }: { children: React.ReactNode }) {
  const { configured, user, signIn, startLocal, error } = useApp();

  if (user) return <>{children}</>;

  return (
    <>
      <header className="site-bar">
        <div className="site-bar-inner">
          <span className="site-mark">500 Words</span>
        </div>
      </header>
      <main className="mx-auto flex min-h-[70vh] max-w-md flex-col items-start justify-center gap-7 px-7">
        <h1 className="sign-title">500 Words</h1>
        {configured ? (
          <button type="button" onClick={() => void signIn()} className="btn-google" data-testid="google-signin">
            Continue with Google
          </button>
        ) : null}
        <button type="button" onClick={startLocal} className="chrome-link" data-testid="local-write">
          Write on this device
        </button>
        {error ? <p className="text-[14px] text-red-700">{error}</p> : null}
      </main>
    </>
  );
}
