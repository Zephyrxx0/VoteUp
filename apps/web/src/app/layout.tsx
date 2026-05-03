import { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
});

export const metadata: Metadata = {
  title: "VoteUp — Your Election Guide",
  description:
    "Understand your new country's election process, live, in your language. VoteUp shows the election process unfolding in real time — and explains every stage through the lens of the democracy you already know.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "VoteUp",
    description: "The election process, mirrored for a new world.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable}`} data-scroll-behavior="smooth">
      <body className="min-h-screen antialiased bg-[#FDFDFF]">
        {children}
      </body>
    </html>
  );
}
