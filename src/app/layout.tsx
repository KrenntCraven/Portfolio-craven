import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import CravunLauncher from "./frontend/chatbot/cravun-launcher";
import { ContactModalProvider } from "./frontend/contact-modal/contact-modal-context";
import FooterLazy from "./frontend/footer/footer-lazy";
import NavigationBar from "./frontend/navigation-bar/navbar";
import { PageTransitionProvider } from "./frontend/page-transition/page-transition";
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
  metadataBase: new URL("https://krenntcraven.com"),
  title: {
    default: "Krennt Craven",
    template: "%s | Krennt Craven",
  },
  description: "Krennt Craven's Personal Portfolio Website",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/Logo.svg",
  },
  openGraph: {
    title: "Krennt Craven",
    description: "Krennt Craven's Personal Portfolio Website",
    url: "https://krenntcraven.com",
    siteName: "Krennt Craven",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Krennt Craven",
    description: "Krennt Craven's Personal Portfolio Website",
  },
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
