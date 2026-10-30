import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { SiteShell } from "@/components/layout/site-shell";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "ARTI — Art deserves to be discovered",
    template: "%s — ARTI",
  },
  description:
    "Discover extraordinary work from independent artists. Explore new perspectives and meet your next favorite creator.",
  openGraph: {
    title: "ARTI — Art deserves to be discovered",
    description: "A considered space for independent art and the people behind it.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-paper text-ink antialiased">
        <Providers>
          <SiteShell>{children}</SiteShell>
        </Providers>
      </body>
    </html>
  );
}
