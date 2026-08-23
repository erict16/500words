"use client";

import { ConfettiBurst } from "@/components/ConfettiBurst";
import { Editor } from "@/components/Editor";
import { MonthGrid } from "@/components/MonthGrid";
import { WordFooter } from "@/components/WordFooter";
import { useApp } from "@/components/AppProvider";

export default function WritePage() {
  const { error } = useApp();
  return (
    <main className="pb-16" data-ready="write">
      <MonthGrid />
      {error ? (
        <p className="px-4 text-[13px] text-red-700">{error}</p>
      ) : null}
      <Editor />
      <WordFooter />
      <ConfettiBurst />
    </main>
  );
}
