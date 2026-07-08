"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { BannerBackground } from "../frontend/banner-background";
import {
  ExternalIcon,
  FOCUS_RING,
  fadeUpItem,
  inViewProps,
  sectionReveal,
} from "../frontend/project-ui";
import { ABOUT_CARD, SectionHeader, SectionShell } from "./about-ui";
import { certifications } from "./certification-data";

type Cert = (typeof certifications)[number];

function VerifiedIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2 9.8 3.6 7.1 3.3 6 5.8 3.5 6.9l.3 2.7L2.2 12l1.6 2.4-.3 2.7 2.5 1.1 1.1 2.5 2.7-.3L12 22l2.2-1.6 2.7.3 1.1-2.5 2.5-1.1-.3-2.7L21.8 12l-1.6-2.4.3-2.7-2.5-1.1L16.9 3.3l-2.7.3L12 2Zm-1.2 13.2-3-3 1.3-1.3 1.7 1.7 4-4L16 9.6l-5.2 5.6Z" />
    </svg>
  );
}

function CertCard({ cert }: { cert: Cert }) {
  const inner = (
    <>
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-linear-to-r from-[#6c5ce7] to-[#a29bfe] transition-transform duration-300 ease-out group-hover:scale-x-100"
      />
      <span
        aria-hidden
        className="absolute inset-0 bg-[#6c5ce7]/0 transition-colors duration-300 group-hover:bg-[#6c5ce7]/4"
      />

      <div className="relative flex items-start gap-4 sm:gap-5">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-neutral-100 bg-neutral-50/80 p-2 sm:h-24 sm:w-24">
          <div className="relative h-full w-full">
            <Image
              src={cert.badge}
              alt={`${cert.title} badge`}
              fill
              sizes="96px"
              className="pointer-events-none select-none object-contain transition-transform duration-300 group-hover:scale-105"
              draggable={false}
            />
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-neutral-200 bg-white px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-600">
              {cert.issuer}
            </span>
            <span className="text-xs font-medium tabular-nums text-neutral-400">
              {cert.date}
            </span>
          </div>

          <h3 className="text-[15px] font-semibold leading-snug text-neutral-900 sm:text-base">
            {cert.title}
          </h3>

          {cert.link ? (
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#6c5ce7]">
              View credential
              <ExternalIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500">
              <VerifiedIcon className="h-3.5 w-3.5 text-[#6c5ce7]" />
              Verified
            </span>
          )}
        </div>
      </div>
    </>
  );

  const cardClass = `group relative block overflow-hidden ${ABOUT_CARD} p-5 sm:p-6 hover:border-[#6c5ce7]/30 hover:shadow-[0_28px_70px_-32px_rgba(108,92,231,0.35)]`;

  return (
    <motion.div variants={fadeUpItem} whileHover={{ y: -4 }} transition={{ duration: 0.25 }}>
      {cert.link ? (
        <a
          href={cert.link}
          target="_blank"
          rel="noopener noreferrer"
          className={`${cardClass} ${FOCUS_RING}`}
        >
          {inner}
        </a>
      ) : (
        <div className={cardClass}>{inner}</div>
      )}
    </motion.div>
  );
}

export default function Certification() {
  const verifiedCount = certifications.length;

  return (
    <div className="relative overflow-hidden bg-white">
      <BannerBackground />

      <SectionShell id="certifications">
        <SectionHeader
          eyebrow="Credentials"
          title="Certifications"
          subtitle="Certified across AWS, GCP, and Azure."
        />

        <motion.div
          {...inViewProps}
          variants={sectionReveal}
          className="mx-auto max-w-5xl"
        >
          <motion.p
            variants={fadeUpItem}
            className="mb-6 text-center text-sm text-neutral-500 sm:mb-8"
          >
            <span className="font-semibold text-neutral-800">
              {certifications.length}
            </span>{" "}
            certifications
            <span className="mx-2 text-neutral-300">·</span>
            <span className="font-semibold text-neutral-800">{verifiedCount}</span>{" "}
            independently verifiable
          </motion.p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6">
            {certifications.map((c) => (
              <CertCard key={c.title} cert={c} />
            ))}
          </div>
        </motion.div>
      </SectionShell>
    </div>
  );
}
