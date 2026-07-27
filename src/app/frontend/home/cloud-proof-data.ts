/**
 * Homepage cloud-proof highlights.
 *
 * The site's title and meta description lead with "cloud engineer", but every
 * project on the homepage is an application build. These entries surface the
 * infrastructure work that actually backs that claim so a visitor never has to
 * reach the About page to find it.
 *
 * Each entry is a condensed, metric-forward restatement of an Amdocs bullet in
 * `src/app/about/experiences-data.tsx` — that file stays the source of truth for
 * the full prose. Keep the two in sync: nothing here should assert work that
 * isn't substantiated there.
 */

export type CloudHighlight = {
  /** Headline figure. Short text (e.g. "Event-driven") is fine when there's no number. */
  metric: string;
  metricLabel: string;
  title: string;
  detail: string;
  /** Concrete services/tools used, rendered as chips. */
  services: string[];
};

export const cloudHighlights: CloudHighlight[] = [
  {
    metric: "1M+",
    metricLabel: "customers on the migrated platform",
    title: "Legacy billing platform, moved to AWS",
    detail:
      "Migrated a legacy PHP billing portal onto AWS — containerized on EKS, fronted by API Gateway, with Cognito for authentication and automated billing notifications.",
    services: ["AWS", "EKS", "API Gateway", "Cognito"],
  },
  {
    metric: "20,000+",
    metricLabel: "agents depending on the portal",
    title: "Kept in production, not just shipped",
    detail:
      "Added CloudWatch alerting so failures surface before agents report them, and contributed to EKS scaling work that keeps the Java customer service portal available under load.",
    services: ["EKS", "CloudWatch", "Java"],
  },
  {
    metric: "Event-driven",
    metricLabel: "replacing manual SSIS jobs",
    title: "Scheduled jobs, rebuilt as a pipeline",
    detail:
      "Replaced manual SSIS jobs with a Python pipeline on AWS where SNS events trigger file-driven workflows and CloudWatch traces each run — removing the manual step the old process needed.",
    services: ["AWS", "Python", "SNS", "CloudWatch"],
  },
];
