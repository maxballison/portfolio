import type { Metadata } from "next";
import { VT323 } from "next/font/google";
import "98.css";
import "./globals.css";

// 98.css supplies the body font (Pixelated MS Sans Serif).
// VT323 is used only for the Winamp-style LCD readouts.
const vt323 = VT323({
  variable: "--font-vt323",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Max Allison - Engineer & Artist",
  description:
    "Personal site of Max Allison: software projects, music, and music technology.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${vt323.variable} h-full`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
