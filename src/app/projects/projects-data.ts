/**
 * Projects registry — the single source of truth for the /projects grid AND the
 * full detail pages of projects that don't live in Contentful.
 *
 * This mirrors the codebase's local-content convention (see about-data.ts,
 * experiences-data.tsx, etc.): plain, typed data with no JSX and no
 * project-specific logic in the component layer. Add an entry here and both the
 * card grid and its `/projects/<slug>` detail page render automatically.
 *
 * `localProjectToProject` maps an entry onto the shared `Project` shape so the
 * detail route renders it through the exact same editorial page as Contentful
 * projects — one detail design, two data sources.
 */
import type {
  GalleryImage,
  ImpactStat,
  Project,
  ProjectStatus,
} from "../backend/types";

export type LocalProject = {
  /** Stable id (React key) + URL slug for the detail page. */
  id: string;
  slug: string;

  /* ---- Card ---- */
  title: string;
  /** Short blurb shown on the card. */
  description: string;
  category?: string;
  status?: ProjectStatus;
  featured?: boolean;
  technologies: string[];
  /** Optional card thumbnail (public path or absolute URL). */
  coverImage?: string;

  /* ---- Detail page ---- */
  /** One-line hero subtitle; falls back to `description`. */
  headline?: string;
  role?: string;
  /** Human-readable timeline, e.g. "2025 – Present". */
  timeline?: string;
  /** Optional editorial cover banner shown atop the detail-page hero. */
  bannerImage?: string;
  /** Optional detail hero image. */
  heroImage?: string;
  /** Editorial overview paragraphs (supports inline **bold** / `code`). */
  overview?: string[];
  /** Supports inline **bold** markdown. */
  keyFeatures?: string[];
  /** Optional screenshot gallery. */
  gallery?: GalleryImage[];
  /** Headline metrics rendered as "Quick Metrics" cards. */
  impactStats?: ImpactStat[];

  /* ---- Links ---- */
  github?: string;
  liveDemo?: string;
};

