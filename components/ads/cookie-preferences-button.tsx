"use client";

import { CONSENT_OPEN_EVENT } from "@/lib/consent";

export function CookiePreferencesButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))}
      className="h-10 rounded-full bg-[#d0122d] px-4 text-sm font-medium text-white transition-colors hover:bg-[#9b1020]"
    >
      Update cookie preferences
    </button>
  );
}
