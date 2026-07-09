/**
 * Cravun domain guardrails.
 *
 * Pure, dependency-free helpers so they can be unit-tested and reused by both
 * the API route (server) and, if ever needed, the client. The system prompt
 * enforces *topical* scope (declining general knowledge, tutorials, etc.);
 * this module adds a deterministic, zero-token defense against prompt-injection
 * and instruction-override attempts that try to break Cravun out of its role.
 */

/** Canonical, on-brand refusal used both here and referenced by the persona. */
export const CRAVUN_DECLINE =
  "I'm designed specifically to answer questions about Krennt Craven — his experience, projects, technical skills, certifications, resume, and portfolio. I can't answer general or unrelated questions, but feel free to ask me about Krennt's work, technologies, career journey, or featured projects.";

/**
 * Patterns that indicate an attempt to override Cravun's instructions, extract
 * its system prompt, or make it role-play as something else. Kept intentionally
 * specific to avoid blocking legitimate portfolio questions (e.g. "what system
 * did he build?").
 */
const INJECTION_PATTERNS: RegExp[] = [
  /\bignore\s+(?:all\s+|the\s+|any\s+)?(?:previous|prior|earlier|above)\s+(?:instructions?|prompts?|rules?|messages?)/i,
  /\bdisregard\s+(?:all\s+|the\s+|your\s+)?(?:previous|prior|above)?\s*(?:instructions?|rules?|context)/i,
  /\bforget\s+(?:everything|all|your)\s+(?:instructions?|rules?|training|above)/i,
  /\b(?:reveal|show|print|repeat|expose|leak|output)\s+(?:me\s+)?(?:your|the)\s+(?:system\s+)?(?:prompt|instructions?|rules?|guidelines?)/i,
  /\bwhat\s+(?:is|are)\s+your\s+(?:system\s+)?(?:prompt|instructions?)\b/i,
  /\byou\s+are\s+now\b/i,
  /\bfrom\s+now\s+on\s+you\s+(?:are|will|must|should)\b/i,
  /\b(?:act|behave|respond|talk)\s+as\s+(?:if\s+you\s+are\s+|a\s+|an\s+)?(?!krennt)/i,
  /\bpretend\s+(?:to\s+be|you\s+are|that\s+you)/i,
  /\brole-?play\s+as\b/i,
  /\b(?:enable|activate|enter)\s+(?:developer|dev|debug|god|dan)\s+mode\b/i,
  /\bjailbreak\b/i,
  /\b(?:bypass|override|disable|turn\s+off)\s+(?:your\s+)?(?:rules?|restrictions?|guardrails?|filters?|safety|instructions?)/i,
  /\byou\s+are\s+(?:no\s+longer|not)\s+(?:cravun|an?\s+assistant)/i,
];

/** True if the text looks like a prompt-injection / instruction-override attempt. */
export function isPromptInjection(text: string): boolean {
  if (!text) return false;
  return INJECTION_PATTERNS.some((re) => re.test(text));
}
