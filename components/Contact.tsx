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

  // Front-end only demo handler — wire to a real endpoint/CRM later.
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
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
                  <div className="text-sm text-dusty">{contact.region}</div>
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

                <button type="submit" className="btn-primary group w-full">
                  Let&rsquo;s Talk Real Estate
                  <span className="transition-transform duration-500 ease-lux group-hover:translate-x-1">
                    &rarr;
                  </span>
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
