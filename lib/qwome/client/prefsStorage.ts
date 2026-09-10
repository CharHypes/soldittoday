/**
 * QWOME™ preference persistence ... the BROWSER/localStorage adapter.
 *
 * This is a CLIENT concern, deliberately kept out of QWOME's pure preference
 * model (lib/qwome/preferences). The model defines what a preference is and how
 * to normalize/encode it; this file decides how one particular client (a browser,
 * for Sold It Today today) stores it. A different QWOME client (a mobile app, an
 * account-backed service, another brokerage's site) swaps this adapter without
 * touching the model or the engine.
 *
 * The storage key and change-event name are this client's namespace; they carry
 * a "sit-" prefix only because Sold It Today is the first client. A future
 * account-backed store would implement the same read/write/subscribe shape.
 */
"use client";

import { normalizePrefs, type QwomePreference } from "../preferences";

const KEY = "sit-qwome-prefs";
export const PREFS_CHANGE_EVENT = "sit-qwome-prefs-change";

/** Read this device's saved QWOME preferences (empty when none/unavailable). */
export function readPrefs(): QwomePreference[] {
  try {
    return normalizePrefs(JSON.parse(localStorage.getItem(KEY) || "[]"));
  } catch {
    return [];
  }
}

/** Persist QWOME preferences for this device and notify in-page listeners. */
export function writePrefs(list: QwomePreference[]) {
  const cleaned = normalizePrefs(list);
  try {
    localStorage.setItem(KEY, JSON.stringify(cleaned));
  } catch {
    /* private mode ... ignore */
  }
  try {
    window.dispatchEvent(new Event(PREFS_CHANGE_EVENT));
  } catch {
    /* SSR ... ignore */
  }
}
