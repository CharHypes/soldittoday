"use client";

import { useState, useTransition } from "react";
import { addNote, draftSellerUpdate } from "@/app/dashboard/actions";

const inp =
  "w-full rounded-xl border border-dusty/25 bg-plum/60 px-3.5 py-2.5 text-pearl outline-none transition-colors focus:border-auroraMauve/60";

/**
 * Seller-update composer. The textarea is controlled so "Draft with AI" can fill
 * it from the listing's latest ListTrac stats (Claude); the agent then edits and
 * saves it as a note via the existing addNote action. AI button only shows when
 * drafting is enabled (ANTHROPIC_API_KEY set) ... otherwise it's a plain note box.
 */
export default function SellerNoteComposer({
  listingId,
  aiEnabled,
}: {
  listingId: string;
  aiEnabled: boolean;
}) {
  const [body, setBody] = useState("");
  const [visible, setVisible] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [drafting, startDraft] = useTransition();

  const onDraft = () => {
    setError(null);
    startDraft(async () => {
      const res = await draftSellerUpdate(listingId);
      if (res.ok) setBody(res.draft);
      else setError(res.error);
    });
  };

  return (
    <form
      action={async (fd) => {
        await addNote(fd);
        setBody("");
        setVisible(true);
      }}
      className="mt-3 space-y-3"
    >
      <input type="hidden" name="listing_id" value={listingId} />
      <textarea
        name="body"
        rows={4}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Share an update your seller will see on their portal..."
        className={inp}
      />
      {error && <p className="text-xs text-rose-300">{error}</p>}
      {aiEnabled && (
        <p className="text-[11px] text-dusty/70">
          Turn this listing&rsquo;s latest stats into a seller update with one click, then edit before saving.
        </p>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-xs text-dusty">
          <input
            type="checkbox"
            name="client_visible"
            checked={visible}
            onChange={(e) => setVisible(e.target.checked)}
          />{" "}
          Visible to seller
        </label>
        <div className="flex items-center gap-2">
          {aiEnabled && (
            <button
              type="button"
              onClick={onDraft}
              disabled={drafting}
              className="rounded-lg border border-auroraMauve/45 bg-gradient-to-br from-gold/20 to-auroraMauve/20 px-3.5 py-2 text-sm font-medium text-pearl transition-colors hover:from-gold/30 hover:to-auroraMauve/30 disabled:opacity-50"
            >
              {drafting ? "Drafting..." : "Draft with AI"}
            </button>
          )}
          <button type="submit" className="btn-aurora !px-4 !py-2 text-sm">
            Add note
          </button>
        </div>
      </div>
    </form>
  );
}
