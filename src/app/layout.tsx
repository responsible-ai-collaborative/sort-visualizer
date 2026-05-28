import type { Metadata } from "next";
import { Space_Grotesk, Figtree, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--next-font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
    "A scrollytelling explainer of the SORT framework for classifying AI incident trajectories, using the conversational-AI self-harm case study and an autonomous-vehicle contrast.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${figtree.variable} ${jetBrainsMono.variable}`}
      style={{ scrollSnapType: "y mandatory" }}
    >
      <body
        className="relative"
        data-landmark-snap="on"
        data-snap-stop="always"
      >
        {children}
      </body>
    </html>
  );
}
