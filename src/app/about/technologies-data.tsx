export interface TechCategory {
  title: string;
  items: string[];
}

export const technologies: TechCategory[] = [
  {
    title: "Languages",
    items: ["TypeScript", "JavaScript", "Java", "Python", "SQL", "C#", "C++"],
  },
  {
    title: "Backend",
    items: [
      "Node.js",
      "Express.js",
      "Firebase",
      "Supabase",
      "REST APIs",
      "ASP.NET",
      "PHP",
    ],
  },
  {
    title: "Frontend",
    items: [
      "React",
      "Next.js",
      "React Native",
      "Expo",
      "Angular",
      "Flutter",
      "HTML",
      "CSS",
      "Tailwind CSS",
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
