import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import CravunLauncher from "./frontend/chatbot/cravun-launcher";
import { ContactModalProvider } from "./frontend/contact-modal/contact-modal-context";
import FooterLazy from "./frontend/footer/footer-lazy";
import NavigationBar from "./frontend/navigation-bar/navbar";
import { PageTransitionProvider } from "./frontend/page-transition/page-transition";
import {
  AUTHOR_NAME,
  JsonLd,
  personSchema,
  SITE_DESCRIPTION,
  SITE_URL,
  websiteSchema,
} from "./seo";
import "./globals.css";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Krennt Craven — Full-Stack & Cloud Engineer",
    template: "%s | Krennt Craven",
  },
  description: SITE_DESCRIPTION,
  applicationName: "Krennt Craven Portfolio",
  authors: [{ name: AUTHOR_NAME, url: SITE_URL }],
  creator: AUTHOR_NAME,
  publisher: AUTHOR_NAME,
  keywords: [
    "Krennt Craven",
    "Krennt Craven portfolio",
    "Krennt Craven software engineer",
    "Krennt Craven developer",
    "full-stack engineer",
    "cloud engineer",
    "software engineer Philippines",
    "AWS engineer",
    "React developer",
    "Next.js developer",
  ],
  category: "technology",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/Logo.svg",
    shortcut: "/Logo.svg",
    apple: "/Logo.svg",
  },
  openGraph: {
    title: "Krennt Craven — Full-Stack & Cloud Engineer",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: "Krennt Craven",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Krennt Craven — Full-Stack & Cloud Engineer",
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // Set GOOGLE_SITE_VERIFICATION in the environment to render the
  // Search Console verification meta tag (harmless when unset).
  ...(process.env.GOOGLE_SITE_VERIFICATION && {
    verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
  }),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} font-sans antialiased flex flex-col min-h-screen`}
      >
        <JsonLd schema={[personSchema, websiteSchema]} />
        <PageTransitionProvider disableOnPaths={["/projects"]}>
          <ContactModalProvider>
            <NavigationBar />
            <main className="flex-1">{children}</main>
            <FooterLazy />
            <CravunLauncher />
          </ContactModalProvider>
        </PageTransitionProvider>
      </body>
    </html>
  );
}
