"use client";

import { useEffect } from "react";
import { useApp } from "./AppProvider";

export function ThemeSync() {
  const { settings } = useApp();
  useEffect(() => {
    document.documentElement.dataset.theme = settings.theme;
  }, [settings.theme]);
  return null;
}
