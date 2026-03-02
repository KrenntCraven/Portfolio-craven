"use client";
import dynamic from "next/dynamic";

const Footer = dynamic(() => import("./footer"), { ssr: false });

export default function FooterLazy() {
  return <Footer />;
}
