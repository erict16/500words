"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type WriteFocusValue = {
  focusMode: boolean;
  toggleFocus: () => void;
  exitFocus: () => void;
  enterFocus: () => void;
};

const WriteFocusContext = createContext<WriteFocusValue | null>(null);

function syncDom(on: boolean) {
  const root = document.documentElement;
  if (on) {
    root.dataset.writeFocus = "1";
    root.classList.add("focus-mode-active");
    document.body.classList.add("focus-mode-active");
  } else {
    delete root.dataset.writeFocus;
    root.classList.remove("focus-mode-active");
    document.body.classList.remove("focus-mode-active");
  }
}

export function WriteFocusProvider({ children }: { children: ReactNode }) {
  const [focusMode, setFocusMode] = useState(false);

  const enterFocus = useCallback(() => setFocusMode(true), []);
  const exitFocus = useCallback(() => setFocusMode(false), []);
  const toggleFocus = useCallback(() => setFocusMode((on) => !on), []);

  useEffect(() => {
    document.body.classList.add("write-page-layout");
    return () => {
      document.body.classList.remove("write-page-layout");
      syncDom(false);
    };
  }, []);

  useEffect(() => {
    syncDom(focusMode);
  }, [focusMode]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "F11") {
        e.preventDefault();
        setFocusMode((on) => !on);
        return;
      }
      if (e.key === "Escape" && focusMode) {
        e.preventDefault();
        setFocusMode(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focusMode]);

  const value = useMemo(
    () => ({ focusMode, toggleFocus, exitFocus, enterFocus }),
    [focusMode, toggleFocus, exitFocus, enterFocus],
  );

  return <WriteFocusContext.Provider value={value}>{children}</WriteFocusContext.Provider>;
}

export function useWriteFocus(): WriteFocusValue {
  const ctx = useContext(WriteFocusContext);
  return (
    ctx ?? {
      focusMode: false,
      toggleFocus: () => undefined,
      exitFocus: () => undefined,
      enterFocus: () => undefined,
    }
  );
}
