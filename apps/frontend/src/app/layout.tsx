import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { FirestoreSync } from "@/components/shared/FirestoreSync";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VoteUp — Your Election Guide",
  description:
    "Understand your new country's election process, live, in your language. VoteUp shows the election process unfolding in real time — and explains every stage through the lens of the democracy you already know.",
  openGraph: {
    title: "VoteUp",
    description: "The election process, mirrored for a new world.",
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
      className={inter.variable}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="min-h-screen antialiased">
        {children}
        <FirestoreSync />
      </body>
    </html>
  );
}
