"use client";

import { useState } from "react";

export default function CopyLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center gap-2">
      <input
        readOnly
        value={url}
        onFocus={(e) => e.currentTarget.select()}
        className="flex-1 rounded-lg border border-dusty/20 bg-plum/50 px-3 py-2 text-xs text-dusty"
      />
      <button
        type="button"
        onClick={async () => {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="btn-aurora shrink-0 !px-4 !py-2 text-xs"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
