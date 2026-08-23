"use client";

import { useApp } from "@/components/AppProvider";
import type { FontId, ThemeId } from "@/lib/types";

const FONTS: { id: FontId; label: string }[] = [
  { id: "georgia", label: "Georgia" },
  { id: "palatino", label: "Palatino" },
  { id: "times", label: "Times" },
  { id: "helvetica", label: "Helvetica" },
  { id: "courier", label: "Courier" },
];

const COMMON_ZONES = [
  "UTC",
  "America/Los_Angeles",
  "America/Denver",
  "America/Chicago",
  "America/New_York",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
  "Australia/Sydney",
];

function timeZones(): string[] {
  try {
    if (typeof Intl !== "undefined" && "supportedValuesOf" in Intl) {
      return Intl.supportedValuesOf("timeZone");
    }
  } catch {
    /* ignore */
  }
  return COMMON_ZONES;
}

export default function SettingsPage() {
  const { settings, updateSettings, profile, downloadExport, updateProfile, entry } = useApp();
  const zones = timeZones();
  const extra = zones.filter((z) => !COMMON_ZONES.includes(z));
  if (
    settings.timezone &&
    !COMMON_ZONES.includes(settings.timezone) &&
    !extra.includes(settings.timezone)
  ) {
    extra.unshift(settings.timezone);
  }

  return (
    <main className="page site-col">
      <h1 className="page-title">Settings</h1>
      <p className="page-kicker">Signed in as {profile?.email}</p>

      <label className="field">
        Name on the public page
        <input
          type="text"
          defaultValue={profile?.displayName ?? ""}
          onBlur={(e) => updateProfile({ displayName: e.target.value })}
          data-testid="display-name"
        />
      </label>

      <label className="field">
        Font
        <select
          value={settings.font}
          onChange={(e) => updateSettings({ font: e.target.value as FontId })}
          data-testid="font"
        >
          {FONTS.map((f) => (
            <option key={f.id} value={f.id}>
              {f.label}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        Font size · {settings.fontSize}px
        <input
          type="range"
          min={16}
          max={36}
          step={1}
          value={settings.fontSize}
          onChange={(e) => updateSettings({ fontSize: Number(e.target.value) })}
          data-testid="font-size"
        />
      </label>

      <label className="field">
        Line height · {settings.lineHeight.toFixed(2)}
        <input
          type="range"
          min={1.3}
          max={2.2}
          step={0.05}
          value={settings.lineHeight}
          onChange={(e) => updateSettings({ lineHeight: Number(e.target.value) })}
        />
      </label>

      <label className="field">
        Paragraph spacing · {settings.paragraphSpacing}
        <input
          type="range"
          min={0}
          max={4}
          step={1}
          value={settings.paragraphSpacing}
          onChange={(e) =>
            updateSettings({ paragraphSpacing: Number(e.target.value) })
          }
        />
      </label>

      <fieldset className="field" style={{ border: 0, padding: 0 }}>
        <legend>Theme</legend>
        <div className="mt-2 flex gap-4">
          {(["light", "dark", "sepia"] as ThemeId[]).map((theme) => (
            <label key={theme} className="text-[15px]">
              <input
                type="radio"
                name="theme"
                checked={settings.theme === theme}
                onChange={() => updateSettings({ theme })}
                className="mr-2"
                data-testid={`theme-${theme}`}
              />
              {theme}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="mt-6 flex items-center gap-2 text-[15px]">
        <input
          type="checkbox"
          checked={settings.hideChrome}
          onChange={(e) => updateSettings({ hideChrome: e.target.checked })}
        />
        Hide the header while typing
      </label>

      <label className="mt-4 flex items-center gap-2 text-[15px]">
        <input
          type="checkbox"
          checked={settings.lockEdits}
          onChange={(e) => updateSettings({ lockEdits: e.target.checked })}
          data-testid="lock-edits"
        />
        Lock today after 500 words (you can still read it)
      </label>

      <label className="field">
        Timezone
        <select
          value={settings.timezone}
          onChange={(e) => updateSettings({ timezone: e.target.value })}
          data-testid="timezone"
        >
          <optgroup label="Common">
            {COMMON_ZONES.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </optgroup>
          {extra.length ? (
            <optgroup label="All">
              {extra.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </optgroup>
          ) : null}
        </select>
      </label>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          className="border border-[var(--ink)] px-3 py-2 text-[14px] active:scale-[0.97]"
          onClick={() => void downloadExport()}
          data-testid="export"
        >
          Export entries
        </button>
        <button
          type="button"
          className="border border-[var(--ink)] px-3 py-2 text-[14px] active:scale-[0.97]"
          onClick={() => window.print()}
          data-testid="print"
        >
          Print {entry.date}
        </button>
      </div>

      <p className="page-kicker" style={{ marginTop: 36 }}>
        Typing autosaves. ⌘S (or Ctrl-S) saves now.
      </p>

      <p
        className={`mt-10 font-${settings.font} text-[var(--ink)]`}
        style={{ fontSize: settings.fontSize, lineHeight: settings.lineHeight }}
        data-testid="font-preview"
      >
        The quick brown fox writes five hundred words and does not look at
        Twitter until the strike is in the box.
      </p>
    </main>
  );
}
