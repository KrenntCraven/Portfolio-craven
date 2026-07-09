import "server-only";

import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { certifications } from "@/app/about/certification-data";
import { educationItems } from "@/app/about/education-data";
import { experiences } from "@/app/about/experiences-data";
import { technologies } from "@/app/about/technologies-data";
import { getFeaturedProjects } from "@/app/backend/contentful_init";

// A small, fast model is enough for a binary intent check — keeps latency and
// token cost minimal versus routing every question through the main model.
const CLASSIFIER_MODEL = "llama-3.1-8b-instant";

// Memoize the assembled entity list (includes a Contentful fetch) so we don't
// rebuild it on every message. getFeaturedProjects is itself cached; this just
// avoids re-joining strings and re-awaiting per request.
let entityCache: { value: string; expires: number } | null = null;
const ENTITY_TTL_MS = 60 * 60 * 1000; // 1 hour

/**
 * Compact list of in-scope proper nouns — companies, project names, tools,
 * certs, schools — so the classifier recognizes portfolio-relevant questions
 * even when they don't mention "Krennt" by name (e.g. "What is OneSync?" or
 * "What did he do at Amdocs?").
 */
async function buildEntityList(): Promise<string> {
  if (entityCache && entityCache.expires > Date.now()) {
    return entityCache.value;
  }

  const companies = experiences.map((e) => e.company);
  const techs = technologies.flatMap((c) => c.items);
  const certIssuers = Array.from(new Set(certifications.map((c) => c.issuer)));
  const schools = educationItems.map((e) => e.institution);

  let projectTitles: string[] = [];
  try {
    const projects = await getFeaturedProjects();
    projectTitles = projects.map((p) => p.title);
  } catch {
    // Contentful unavailable — proceed with static entities only.
  }

  const value = [
    ...projectTitles,
    ...companies,
    ...certIssuers,
    ...schools,
    ...techs,
  ].join(", ");

  entityCache = { value, expires: Date.now() + ENTITY_TTL_MS };
  return value;
}

const SCOPE = `Krennt Craven's portfolio: his background, work experience, featured projects and case studies, technical skills, the technologies/tools he used in his projects or career, certifications, education, resume, contact/availability, and how this portfolio site was built.`;

/**
 * Intent/relevance gate. Returns true only when the question is about Krennt's
 * portfolio. Judges by TOPIC RELEVANCE (intent), not keyword matching, so
 * portfolio questions that happen to contain general technical terms are
 * allowed, while general-knowledge questions are rejected — even if they
 * mention a technology Krennt also uses.
 *
 * Fails OPEN (returns true) on classifier error so a transient issue degrades
 * to the strict main prompt rather than blocking a legitimate visitor.
 */
export async function isInScope(question: string): Promise<boolean> {
  const q = question.trim();
  if (!q) return false;

  try {
    const entities = await buildEntityList();

    const { text } = await generateText({
      model: groq(CLASSIFIER_MODEL),
      temperature: 0,
      maxOutputTokens: 4,
      system: `You are a strict intent classifier for "Cravun", a chatbot that ONLY answers questions about ${SCOPE}

Known in-scope entities (Krennt's companies, projects, tools, certifications, schools): ${entities}.

Your job: decide if the user's message is asking ABOUT KRENNT — his experience, projects, skills, career, certifications, education, resume, or portfolio. Judge by the INTENT/TOPIC of the question, not by individual keywords.

Mark RELATED when the question is about Krennt or his work — even if it also contains general technical terms. Examples of RELATED:
- "What is OneSync?" (his project)
- "What technologies did Krennt use for OneSync?"
- "How did Krennt build the Ang Pamantasan website?"
- "What AWS services did Krennt use at Amdocs?"
- "What is Krennt's experience with React or AWS?"
- "Tell me about his certifications."

Mark UNRELATED when the question asks for general knowledge, definitions, tutorials, opinions, or help NOT specific to Krennt — even if it mentions a technology he uses. Examples of UNRELATED:
- "What is the latest AirPods model?"
- "Explain dynamic programming."
- "How does Kubernetes work?"
- "What is the best programming language?"
- "Solve this coding problem."
- "How do I deploy a Next.js app?"

Respond with EXACTLY one word: RELATED or UNRELATED. No punctuation, no explanation.`,
      prompt: q,
    });

    const verdict = text.trim().toUpperCase();
    // Only an explicit UNRELATED blocks; anything else proceeds (fail-open).
    return !verdict.startsWith("UNRELATED");
  } catch (error) {
    console.error("Cravun relevance check failed (failing open):", error);
    return true;
  }
}
