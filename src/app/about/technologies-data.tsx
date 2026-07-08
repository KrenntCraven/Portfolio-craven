export interface TechCategory {
  title: string;
  items: string[];
}

export const technologies: TechCategory[] = [
  {
    title: "Languages",
    items: ["TypeScript", "JavaScript", "Java", "Python", "SQL", "C#"],
  },
  {
    title: "Backend",
    items: ["Node.js", "ASP.NET", "PHP", "REST APIs", "Firebase", "Supabase"],
  },
  {
    title: "Frontend",
    items: [
      "React",
      "Next.js",
      "React Native",
      "Flutter",
      "Tailwind CSS",
      "HTML",
      "CSS",
    ],
  },
  {
    title: "Cloud & DevOps",
    items: [
      "AWS (EC2, S3, Lambda, CloudWatch)",
      "Google Cloud Platform",
      "Microsoft Azure (Azure AD)",
      "Docker",
      "Git / GitHub",
      "CI/CD",
    ],
  },
];
