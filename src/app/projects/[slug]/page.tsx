import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug } from "../../backend/contentful_init";

type PageProps = { params: Promise<{ slug: string }> };

export const revalidate = 3600; // Revalidate every hour

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-white via-neutral-50 to-neutral-100">
      {/* Back button */}
      <div className="mx-auto max-w-5xl px-6 pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
        >
          <svg
            className="h-4 w-4"
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
          Back to projects
        </Link>
      </div>

      {/* Hero section */}
      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="space-y-8">
          {/* Title */}
          <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
            {project.title}
          </h1>

          {/* Image */}
          {project.imageUrl ? (
            <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-2xl ring-1 ring-black/5">
              <div className="relative aspect-video w-full">
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          ) : (
            <div className="grid aspect-video w-full place-items-center rounded-3xl border border-neutral-200 bg-gradient-to-br from-neutral-100 to-neutral-200">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-neutral-300 bg-white text-4xl font-bold text-neutral-400 shadow-sm">
                {project.title.charAt(0).toUpperCase()}
              </div>
            </div>
          )}

          {/* Content placeholder */}
          <div className="prose prose-neutral max-w-none rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
            <p className="text-neutral-600">
              Project details and description will go here.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
