/**
 * About-section copy modeled as inline segments so specific phrases can be
 * emphasized (rendered with the `font-semibold text-[#6c5ce7]` accent) while
 * keeping the content as plain data (no JSX in this module).
 */
export type AboutSegment = string | { bold: string };
export type AboutParagraph = AboutSegment[];

const paragraphs: AboutParagraph[] = [
  [
    "I studied Computer Engineering at Pamantasan ng Lungsod ng Maynila, where I first learned to break down real problems instead of just writing code that compiles.",
  ],
  [
    "That habit carried into internships at Willis Towers Watson and GCash, then into my current role at Amdocs, where I\u2019ve maintained systems supporting ",
    { bold: "20,000+ agents" },
    " and migrated a legacy billing platform serving ",
    { bold: "over a million customers" },
    " to AWS.",
  ],
  [
    "Somewhere along the way, full-stack development stopped being just \u201Cfrontend or backend\u201D and became ",
    { bold: "\u201Cwhatever the system actually needs\u201D" },
    " \u2014 which is how I ended up spending as much time in AWS and cloud infrastructure as I do writing application code.",
  ],
];

export const aboutParagraphs: AboutParagraph[] = paragraphs;
export const aboutMobileParagraphs: AboutParagraph[] = paragraphs;
