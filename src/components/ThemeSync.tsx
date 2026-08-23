"use client";

import { useEffect } from "react";
import { useApp } from "./AppProvider";

export function ThemeSync() {
  const { settings } = useApp();
  useEffect(() => {
    document.documentElement.dataset.theme = settings.theme;
    document.documentElement.dataset.hydrated = "1";
    document.documentElement.style.colorScheme =
      settings.theme === "dark" ? "dark" : "light";
  }, [settings.theme]);
  return null;
}
