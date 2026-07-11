export type Highlight = {
  title: string;
  detail: string;
};

export type ExperienceBullet = string | Highlight;

export type Experience = {
  company: string;
  position: string;
  period: string;
  description: ExperienceBullet[];
};

export const experiences: Experience[] = [
  {
    company: "Amdocs",
    position: "Software Engineer",
    period: "August 2024 - Present",
    description: [
      {
        title: "Java Customer Service Portal",
        detail:
          "Maintain a Java-based customer service portal used by 20,000+ agents; added CloudWatch alerting for proactive failure detection and contributed to EKS scaling for high availability.",
      },
      {
        title: "PHP Billing Portal Migration (ESOA)",
        detail:
          "Migrated a legacy PHP billing portal (1M+ customers) to AWS — containerized on EKS with API Gateway, Cognito, and PayMaya-powered automated billing notifications.",
      },
      {
        title: "SSIS-to-AWS Pipeline",
        detail:
          "Replaced manual SSIS jobs with an event-driven AWS pipeline (Python, SNS, CloudWatch), automating file-triggered workflows that previously required manual intervention.",
      },
      {
        title: "International SIM Roaming Pipeline",
        detail:
          "Built a Shell/Perl pipeline enabling real-time SIM roaming data exchange between domestic and foreign telecom systems.",
      },
      {
        title: "QR-Based Customer Registration",
        detail:
          "Shipped a QR-based registration feature for ASP.NET MVC that auto-populates customer profiles via internal APIs, cutting manual data entry.",
      },
      {
        title: "Address Resolution Tool",
        detail:
          "Built a geocoding tool (Google Maps API) to capture precise customer coordinates, eliminating ambiguous address data that caused installation errors.",
      },
      {
        title: "Netflix API Integration",
        detail:
          "Integrated Netflix's API into telecom bundles with a custom request-validation and error-handling layer, enabling a new revenue stream.",
      },
    ],
  },
  {
    company: "Willis Towers Watson",
    position: "Software Engineer Intern",
    period: "Oct 2023 - April 2024",
    description: [
      {
        title: "Learning Experience Platform",
        detail:
          "Revamped the frontend of the Learning Experience Platform (ASP.NET MVC), cutting recurring support tickets through improved usability.",
      },
      {
        title: "Azure AD Integration",
        detail:
          "Rolled out Azure AD integration across PH, UK, and Germany offices, streamlining cross-regional access and reducing login issues.",
      },
    ],
  },
  {
    company: "GCash (Mynt - Globe Fintech Innovations, Inc.)",
    position: "PMO Technology & Operations Intern",
    period: "Jun 2023 - Sept 2023",
    description: [
      {
        title: "Workflow Automation",
        detail:
          "Built automated workflows and custom integrations in Google Sites, cutting manual data entry and streamlining day-to-day operations for managers.",
      },
      {
        title: "Jira & QA Documentation",
        detail:
          "Organized Jira documentation and cleaned up QA error tickets in Excel, accelerating issue resolution and improving cross-team collaboration.",
      },
    ],
  },
  {
    company: "Global Scaling Group",
    position: "Lead Generation Intern",
    period: "May 2023 - June 2023",
    description: [
      {
        title: "Lead Generation",
        detail:
          "Generated sales opportunities through prospect research, lead qualification, and client relationship-building, contributing to stronger customer retention.",
      },
    ],
  },
];

// Mobile: impact-first, scannable single-sentence bullets. Deeper technical
// detail lives in the desktop version and behind the card's "show more".
export const experiencesMobile: Experience[] = [
  {
    company: "Amdocs",
    position: "Software Engineer",
    period: "August 2024 - Present",
    description: [
      "Migrated legacy platforms to AWS and built automation pipelines powering telecom systems for 20,000+ agents and 1M+ customers.",
      "Built real-time data exchange pipelines connecting international telecom systems.",
      "Developed QR-based registration flows that reduced manual customer data entry.",
      "Created a geocoding solution that improved address accuracy and reduced installation issues.",
      "Integrated Netflix services into telecom bundles through custom API workflows.",
    ],
  },
  {
    company: "Willis Towers Watson",
    position: "Software Engineer Intern",
    period: "Oct 2023 - April 2024",
    description: [
      "Rebuilt a learning platform frontend, cutting recurring support tickets.",
      "Enabled Azure AD access across PH, UK, and Germany.",
    ],
  },
  {
    company: "GCash (Mynt)",
    position: "PMO Technology & Operations Intern",
    period: "Jun 2023 - Sept 2023",
    description: [
      "Automated operational workflows, cutting manual data entry for managers.",
      "Streamlined QA documentation to accelerate issue resolution.",
    ],
  },
  {
    company: "Global Scaling Group",
    position: "Lead Generation Intern",
    period: "May 2023 - June 2023",
    description: [
      "Generated sales opportunities through prospect research, lead qualification, and client engagement.",
    ],
  },
];
