"use client";

import { useApp } from "./AppProvider";

export function SignInGate({ children }: { children: React.ReactNode }) {
  const { configured, user, signIn, startLocal, error } = useApp();

  if (user) return <>{children}</>;

  return (
    <>
      <header className="site-bar">
        <span className="site-mark">500 Words</span>
      </header>
      <main className="mx-auto flex min-h-[70vh] max-w-md flex-col items-start justify-center gap-6 px-6">
        <h1 className="font-georgia text-[42px] font-normal tracking-tight">500 Words</h1>
        {configured ? (
          <button type="button" onClick={() => void signIn()} className="btn-ink" data-testid="google-signin">
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
