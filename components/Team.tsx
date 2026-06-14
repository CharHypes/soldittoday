"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { team } from "@/lib/data";
import SectionHeading from "./ui/SectionHeading";

const ease = [0.22, 1, 0.36, 1] as const;

type TeamProps = {
  /** When true, renders without the outer <section> wrapper chrome (for the /team page). */
  bare?: boolean;
};

export default function Team({ bare = false }: TeamProps) {
  const grid = (
    <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {team.map((member, i) => (
        <motion.article
          key={member.id}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: (i % 4) * 0.08, ease }}
          className="aurora-ring group flex flex-col overflow-hidden rounded-xl2 border border-auroraMauve/18 bg-plum/50"
        >
          {/* Portrait */}
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src={member.image}
              alt={`${member.name}, ${member.role} at SOLD IT TODAY`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              style={{
                objectPosition: member.objectPosition,
                transform: member.imageScale
                  ? `scale(${member.imageScale})`
                  : undefined,
                transformOrigin: member.imageOrigin,
              }}
              className="object-cover transition-transform duration-700 ease-lux group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-plum/85 via-plum/10 to-transparent" />
            <div className="absolute bottom-0 left-0 p-5 pb-8">
              <h3 className="text-lg font-semibold text-pearl">{member.name}</h3>
              <p className="mt-0.5 text-xs uppercase tracking-wider text-auroraMauve">
                {member.role}
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-1 flex-col p-5">
            <p className="text-sm leading-relaxed text-dusty">{member.bio}</p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {member.specialties.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-auroraMauve/30 bg-wine/40 px-2.5 py-1 text-[11px] text-pearl/85"
                >
                  {s}
                </span>
              ))}
            </div>

            <div className="mt-5 flex flex-col gap-1.5 border-t border-dusty/12 pt-4 text-xs text-dusty">
              <a
                href={`mailto:${member.email}`}
                className="truncate transition-colors duration-300 hover:text-auroraMauve"
              >
                {member.email}
              </a>
              <a
                href={`tel:${member.phone.replace(/[^0-9]/g, "")}`}
                className="transition-colors duration-300 hover:text-auroraMauve"
              >
                {member.phone}
              </a>
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );

  if (bare) {
    return <div className="container-lux relative z-10">{grid}</div>;
  }

  return (
    <section id="team" className="relative overflow-hidden bg-bruised py-24 md:py-32">
      <div className="aurora-bloom opacity-90" />
      <div className="grain-soft" />
      <div className="container-lux relative z-10">
        <SectionHeading
          eyebrow="Our Team"
          title="Real people, real local expertise"
          description="A growing Southeast Michigan team — each member focused on guiding you with honesty, strategy, and clear next steps."
          align="center"
        />
        {grid}
      </div>
    </section>
  );
}
