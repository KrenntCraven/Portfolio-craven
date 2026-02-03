import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import NavigationBar from "./frontend/navigation-bar/navbar";
import "./globals.css";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Craven Portfolio",
  description: "Krennt Craven's Personal Portfolio Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased`}>
        <NavigationBar />
        {children}
      </body>
    </html>
  );
}
