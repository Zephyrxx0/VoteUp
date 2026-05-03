'use client';

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/navigation";

const NAV_COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "Guide", href: "/election-guide" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Community", href: "/#community" },
      { label: "How it works", href: "/#how-it-works" },
    ],
  },
  {
    title: "Legals",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  },
] as const;

export function Footer() {
  const t = useTranslations('navbar');
  const locale = useLocale();

  return (
    <footer className="border-t border-civic-border bg-[#FDFDFF] py-16 lg:py-24">
      <div className="mx-auto max-w-[1200px] px-4 lg:px-6">
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-4 lg:gap-20">
          {/* Brand col */}
          <div className="col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-2xl font-bold italic text-civic-indigo"
              style={{ fontFamily: "var(--font-lora)" }}
            >
              <span className="text-civic-coral font-bold not-italic">✦</span>
              <span>VoteUp</span>
            </Link>
            <p className="mt-6 text-sm leading-relaxed text-civic-text-secondary opacity-80">
              Empowering global citizens through transparent, localized, and
              interactive election insights.
            </p>
          </div>

          {/* Links cols */}
          {NAV_COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-civic-text opacity-40">
                {col.title}
              </h3>
              <ul className="mt-6 space-y-4">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-civic-text-secondary transition-colors hover:text-civic-indigo"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-civic-border pt-10 text-xs text-civic-text-secondary opacity-60 lg:flex-row">
          <p>© {new Date().getFullYear()} VoteUp Platform. All rights reserved.</p>
          <div className="flex gap-8">
            <button className="hover:text-civic-indigo transition-colors uppercase font-bold tracking-widest">
              X (Twitter)
            </button>
            <button className="hover:text-civic-indigo transition-colors uppercase font-bold tracking-widest">
              LinkedIn
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
