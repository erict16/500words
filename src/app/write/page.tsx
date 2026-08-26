"use client";

import { BadgeToast } from "@/components/BadgeToast";
import { ConfettiBurst } from "@/components/ConfettiBurst";
import { Editor } from "@/components/Editor";
import { MonthGrid } from "@/components/MonthGrid";
import { WordFooter } from "@/components/WordFooter";
import { WriteFocusProvider } from "@/components/WriteFocus";
import { useApp } from "@/components/AppProvider";
import { cx, ui } from "@/lib/css";

export default function WritePage() {
  const { error } = useApp();
  return (
    <WriteFocusProvider>
      <main className={cx(ui.page, ui.col)} data-ready="write">
        <div className="scrollable-content">
          <MonthGrid />
          {error ? <p className="px-4 text-[13px] text-red-700">{error}</p> : null}
          <Editor />
        </div>
        <WordFooter />
        <ConfettiBurst />
        <BadgeToast />
      </main>
    </WriteFocusProvider>
  );
}