export const localProjects: LocalProject[] = [
  {
    id: "automated-job-workflow",
    slug: "automated-job-workflow",
    title: "Automated Job Workflow",
    description:
      "End-to-end job-search automation for software, cloud, and DevOps roles — discover, filter, score, tailor, render, and apply, all from a single CLI and an optional local web dashboard.",
    category: "AI / Automation",
    status: "In Progress",
    role: "Solo Developer",
    timeline: "2025 – Present",
    // Editorial cover page (4:3) — the project's visual identity across the
    // /projects card, the OG image, and the detail-page hero banner.
    coverImage: "/projects/automated-job-workflow/banner.webp",
    bannerImage: "/projects/automated-job-workflow/banner.webp",
    technologies: [
      "Python",
      "FastAPI",
      "React",
      "Vite",
      "Playwright",
      "SQLite",
      "MCP",
      "Tailwind CSS",
    ],
    headline:
      "One tool that collapses the entire job-hunt loop — discover, filter, score, tailor, render, and apply — into a single CLI and a local web dashboard.",
    overview: [
      "Job hunting is a repetitive, high-volume pipeline: search several boards, weed out irrelevant and senior roles, judge fit, rewrite your resume for each posting, render a clean PDF, and fill out yet another application form. **Automated Job Workflow** collapses that entire loop into one tool.",
      "It discovers listings across multiple job boards, filters and scores them against your own resume embedding, uses an LLM to rewrite experience bullets per job (without fabricating facts), renders interactive Light/Dark PDFs, and fills application forms through a companion Chrome extension backed by a localhost bridge.",
      "A single CLI (`python -m workflow`) drives everything, while a local web dashboard built with FastAPI and React wraps the same engine for day-to-day use — all configured from one root `.env`.",
    ],
    impactStats: [
      {
        value: "$0.01",
        label: "Per application",
        description: "Average LLM cost to tailor and render one application.",
      },
      {
        value: "~200",
        label: "Listings / day",
        description: "Bulk scraping with the semantic gate at ~$0.14/day.",
      },
      {
        value: "4",
        label: "Job boards",
        description: "Indeed PH, LinkedIn, JobStreet, and Kalibrr.",
      },
      {
        value: "7",
        label: "LLM providers",
        description: "Automatic fallback across providers on quota limits.",
      },
    ],
    keyFeatures: [
      "**Multi-source discovery** across Indeed PH, LinkedIn, JobStreet, Kalibrr, or a single pasted job URL.",
      "**Pre-storage filtering** by role, seniority, salary band, and excluded employers — applied before anything hits disk.",
      "**Rules + AI enrichment** that normalizes skills and salary, then a semantic gate compares each posting against your resume embedding.",
      "**LLM resume tailoring** that rewrites experience bullets per job, with a verifier that guards against fabrication.",
      "**Interactive PDF rendering** with a Light/Dark toggle (Acrobat OCG layers) via Jinja2 and Playwright.",
      "**One-click apply** through a Chrome/Edge extension and a localhost bridge for ATS autofill and mark-applied sync.",
      "**Local web dashboard** with a searchable jobs table, live pipeline logs, a resume diff viewer, and a masked .env editor.",
      "**Provider fallback chain** that rotates across Groq, Anthropic, Gemini, Mistral, DeepSeek, OpenAI, and local Ollama on quota limits.",
      "**MCP servers** (knowledge + runtime) so AI assistants like Cursor can inspect and drive the pipeline.",
    ],
    // Authentic screenshots captured from the running dashboard (light theme).
    gallery: [
      {
        url: "/projects/automated-job-workflow/jobs.webp",
        alt: "Searchable jobs table with match scores and application status",
        caption:
          "The live jobs table — 694 listings with semantic match scores, filters, and per-row tailor/apply actions.",
      },
      {
        url: "/projects/automated-job-workflow/overview.webp",
        alt: "Overview dashboard with metric cards and top matched opportunities",
        caption:
          "Control-center overview — jobs, applications, tailored resumes, generated PDFs, and LLM cost at a glance.",
      },
      {
        url: "/projects/automated-job-workflow/resumes.webp",
        alt: "Grid of per-job tailored resume versions with match and quality scores",
        caption:
          "Per-job tailored resumes with match and quality grades, plus an original-vs-tailored diff.",
      },
      {
        url: "/projects/automated-job-workflow/pipeline.webp",
        alt: "Pipeline runner with action buttons and a live streaming console",
        caption:
          "Pipeline runner — trigger scrapes or a full run and watch the live streaming console.",
      },
      {
        url: "/projects/automated-job-workflow/cover-letter.webp",
        alt: "Cover letter builder with job description input and generated output",
        caption:
          "Cover-letter builder that drafts a truthful, tailored letter and exports a formatted PDF.",
      },
      {
        url: "/projects/automated-job-workflow/settings.webp",
        alt: "Settings screen showing the grouped environment variable editor",
        caption:
          "Grouped .env editor with masked secrets, provider health, and quota tracking.",
      },
      {
        url: "/projects/automated-job-workflow/mobile-overview.webp",
        alt: "Mobile view of the overview dashboard with stacked metric cards",
        caption: "Fully responsive — the control center adapts down to mobile.",
      },
    ],
    github: "https://github.com/KrenntCraven/Automated-Job-Worflow",
    // No public live demo — it's a local CLI + localhost dashboard.
  },
  {
    id: "budget-tracker",
    slug: "budget-tracker",
    title: "Budget Tracker",
    description:
      "A personal income and expense tracker built with React, Tailwind CSS v4, and Supabase — with half-month budgeting, automatic balance carry-over, and per-user tailored features.",
    category: "Full-Stack",
    status: "Completed",
    role: "Solo Developer",
    timeline: "2025",
    // Editorial cover page (4:3) — card, OG image, and detail-page hero banner.
    coverImage: "/projects/budget-tracker/banner.webp",
    bannerImage: "/projects/budget-tracker/banner.webp",
    technologies: [
      "React 19",
      "Vite",
      "Tailwind CSS v4",
      "Supabase",
      "PostgreSQL",
      "Supabase Auth",
    ],
    headline:
      "A private income and expense tracker built around how people actually get paid — half-month periods, carried-over balances, and a live 50/30/20 budget guide.",
    overview: [
      "Most budgeting apps assume a single monthly cycle, but plenty of people are paid twice a month and budget in halves. **Budget Tracker** models that directly: every month splits into a **1st half (days 1–15)** and a **2nd half (days 16–end)**, each with its own view and totals.",
      "It sets a **starting balance per month**, and the second half automatically carries over whatever is left from the first — so the running balance always reflects reality instead of resetting arbitrarily. Live summary cards and a totals bar keep income, expenses, and net visible while filtering.",
      "The stack is deliberately lean: **React 19 + Vite** on the front end, **Tailwind CSS v4** for styling, and **Supabase** for both PostgreSQL storage and authentication. Access is locked to an email allowlist, with **Row Level Security** policies ensuring each user can only ever read and write their own transactions.",
    ],
    impactStats: [
      {
        value: "2",
        label: "Budget periods",
        description:
          "Each month splits into 1st and 2nd half with automatic carry-over.",
      },
      {
        value: "50/30/20",
        label: "Budget guide",
        description:
          "Live progress bars tracking needs, wants, and savings targets.",
      },
      {
        value: "RLS",
        label: "Row-level security",
        description:
          "Postgres policies scope every row to its owning user.",
      },
      {
        value: "100%",
        label: "Responsive",
        description: "Built mobile-first and equally usable on desktop.",
      },
    ],
    keyFeatures: [
      "**Full transaction CRUD** — add, edit, and delete entries with category, date, and amount.",
      "**Month navigation** with prev/next controls to browse any period.",
      "**Half-month filtering** — Full Month, 1st Half (days 1–15), or 2nd Half (days 16–end).",
      "**Starting balance per month**, where the 2nd half automatically carries over what's left from the 1st.",
      "**Live summary cards** for Income, Expenses, and Balance, plus a totals bar for the active filter.",
      "**50/30/20 Budget Guide** with live progress bars for needs, wants, and savings.",
      "**Google Sign-In and email magic link** auth, restricted to an allowlist of authorised accounts.",
      "**Per-user expense categories** so each account gets a tailored set of options.",
      "**Row Level Security** policies so users can only ever access their own transactions and savings.",
      "**Progressive transaction list** that shows five at a time and expands on demand.",
    ],
    // Authentic screenshots captured from the running app. Seeded with sample
    // transactions rather than real personal finances.
    gallery: [
      {
        url: "/projects/budget-tracker/dashboard.webp",
        alt: "Budget Tracker dashboard with starting balance and summary cards",
        caption:
          "The control center — starting balance, plus live Income, Balance, and Expenses cards for the selected period.",
      },
      {
        url: "/projects/budget-tracker/budget-guide.webp",
        alt: "50/30/20 budget guide with progress bars for needs, wants, and savings",
        caption:
          "The 50/30/20 guide breaks spending into Needs, Wants, and Savings with live progress bars and on/off-target badges.",
      },
      {
        url: "/projects/budget-tracker/transactions.webp",
        alt: "Transaction list with half-month filters and a totals bar",
        caption:
          "Half-month filtering (Full Month / 1st Half / 2nd Half), five rows at a time, and a totals bar for the active filter.",
      },
      {
        url: "/projects/budget-tracker/add-transaction.webp",
        alt: "Add transaction form with type toggle, category, amount, and date",
        caption:
          "Adding an entry — income/expense toggle, per-user categories, live-formatted amount, and date.",
      },
      {
        url: "/projects/budget-tracker/login.webp",
        alt: "Login screen with Google sign-in and email magic link options",
        caption:
          "Auth gate — Google OAuth or an email magic link, restricted to an allowlist of authorised accounts.",
      },
      {
        url: "/projects/budget-tracker/mobile.webp",
        alt: "Mobile view of the Budget Tracker dashboard",
        caption: "Built mobile-first — the full tracker works on a phone.",
      },
    ],
    liveDemo: "https://budget-tracker-black-tau.vercel.app/",
  },
];

export function getLocalProject(slug: string): LocalProject | undefined {
  return localProjects.find((p) => p.slug === slug);
}

/** Maps a local project onto the shared `Project` shape used by the detail page. */
export function localProjectToProject(p: LocalProject): Project {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    headline: p.headline ?? p.description,
    imageUrl: p.heroImage,
    coverPageUrl: p.coverImage,
    bannerImage: p.bannerImage,
    projectType: p.category ? [p.category] : undefined,
    technologies: p.technologies,
    keyFeatures: p.keyFeatures,
    role: p.role,
    status: p.status,
    timeline: p.timeline,
    overview: p.overview,
    gallery: p.gallery,
    impactStats: p.impactStats,
    githubLink: p.github,
    siteLink: p.liveDemo,
  };
}
