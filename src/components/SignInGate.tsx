"use client";

import { useApp } from "./AppProvider";

export function SignInGate({ children }: { children: React.ReactNode }) {
  const { configured, ready, user, signIn, error } = useApp();

  if (!ready) {
    return (
      <main
        className="flex min-h-screen items-center justify-center text-[14px] text-[var(--muted)]"
        data-ready="loading"
      >
        Loading…
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col items-start justify-center gap-6 px-6">
        <h1 className="font-georgia text-4xl">500 Words</h1>
        <p className="text-[16px] leading-relaxed text-[var(--ink)]">
          Private daily writing. Five hundred words. Sign in with Google and type.
        </p>
        {configured ? (
          <button
            type="button"
            onClick={() => void signIn()}
            className="border border-[var(--ink)] bg-[var(--ink)] px-4 py-2 text-[14px] text-[var(--paper)] active:scale-[0.97]"
          >
            Continue with Google
          </button>
        ) : (
          <p className="text-[14px] text-[var(--muted)]">
            This copy isn’t connected to Firebase yet. Add the Firebase keys and
            reload.
          </p>
        )}
        {error ? <p className="text-[14px] text-red-700">{error}</p> : null}
      </main>
    );
  }

  return <>{children}</>;
}
