"use client";

import type { SearchOption } from "@/lib/data";

type SearchSelectProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SearchOption[];
};

/**
 * Reusable, premium-styled select for the Home Search filters.
 * Pure UI — no data fetching. Wire the selected value into the IDX query later.
 */
export default function SearchSelect({
  id,
  label,
  value,
  onChange,
  options,
}: SearchSelectProps) {
  return (
    <label htmlFor={id} className="flex flex-col gap-1.5">
      <span className="text-[11px] font-medium uppercase tracking-widest text-dusty">
        {label}
      </span>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-dusty/20 bg-plum/50 px-3.5 py-3 pr-9 text-sm text-pearl outline-none transition-colors duration-300 hover:border-dusty/40 focus:border-auroraMauve/60"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-plum">
              {opt.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-dusty">
          &#9662;
        </span>
      </div>
    </label>
  );
}
