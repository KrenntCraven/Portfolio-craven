import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug } from "../../../backend/contentful_init";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = { params: Promise<{ slug: string }> };

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <main className="relative min-h-screen overflow-hidden bg-white text-neutral-800 pt-16 sm:pt-20 md:pt-24 lg:pt-28">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,0,0,0.05),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(0,0,0,0.03),transparent_28%)]" />
        <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-black/5 via-transparent to-transparent" />
        <div className="absolute inset-x-12 sm:inset-x-24 bottom-[-12rem] h-72 rounded-[36px] bg-black/5 blur-3xl" />
      </div>

      {/* Back button */}
      <div className="relative z-20 mx-auto mt-16 sm:mt-0 max-w-6xl px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <Link
          href={`/projects/${slug}`}
          className="inline-flex w-full items-center justify-center gap-3 rounded-xl border border-neutral-300 bg-white/80 px-4 py-2.5 text-sm font-semibold text-neutral-800 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:border-neutral-400 hover:shadow-md active:translate-y-0 sm:w-auto sm:text-base sm:px-4 sm:py-2.5"
        >
          <svg
            className="h-4 w-4 sm:h-5 sm:w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to project
        </Link>
      </div>

      {/* Content */}
      <section className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:pt-16 lg:pb-20">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-neutral-800 sm:text-5xl lg:text-5xl">
            {project.title}
          </h1>
          <p className="mt-2 text-lg text-neutral-500 font-medium">
            Case Study
          </p>

          <div className="prose prose-neutral prose-lg mt-10 max-w-none text-justify leading-[1.5] prose-headings:text-neutral-800 prose-p:text-neutral-600 prose-p:leading-[1.5] prose-strong:text-neutral-800 prose-a:text-neutral-800 prose-a:underline hover:prose-a:no-underline">
            {project.caseStudy
              ? documentToReactComponents(project.caseStudy)
              : "No case study content yet."}
          </div>
        </div>
      </section>
    </main>
  );
}
