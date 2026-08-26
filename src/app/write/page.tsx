"use client";

import { BadgeToast } from "@/components/BadgeToast";
import { ConfettiBurst } from "@/components/ConfettiBurst";
import { Editor } from "@/components/Editor";
import { MonthGrid } from "@/components/MonthGrid";
import { WordFooter } from "@/components/WordFooter";
import { WriteFocusProvider, useWriteFocus } from "@/components/WriteFocus";
import { useApp } from "@/components/AppProvider";
import { cx, ui } from "@/lib/css";

function WritePageBody() {
  const { error } = useApp();
  const { focusMode } = useWriteFocus();
  return (
    <main className={cx(ui.page, ui.col, focusMode && "focus-mode-active")} data-ready="write">
      <div className={cx("scrollable-content", focusMode && "focus-mode")}>
        <MonthGrid />
        {error ? <p className="px-4 text-[13px] text-red-700">{error}</p> : null}
        <Editor />
      </div>
      <WordFooter />
      <ConfettiBurst />
      <BadgeToast />
    </main>
  );
}

export default function WritePage() {
  return (
    <WriteFocusProvider>
      <WritePageBody />
    </WriteFocusProvider>
  );
}
