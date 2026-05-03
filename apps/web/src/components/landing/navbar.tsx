'use client';

import { useEffect, useState } from "react";
import { Link, usePathname, useRouter } from "@/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Globe, ChevronDown, Check } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const LANGUAGES = [
  { value: 'en', label: 'English', flag: "🇺🇸" },
  { value: 'hi', label: 'हिन्दी', flag: "🇮🇳" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useTranslations('navbar');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  
  const isDashboard = pathname?.includes("/dashboard");
  const dashboardHref = "/dashboard";
  const guideHref = "/election-guide";

  const SECTION_LINKS = [
    { label: t("howItWorks"), href: "#how-it-works" },
    { label: t("whoItsFor"), href: "#who-its-for" },
    { label: t("community"), href: "#community" },
    { label: t("about"), href: "#cta" },
  ] as const;

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300",
        scrolled || isDashboard
          ? "bg-white/80 backdrop-blur-xl border-b border-civic-border shadow-sm"
          : "bg-transparent"
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-4 lg:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xl font-bold italic text-civic-indigo"
          style={{ fontFamily: "var(--font-lora)" }}
        >
          <span className="text-civic-coral font-bold not-italic">✦</span>
          <span>VoteUp</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-8 lg:flex">
          {!isDashboard && SECTION_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-civic-text-secondary transition-colors hover:text-civic-indigo"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="hidden lg:block">
            <Select value={locale} onValueChange={handleLanguageChange}>
              <SelectTrigger className="h-9 w-[130px] border-civic-border bg-white/50 text-xs font-medium hover:bg-white focus:ring-0">
                <div className="flex items-center gap-2 overflow-hidden">
                  <Globe className="size-3.5 shrink-0 text-civic-text-muted" />
                  <SelectValue placeholder="Select" />
                </div>
              </SelectTrigger>
              <SelectContent align="end" className="bg-white border-civic-border">
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value} className="text-xs cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span className="text-base leading-none">{lang.flag}</span>
                      <span>{lang.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* CTA */}
          <Link
            href={guideHref}
            className="rounded-full bg-civic-indigo px-5 py-2 text-sm font-bold text-white transition-all hover:bg-civic-indigo-light hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-100"
          >
            {t("openGuide")}
          </Link>

          {/* Mobile menu button */}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg text-civic-text-secondary lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {mobileOpen ? (
                <>
                  <line x1="4" y1="4" x2="16" y2="16" />
                  <line x1="16" y1="4" x2="4" y2="16" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="17" y2="6" />
                  <line x1="3" y1="10" x2="17" y2="10" />
                  <line x1="3" y1="14" x2="17" y2="14" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="absolute top-full left-0 w-full animate-in slide-in-from-top-5 border-b border-civic-border bg-white px-4 py-6 shadow-xl lg:hidden">
          <div className="flex flex-col gap-5">
            {!isDashboard && SECTION_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-civic-text"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-4 pt-4 border-t border-civic-border">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-civic-text-muted uppercase tracking-wider">{t("language")}</span>
                <div className="flex gap-2">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.value}
                      onClick={() => handleLanguageChange(lang.value)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                        locale === lang.value 
                          ? "bg-civic-indigo text-white" 
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      )}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>
              <Link 
                href={guideHref} 
                className="rounded-xl bg-slate-100 py-3 text-center text-sm font-bold text-civic-indigo"
                onClick={() => setMobileOpen(false)}
              >
                {t("openGuide")}
              </Link>
              <Link 
                href={dashboardHref} 
                className="rounded-xl bg-civic-indigo py-3 text-center text-sm font-bold text-white shadow-lg shadow-indigo-100"
                onClick={() => setMobileOpen(false)}
              >
                {t("liveDashboard")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
