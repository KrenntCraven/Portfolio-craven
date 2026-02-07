import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Footer from "./frontend/footer/footer";
import NavigationBar from "./frontend/navigation-bar/navbar";
import { PageTransitionProvider } from "./frontend/page-transition/page-transition";
import "./globals.css";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Krennt Craven - Portfolio",
  description: "Krennt Craven's Personal Portfolio Website",
  icons: {
    icon: "/Logo.svg",
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
        <PageTransitionProvider>
          <NavigationBar />
          <main className="flex-1">{children}</main>
          <Footer />
        </PageTransitionProvider>
      </body>
    </html>
  );
}
