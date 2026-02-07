export interface TechCategory {
  title: string;
  items: string[];
}

export const technologies: TechCategory[] = [
  {
    title: "Languages",
    items: ["Java", "TypeScript", "C#", "Unix", "JavaScript", "Python", "SQL"],
  },
  {
    title: "Backend",
    items: [
      "React",
      "React Native",
      "Node JS",
      "Angular",
      "Next.JS",
      "ASP.NET",
      "Kotlin",
      "Flutter",
    ],
  },
  {
    title: "Frontend",
    items: [
      "React",
      "React Native",
      "Node JS",
      "Angular",
      "Next.JS",
      "ASP.NET",
      "Kotlin",
      "Flutter",
    ],
  },
  {
    title: "Cloud & DevOps",
    items: [
      "AWS (S3, EC2, Lambda, CloudWatch)",
      "Microsoft Azure (Azure AD)",
      "Git/GitHub",
      "Docker",
      "ECS",
    ],
  },
];
