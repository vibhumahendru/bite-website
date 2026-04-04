import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bite - Bite-sized summaries for any page",
  description:
    "Bite is a Chrome extension that instantly summarizes any webpage or YouTube video into bite-sized insights, then lets you chat with the content to dig deeper.",
  icons: {
    icon: "/favicon.png",
    apple: "/mascot.png",
  },
  openGraph: {
    title: "Bite - Bite-sized summaries for any page",
    description:
      "Bite is a Chrome extension that instantly summarizes any webpage or YouTube video into bite-sized insights, then lets you chat with the content to dig deeper.",
    siteName: "Bite",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bite - Bite-sized summaries for any page",
    description:
      "Bite is a Chrome extension that instantly summarizes any webpage or YouTube video into bite-sized insights.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0f0f1a] text-[#e0e0e0]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-[#2a2a4a] py-8 text-center text-xs text-[#555]">
          <div className="flex items-center justify-center gap-4 mb-3">
            <a
              href="https://www.linkedin.com/in/vibhu-mahendru/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#555] hover:text-[#888] transition-colors"
              aria-label="LinkedIn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a
              href="mailto:vibhumahendru@gmail.com"
              className="text-[#555] hover:text-[#888] transition-colors"
              aria-label="Email"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            </a>
          </div>
          <p>Bite &copy; {new Date().getFullYear()}. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
