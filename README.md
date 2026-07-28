# Portfolio — Craven

**Live Demo:** [https://krenntcraven.com](https://krenntcraven.com)

Personal developer portfolio showcasing projects, work experience, certifications, and a built-in contact form — built with Next.js 16 (App Router) and powered by Contentful as a headless CMS, with an on-site AI assistant answering questions about the work.

---

## Features

### Home

- **Landing Page**: Animated hero with GSAP and Framer Motion, plus credential chips (tenure, AWS impact, certification count) computed on the server
- **Cloud & Infrastructure**: Production AWS work surfaced with real metrics, so the "cloud engineer" claim in the meta title is backed by visible evidence
- **Spotlight**: A curated three-project slice of the projects catalog
- **Scroll Snapping**: Boundary-aware wheel snapping between sections that still allows free scrolling inside sections taller than the viewport, and respects `prefers-reduced-motion`

### About

- **Experience**: Work history with role and timeline details
- **Technologies**: Tech stack showcase with categorized skills
- **Certifications**: Credentials with issuer, year, and outbound verification links
- **Education**: Academic background

### Projects

- **Projects Catalog**: `/projects` renders the full catalog — local projects plus Contentful projects — newest work first
- **Detail Pages**: An editorial, long-form layout per project (hero banner, overview, key features, tech stack, gallery, highlights, quick metrics)
- **Gallery Lightbox**: Click-to-zoom modal with keyboard navigation and a thumbnail rail
- **Case Studies**: Deep-dive pages for Contentful projects that have the content (`/projects/[slug]/casestudy`)

### Cravun AI Assistant

- **Grounded Chat**: A floating assistant that answers questions about the portfolio only, built on the Vercel AI SDK with Groq
- **Model Fallback Chain**: Rotates through Groq models when one exhausts its daily token bucket, configurable via `GROQ_MODELS`
- **Guardrails**: Prompt-injection detection and scope checks decline off-topic requests before a model call
- **In-Site Links**: Replies link to real routes and navigate client-side, so the conversation survives the jump

### Contact

- **Contact Modal**: Name, email, and message form with validation
- **Email API**: Server-side delivery via Resend (`/api/contact`), reply-to set to the sender

### SEO & General

- **Structured Data**: Person, WebSite, ProfilePage, and per-project JSON-LD
- **Generated Assets**: Dynamic OpenGraph and Twitter share images, plus `sitemap.ts` and `robots.ts`
- **Page Transitions**: Smooth animated transitions between routes
- **Navigation**: Persistent navbar with active-section highlighting, footer links, and a downloadable resume

---

## Tech Stack

- **Framework:** Next.js 16 (App Router, React Server Components)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion + GSAP
- **CMS:** Contentful (headless, rich-text rendering)
- **AI:** Vercel AI SDK + Groq
- **Email:** Resend
- **UI Primitives:** Radix UI + HeroUI
- **Icons:** Heroicons + React Icons
- **Testing:** Jest + React Testing Library
- **Package Manager:** pnpm

---

## Content Architecture

Projects come from two sources, and one module reconciles them:

| Source                              | Holds                                          |
| ----------------------------------- | ---------------------------------------------- |
| `src/app/projects/projects-data.ts` | Recent work, authored locally as typed data    |
| Contentful (`featuredProjects`)     | Earlier work, including rich-text case studies |

`src/app/projects/projects-catalog.ts` merges both into one ordered list. `/projects` renders the whole catalog and the homepage Spotlight renders a slice of it, which guarantees the homepage is always a subset of the projects page rather than a competing list. If Contentful is unreachable, the catalog degrades to the local registry instead of rendering an empty page.

**To add a project**, append an entry to `localProjects` in `projects-data.ts`. The card, the `/projects/<slug>` detail page, and the sitemap entry are all generated from it — no component changes required. To feature it on the homepage, add its slug to `SPOTLIGHT_SLUGS` in `projects-catalog.ts`.

Other page content follows the same convention — plain typed data files with no JSX and no page-specific logic in the component layer: `about-data.ts`, `experiences-data.tsx`, `certification-data.tsx`, `education-data.ts`, `technologies-data.tsx`, and `cloud-proof-data.ts`.

---

## Project Structure

```
portfolio-craven/
├── src/
│   ├── global.d.ts                     # Global TypeScript declarations
│   ├── __tests__/                      # Jest test suites
│   └── app/
│       ├── layout.tsx                  # Root layout (fonts, providers, navbar, footer, assistant)
│       ├── page.tsx                    # Home (hero → cloud proof → spotlight)
│       ├── globals.css
│       ├── seo.tsx                     # Shared SEO constants and JSON-LD builders
│       ├── sitemap.ts                  # Contentful + local projects
│       ├── robots.ts
│       ├── opengraph-image.tsx         # Generated share images
│       ├── twitter-image.tsx
│       ├── about/                      # About sections + their data files
│       │   ├── about-page.tsx          # Layout with scroll logic
│       │   ├── about-ui.tsx            # Shared section primitives
│       │   ├── certification-page.tsx
│       │   ├── education-page.tsx
│       │   ├── experience-page.tsx
│       │   ├── techonologies-page.tsx
│       │   └── *-data.ts(x)
│       ├── api/
│       │   ├── chat/route.ts           # Assistant streaming + model fallback chain
│       │   └── contact/route.ts        # POST handler — email delivery via Resend
│       ├── backend/                    # Server-side data fetching
│       │   ├── contentful_init.tsx     # Contentful client + cached query helpers
│       │   ├── featured_projectsClient.tsx
│       │   └── types.ts
│       ├── frontend/                   # Shared UI components
│       │   ├── banner-background.tsx   # Animated gradient background (mouse-tracked)
│       │   ├── project-card.tsx        # Card used by both project surfaces
│       │   ├── project-ui.tsx          # Shared tokens, icons, focus styles
│       │   ├── reveal.tsx              # Scroll-reveal wrapper
│       │   ├── chatbot/                # Cravun assistant (UI, knowledge, guardrails)
│       │   ├── contact-modal/
│       │   ├── footer/
│       │   ├── home/                   # Hero, cloud proof, spotlight + their data
│       │   ├── hooks/
│       │   ├── navigation-bar/
│       │   └── page-transition/
│       └── projects/
│           ├── page.tsx                # Route — loads the catalog
│           ├── projects-page.tsx       # Grid view
│           ├── projects-catalog.ts     # Merges Contentful + local into one list
│           ├── projects-data.ts        # Local project registry
│           └── [slug]/                 # Dynamic project detail pages
│               ├── page.tsx
│               ├── ProjectPageClient.tsx
│               ├── components/         # Hero, overview, gallery, metrics, etc.
│               └── casestudy/          # Per-project deep-dive pages
├── public/                             # Static assets
│   ├── badge/                          # Certification badge images
│   ├── projects/                       # Project covers and screenshots
│   ├── Picture.jpg                     # Profile photo
│   └── resume.pdf
├── eslint.config.mjs
├── jest.config.ts
├── jest.setup.ts
├── next.config.ts
├── postcss.config.mjs                  # Tailwind CSS v4 config (via PostCSS)
└── tsconfig.json
```

---

## Getting Started

### 1. Prerequisites

- **Node.js** v18 or higher
- **pnpm** (recommended)
- **Contentful** account with a configured space
- **Resend** account for contact form emails
- **Groq** account for the AI assistant (free tier is enough)

### 2. Clone the Repository

```bash
git clone https://github.com/KrenntCraven/portfolio-craven.git
cd portfolio-craven
```

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Environment Setup

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_CONTENTFUL_SPACE_ID=your_contentful_space_id
NEXT_PUBLIC_CONTENTFUL_DELIVERY_TOKEN=your_contentful_delivery_token
NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT_ID=your_contentful_environment  # optional, defaults to "craven"
RESEND_API_KEY=your_resend_api_key
GROQ_API_KEY=your_groq_api_key
GROQ_MODELS=model-a,model-b                                        # optional, overrides the fallback chain
GOOGLE_SITE_VERIFICATION=your_verification_token                   # optional
```

> Get your Contentful credentials from the [Contentful Dashboard](https://app.contentful.com/), your Resend key from the [Resend Dashboard](https://resend.com/dashboard), and your Groq key from the [Groq Console](https://console.groq.com/keys). Without `GROQ_API_KEY` the assistant reports itself unavailable rather than erroring mid-conversation; the rest of the site is unaffected.

### 5. Run Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

### 6. Build for Production

```bash
pnpm build
```

### 7. Preview Production Build

```bash
pnpm start
```

---

## Available Scripts

| Command              | Description                              |
| -------------------- | ---------------------------------------- |
| `pnpm dev`           | Start development server with hot reload |
| `pnpm build`         | Build for production                     |
| `pnpm start`         | Start production server                  |
| `pnpm lint`          | Run ESLint for code quality checks       |
| `pnpm test`          | Run the Jest suite                       |
| `pnpm test:watch`    | Run tests in watch mode                  |
| `pnpm test:coverage` | Run tests with a coverage report         |

---

## Testing

Jest and React Testing Library cover the areas most likely to regress silently: the hero and its credential line, the spotlight grid, the About and certification sections, the assistant's guardrails and link handling, and mobile performance behaviours such as wheel snapping and lazy loading.

```bash
pnpm test
```

---

## Image Optimization

Next.js Image serves optimized images across responsive device sizes, from both the local `public/projects` assets and Contentful's CDN (`images.ctfassets.net`), which is asked for WebP transforms up front. AVIF is deliberately left off — its encode cost made already-optimized WebP covers feel slower on cold hits than the format saved. `next.config.ts` also sets long-lived cache headers for build assets, images, and fonts, and canonicalizes the host to the apex domain.

---

## Contact Form

The contact form (`/api/contact`) accepts `POST` requests with `name`, `email`, and `message` fields. Emails are delivered via **Resend** directly to the portfolio owner's inbox, with reply-to set to the sender's email.

---

## License

This is a personal portfolio project. All content and design are owned by the project author.

---

## Contact

**Project Owner:** KrenntCraven  
**Email:** krenntc@gmail.com

---
