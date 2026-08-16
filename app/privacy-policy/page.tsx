import type { Metadata } from "next";
import PageShell from "@/components/PageShell";

const EFFECTIVE_DATE = "August 15, 2026";
const EMAIL = "Charlotte@soldittoday.com";
const PHONE = "313-529-5750";
const BROKERAGE = "Remerica United Realty";
const ADDRESS = "47720 Grand River Ave, Novi, MI 48374";

export const metadata: Metadata = {
  title: "Privacy Policy | Sold It Today",
  description:
    "How Sold It Today collects, uses, and protects the information you share through this website, including form submissions and advertising measurement.",
  alternates: { canonical: "/privacy-policy" },
};

function Section({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-pearl sm:text-2xl">{heading}</h2>
      <div className="mt-4 space-y-4 text-base leading-relaxed text-dusty">
        {children}
      </div>
    </div>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Privacy Policy"
      description={`How we handle the information you share with us. Last updated ${EFFECTIVE_DATE}.`}
    >
      <section className="relative overflow-hidden bg-plum py-16 md:py-24">
        <div className="aurora-bloom opacity-40" />
        <div className="grain-soft" />
        <div className="container-lux relative z-10 max-w-3xl space-y-12">
          <Section heading="Who we are">
            <p>
              This website is operated by Sold It Today, a real estate team led
              by Charlotte Hypes, brokered by {BROKERAGE}, {ADDRESS}. In this
              policy, &ldquo;we,&rdquo; &ldquo;us,&rdquo; and &ldquo;our&rdquo;
              refer to Sold It Today. This policy explains what information we
              collect through this website, how we use it, and the choices you
              have.
            </p>
          </Section>

          <Section heading="Information we collect">
            <p>
              <strong className="text-pearl">Information you give us.</strong>{" "}
              When you submit a form on this site, such as a contact request or a
              down payment assistance inquiry, we collect the details you
              provide. Depending on the form, this may include your name, email
              address, phone number, household size, whether you have owned a
              home in the past three years, whether you have completed a
              homebuyer education class, the city or program you are asking
              about, and any message you send.
            </p>
            <p>
              <strong className="text-pearl">
                Information collected automatically.
              </strong>{" "}
              Like most websites, we and our providers may use cookies and
              similar technologies to collect standard technical information,
              such as your device type, browser, general location, and how you
              interact with our pages. This includes advertising and measurement
              tools described below.
            </p>
          </Section>

          <Section heading="How we use your information">
            <p>We use the information we collect to:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>respond to your inquiry and follow up about your goals;</li>
              <li>provide and improve our real estate services;</li>
              <li>
                understand which pages and ads are helpful, and measure and
                improve our marketing;
              </li>
              <li>
                meet legal, regulatory, and professional obligations as a real
                estate team.
              </li>
            </ul>
            <p>
              We do not use this information to make credit decisions, and
              submitting a form does not apply for any assistance program or
              affect your credit.
            </p>
          </Section>

          <Section heading="Advertising and the Meta Pixel">
            <p>
              We may advertise our services on platforms such as Facebook and
              Instagram. To understand whether those ads are working, we may use
              the Meta Pixel and similar tools, which place cookies and share
              limited technical and event information (for example, that a page
              was viewed or a form was submitted) with Meta Platforms, Inc. This
              helps us measure results and reach people who may be interested in
              our services. You can control ad personalization through your
              Facebook and Instagram settings and your device or browser
              settings.
            </p>
          </Section>

          <Section heading="How we share information">
            <p>
              <strong className="text-pearl">
                We do not sell your personal information.
              </strong>{" "}
              We share it only as needed to run our business:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                with service providers who host our data, deliver our email
                notifications, and support our website and advertising, and who
                are permitted to use it only to provide those services;
              </li>
              <li>
                with our brokerage and trusted partners when needed to help with
                your request;
              </li>
              <li>
                when required by law, or to protect our rights, safety, or
                property.
              </li>
            </ul>
          </Section>

          <Section heading="Cookies and your choices">
            <p>
              You can set your browser to refuse some or all cookies, or to alert
              you when cookies are being sent. Some parts of the site may not
              function as intended without them. You can also opt out of
              interest-based advertising through your platform and device
              settings.
            </p>
          </Section>

          <Section heading="Data retention and security">
            <p>
              We keep the information you submit only as long as needed for the
              purposes described here or as required by law, and we take
              reasonable measures to protect it. No method of transmission or
              storage is completely secure, so we cannot guarantee absolute
              security.
            </p>
          </Section>

          <Section heading="Your rights and choices">
            <p>
              You may ask us to access, correct, or delete the information you
              have shared with us, or ask us to stop contacting you. To make a
              request, contact us using the details below and we will respond as
              required by applicable law.
            </p>
          </Section>

          <Section heading="Fair Housing">
            <p>
              Sold It Today is committed to the letter and spirit of the Fair
              Housing Act and equal opportunity in housing. We do business in
              accordance with fair housing laws and do not discriminate on the
              basis of race, color, religion, sex, disability, familial status,
              national origin, or any other class protected by law.
            </p>
          </Section>

          <Section heading="Children&rsquo;s privacy">
            <p>
              This website is intended for adults and is not directed to
              children. We do not knowingly collect personal information from
              children.
            </p>
          </Section>

          <Section heading="Changes to this policy">
            <p>
              We may update this policy from time to time. When we do, we will
              revise the &ldquo;last updated&rdquo; date at the top of this page.
            </p>
          </Section>

          <Section heading="Contact us">
            <p>
              Questions about this policy or your information? Contact us at{" "}
              <a
                href={`mailto:${EMAIL}`}
                className="text-auroraMauve underline-offset-4 hover:underline"
              >
                {EMAIL}
              </a>{" "}
              or {PHONE}.
            </p>
            <p className="text-sm text-dusty/80">
              {BROKERAGE}
              <br />
              {ADDRESS}
            </p>
          </Section>
        </div>
      </section>
    </PageShell>
  );
}
