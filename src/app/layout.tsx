import type { Metadata } from "next";
import { Newsreader, Figtree, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Display face: Newsreader — an editorial serif with true italics. The
// italic display voice carries the piece's rhetorical register ("What does
// that actually mean?"); mono is reserved for data, never for labels.
const newsreader = Newsreader({
  variable: "--next-font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const figtree = Figtree({
  variable: "--next-font-body",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Separating harm from exposure — a walk through the SORT framework",
  description:
    "A scrollytelling explainer of a pragmatic classification framework for AI incident monitoring, walked through its conversational-AI self-harm case study — from raw incident counts to a probabilistic trajectory classification.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${figtree.variable} ${jetBrainsMono.variable}`}
      // Mandatory snap: every step (and the header/closing landmarks) is a
      // firm stop, one beat per gesture — the tuned scrollytelling feel.
      style={{ scrollSnapType: "y mandatory" }}
    >
      <body className="relative">{children}</body>
    </html>
  );
}
