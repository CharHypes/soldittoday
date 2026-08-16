"use client";

import { useState, type FormEvent } from "react";

/*
 * DPA eligibility form.
 *
 * Submits to /api/dpa-lead, which saves the lead (Supabase) and emails
 * Charlotte@soldittoday.com (Resend). Save is the source of truth; the email is
 * best-effort. Shows a real success OR error state... it never fakes success,
 * so a lead is never silently lost. Honeypot + server-side rate limiting guard
 * against spam.
 */

const HOUSEHOLD_SIZES = [
  "1 person",
  "2 people",
  "3 people",
  "4 people",
  "5 people",
  "6 people",
  "7 people",
  "8 people",
];

export default function DpaForm({ city, slug }: { city: string; slug: string }) {
  const [owned, setOwned] = useState<"" | "yes" | "no">("");
  const [education, setEducation] = useState<"" | "yes" | "no">("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  );
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    // Honeypot: bots fill hidden fields; real users never see it.
    const hp = form.elements.namedItem("company") as HTMLInputElement | null;
    if (hp && hp.value) {
      setStatus("done"); // pretend success so bots don't retry
      return;
    }

    const data = new FormData(form);
    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/dpa-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          householdSize: data.get("householdSize"),
          ownedHomePast3Years: owned,
          completedEducation: education,
          city,
          sourcePage: `/dpa/${slug}`,
          company: data.get("company"),
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        setStatus("done");
      } else {
        setStatus("error");
        setError(json.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setError("We couldn't reach the server. Please try again in a moment.");
    }
  };

  if (status === "done") {
    return (
      <div className="thanks">
        <span className="serif">Got it.</span>
        <p>
          I will reach out within one business day, and your {city} eligibility
          guide is on its way to your inbox now.
        </p>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2>See where you stand</h2>
      <p className="h2sub">No cost, no obligation, no credit check.</p>

      {/* Honeypot (hidden from humans) */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <label htmlFor="nm">Name</label>
      <input id="nm" name="name" type="text" placeholder="First and last" required />

      <label htmlFor="em">Email</label>
      <input id="em" name="email" type="email" placeholder="you@email.com" required />

      <label htmlFor="ph">Phone</label>
      <input id="ph" name="phone" type="tel" placeholder="(313) 555-0100" />

      <label htmlFor="hh">Household size</label>
      <select id="hh" name="householdSize" defaultValue="1 person">
        {HOUSEHOLD_SIZES.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>

      <label>Have you owned a home in the past 3 years?</label>
      <div className="toggle">
        <button
          type="button"
          aria-pressed={owned === "yes"}
          onClick={() => setOwned("yes")}
        >
          Yes
        </button>
        <button
          type="button"
          aria-pressed={owned === "no"}
          onClick={() => setOwned("no")}
        >
          No
        </button>
      </div>

      <label>Have you completed a homebuyer education class?</label>
      <div className="toggle">
        <button
          type="button"
          aria-pressed={education === "yes"}
          onClick={() => setEducation("yes")}
        >
          Yes
        </button>
        <button
          type="button"
          aria-pressed={education === "no"}
          onClick={() => setEducation("no")}
        >
          Not yet
        </button>
      </div>

      <button className="submit" type="submit" disabled={sending}>
        {sending ? "Checking..." : "Check my eligibility"}
      </button>

      {status === "error" && <p className="formerror">{error}</p>}

      <p className="privacy">
        We will never sell your information. Submitting this form does not apply
        for assistance and does not affect your credit. See our{" "}
        <a href="/privacy-policy">Privacy Policy</a>.
      </p>
    </form>
  );
}
