# Portfolio — Craven

**Live Demo:** [https://portfolio-craven.vercel.app/](https://portfolio-craven.vercel.app/)

Personal developer portfolio showcasing projects, work experience, certifications, and a built-in contact form — built with Next.js 16 and powered by Contentful as a headless CMS.

---

## Features

### Home

- **Landing Page**: Animated hero section with GSAP and Framer Motion
- **Featured Projects**: Dynamically fetched from Contentful CMS
- **Banner Background**: Custom animated canvas background

### About

- **Experience**: Work history with role and timeline details
- **Technologies**: Tech stack showcase with categorized skills
- **Certifications**: Listed credentials with issuer and date
- **Education**: Academic background

### Projects

- **Project Pages**: Individual project detail pages with rich content rendered from Contentful
- **Case Studies**: Deep-dive case study pages per project (`/projects/[slug]/casestudy`)
- **Dynamic Routing**: Slug-based routing with server-side data fetching

### Contact

- **Contact Modal**: Name, email, and message form with validation
- **Email API**: Server-side email delivery via Resend (`/api/contact`)

### General

- **Page Transitions**: Smooth animated transitions between routes
- **Navigation Bar**: Persistent top navigation with active route highlighting
- **Footer**: Links and social references
- **Resume Page**: Accessible resume view

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion + GSAP
- **CMS:** Contentful (headless, rich-text rendering)
- **Email:** Resend
- **UI Primitives:** Radix UI + HeroUI
- **Icons:** Heroicons
- **Package Manager:** pnpm

---

## Project Structure

```
portfolio-craven/
├── src/
│   ├── global.d.ts                     # Global TypeScript declarations
│   ├── __tests__/                      # Jest test suites
│   │   ├── about-page.test.tsx
│   │   ├── featured-projects.test.tsx
│   │   ├── landing-page-client.test.tsx
│   │   └── mobile-performance.test.tsx
│   └── app/
│       ├── favicon.ico
│       ├── globals.css
│       ├── layout.tsx                  # Root layout (fonts, providers, navbar, footer)
│       ├── Logo.svg
│       ├── page.tsx                    # Home page (landing + featured projects)
│       ├── about/                      # About page sections
│       │   ├── page.tsx
│       │   ├── about-page.tsx          # Main about layout with scroll logic
│       │   ├── about-data.ts
│       │   ├── certification-data.tsx
│       │   ├── certification-page.tsx
│       │   ├── education-data.ts
│       │   ├── education-page.tsx
│       │   ├── experience-page.tsx
│       │   ├── experiences-data.tsx
│       │   ├── technologies-data.tsx
│       │   └── techonologies-page.tsx
│       ├── api/
│       │   └── contact/
│       │       └── route.ts            # POST handler — email delivery via Resend
│       ├── backend/                    # Server-side data fetching
│       │   ├── contentful_init.tsx     # Contentful client + query helpers
│       │   ├── featured_projectsClient.tsx
│       │   └── types.ts
│       ├── frontend/                   # Shared UI components
│       │   ├── banner-background.tsx   # Animated gradient background (mouse-tracked)
│       │   ├── featured[slug]_Design.tsx
│       │   ├── contact-modal/
│       │   │   ├── contact-modal-context.tsx
│       │   │   └── contact-modal.tsx
│       │   ├── footer/
│       │   │   ├── footer-lazy.tsx     # Dynamic import wrapper
│       │   │   └── footer.tsx
│       │   ├── home/                   # Landing page + featured projects
│       │   │   ├── featured-projects.tsx
│       │   │   ├── landing-page-client.tsx
│       │   │   ├── landing-page.tsx
│       │   │   └── socials-link.tsx
│       │   ├── navigation-bar/
│       │   │   └── navbar.tsx
│       │   └── page-transition/
│       │       └── page-transition.tsx
│       └── projects/
│           └── [slug]/                 # Dynamic project detail pages
│               ├── loading.tsx
│               ├── page.tsx
│               ├── ProjectPageClient.tsx
│               └── casestudy/          # Per-project deep-dive pages
│                   ├── CaseStudyPageClient.tsx
│                   ├── loading.tsx
│                   └── page.tsx
├── public/                             # Static assets
│   ├── badge/                          # Badge images
│   ├── Logo.svg
│   ├── Logo-Avatar.svg
│   ├── Picture.jpg                     # Profile photo
│   └── Master-Resume.pdf
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
CONTENTFUL_SPACE_ID=your_contentful_space_id
CONTENTFUL_ACCESS_TOKEN=your_contentful_access_token
RESEND_API_KEY=your_resend_api_key
```

> Get your Contentful credentials from the [Contentful Dashboard](https://app.contentful.com/) and your Resend key from the [Resend Dashboard](https://resend.com/dashboard).

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

| Command      | Description                              |
| ------------ | ---------------------------------------- |
| `pnpm dev`   | Start development server with hot reload |
| `pnpm build` | Build for production                     |
| `pnpm start` | Start production server                  |
| `pnpm lint`  | Run ESLint for code quality checks       |

---

## Image Optimization

Next.js Image is configured to serve optimized images from Contentful's CDN (`images.ctfassets.net`) in AVIF and WebP formats across responsive device sizes.

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
