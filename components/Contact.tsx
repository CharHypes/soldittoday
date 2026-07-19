"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { contact } from "@/lib/data";
import Reveal from "./ui/Reveal";

const ease = [0.22, 1, 0.36, 1] as const;

const inputClass =
  "w-full rounded-xl border border-dusty/20 bg-plum/40 px-4 py-3.5 text-sm text-pearl placeholder:text-dusty/60 outline-none transition-colors duration-300 focus:border-pearl/50";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // NOTE: also validate server-side (RLS insert policy) and consider adding a
  // CAPTCHA (e.g. reCAPTCHA / Turnstile) alongside this honeypot.
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    // Honeypot spam trap — bots fill hidden fields; real users never see it.
    const honeypot = form.elements.namedItem(
      "company"
    ) as HTMLInputElement | null;
    if (honeypot && honeypot.value) return; // silently drop bot submissions

    const data = new FormData(form);

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          intent: data.get("intent"),
          message: data.get("message"),
          sourcePage:
            typeof window !== "undefined" ? window.location.pathname : "/",
        }),
      });

      if (!res.ok) {
        const { error: apiError } = await res.json().catch(() => ({}));
        throw new Error(apiError ?? "Request failed");
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Lead submission failed:", err);
      setError(
        "Something went wrong sending your message. Please try again, or reach out by phone or email."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden bg-plum py-24 md:py-32">
      <div className="pointer-events-none absolute -left-32 bottom-0 h-[420px] w-[420px] rounded-full bg-wine/30 blur-[150px]" />

      <div className="container-lux relative z-10">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          {/* Left: invitation + details */}
          <div>
            <Reveal>
              <span className="eyebrow">Contact</span>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-4 text-balance text-3xl font-semibold leading-[1.1] tracking-tightest text-pearl sm:text-4xl md:text-5xl">
                Let&rsquo;s talk real estate
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-5 max-w-md text-base leading-relaxed text-dusty md:text-lg">
                Buying, selling, or just exploring your options — start with a
                no-pressure conversation. You&rsquo;ll get straight answers and a
                clear next step.
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-10 space-y-6 border-t border-dusty/15 pt-8">
                <div>
                  <div className="text-xs uppercase tracking-widest text-dusty">
                    Call or Text
                  </div>
                  <a
                    href={`tel:${contact.phone.replace(/[^0-9]/g, "")}`}
                    className="mt-1 block text-lg font-semibold text-pearl transition-colors hover:text-dusty"
                  >
                    {contact.phone}
                  </a>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-dusty">
                    Email
                  </div>
                  <a
                    href={`mailto:${contact.email}`}
                    className="mt-1 block text-lg font-semibold text-pearl transition-colors hover:text-dusty"
                  >
                    {contact.email}
                  </a>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-dusty">
                    Brokerage
                  </div>
                  <div className="mt-1 text-lg font-semibold text-pearl">
                    {contact.brokerage}
                  </div>
                  <address className="mt-0.5 text-sm not-italic leading-relaxed text-dusty">
                    {contact.officeStreet}
                    <br />
                    {contact.officeCityStateZip}
                  </address>
                  <div className="mt-1 text-sm text-dusty">{contact.region}</div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease }}
            className="rounded-xl2 border border-dusty/15 bg-bruised/50 p-7 shadow-card backdrop-blur sm:p-9"
          >
            {submitted ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-pearl/30 text-2xl text-pearl">
                  &#10003;
                </div>
                <h3 className="mt-6 text-2xl font-semibold text-pearl">
                  Thank you
                </h3>
                <p className="mt-3 max-w-sm text-dusty">
                  Your message is on its way. Charlotte will be in touch shortly
                  to talk through your goals.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="btn-outline mt-8"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Honeypot spam trap — off-screen, not focusable, hidden from
                    assistive tech. Humans never fill it; bots that do are dropped. */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden"
                >
                  <label htmlFor="company">Company</label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-xs uppercase tracking-widest text-dusty"
                    >
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Your full name"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-xs uppercase tracking-widest text-dusty"
                    >
                      Phone
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="(313) 000-0000"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-xs uppercase tracking-widest text-dusty"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@email.com"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="intent"
                    className="mb-2 block text-xs uppercase tracking-widest text-dusty"
                  >
                    I&rsquo;m interested in
                  </label>
                  <select
                    id="intent"
                    name="intent"
                    defaultValue="Buying"
                    className={`${inputClass} appearance-none`}
                  >
                    <option className="bg-plum">Buying</option>
                    <option className="bg-plum">Selling</option>
                    <option className="bg-plum">Just Exploring</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-xs uppercase tracking-widest text-dusty"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Tell us a little about what you're looking for..."
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-aurora group w-full disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Sending..." : "Let’s Talk Real Estate"}
                  {!submitting && (
                    <span className="transition-transform duration-500 ease-lux group-hover:translate-x-1">
                      &rarr;
                    </span>
                  )}
                </button>

                {error && (
                  <p role="alert" className="text-sm leading-relaxed text-red-300">
                    {error}
                  </p>
                )}
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
