"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * File uploader on the buyer portal. Posts multipart to the tokenized documents
 * endpoint (no login) and refreshes so the file shows in the list. The agent is
 * emailed server-side.
 */
export default function BuyerDocUpload({ token }: { token: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setErr(null);
    setMsg(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`/api/buyer/${token}/documents`, { method: "POST", body: fd });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setErr(j.error || "Upload failed. Please try again.");
        return;
      }
      setMsg(`Sent "${file.name}" to Charlotte.`);
      router.refresh();
    } catch {
      setErr("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="mt-3">
      <input ref={inputRef} type="file" onChange={onPick} className="hidden" />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="rounded-full border border-auroraMauve/40 bg-plum/40 px-4 py-2 text-sm font-semibold text-pearl transition-colors hover:border-auroraMauve/70 disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Upload a document"}
      </button>
      {msg && <p className="mt-2 text-xs text-emerald-400">{msg}</p>}
      {err && <p className="mt-2 text-xs text-red-400">{err}</p>}
      <p className="mt-2 text-xs text-dusty/70">PDF, images, or documents up to 20MB.</p>
    </div>
  );
}
