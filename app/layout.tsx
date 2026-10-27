import type { Metadata } from "next";
import "./globals.css";
import { indexable, origin } from "@/lib/content";
export const metadata: Metadata = {
  title: { default: "PMP — Your growth is our pulse.", template: "%s" },
  description:
    "Strategy, creativity, production, and media. An integrated marketing agency in Egypt.",
  metadataBase: origin ? new URL(origin) : undefined,
  robots: indexable
    ? { index: true, follow: true }
    : { index: false, follow: false },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <body>{children}</body>
    </html>
  );
}
