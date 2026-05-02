"use client";

import { useEffect, useState } from "react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300 ${
        scrolled
          ? "bg-[rgba(250,248,244,0.92)] backdrop-blur-xl border-b border-civic-border"
          : "bg-transparent"
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-4 lg:px-6">
        {/* Logo */}
        <a
          href="#"
          className="flex items-center gap-1.5 text-xl font-bold italic text-civic-indigo"
          style={{ fontFamily: "var(--font-lora)" }}
        >
          <span className="text-civic-coral">✦</span>
          <span>VoteUp</span>
        </a>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-8 lg:flex">
          {["How it works", "Who it's for", "Community", "About"].map(
            (link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(/['\s]/g, "-")}`}
                className="text-sm text-civic-text-secondary transition-colors hover:text-civic-indigo hover:underline hover:decoration-civic-coral hover:underline-offset-4"
              >
                {link}
              </a>
            )
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Language pill — desktop only */}
          <button
            className="hidden items-center gap-1.5 rounded-full border border-civic-border bg-civic-card px-3 py-1.5 font-mono text-xs text-civic-text-secondary transition-colors hover:border-civic-indigo lg:flex"
            aria-label="Change language"
          >
            🌐 EN
          </button>

          {/* Sign in — desktop only */}
          <a
            href="#"
            className="hidden text-sm text-civic-text-secondary transition-colors hover:text-civic-indigo lg:block"
          >
            Sign in
          </a>

          {/* CTA */}
          <a
            href="#cta"
            className="rounded-[10px] bg-civic-coral px-4 py-2 text-sm font-medium text-white transition-all hover:bg-civic-coral-light hover:scale-[1.02] active:scale-[0.98]"
          >
            Get Started <span aria-hidden="true">→</span>
          </a>

          {/* Mobile menu button */}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg text-civic-text-secondary lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              {mobileOpen ? (
                <>
                  <line x1="4" y1="4" x2="16" y2="16" />
                  <line x1="16" y1="4" x2="4" y2="16" />
                </>
              ) : (
                <>
                  <line x1="3" y1="5" x2="17" y2="5" />
                  <line x1="3" y1="10" x2="17" y2="10" />
                  <line x1="3" y1="15" x2="17" y2="15" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-b border-civic-border bg-civic-page px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-3">
            {["How it works", "Who it's for", "Community", "About"].map(
              (link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase().replace(/['\s]/g, "-")}`}
                  className="py-2 text-sm text-civic-text-secondary"
                  onClick={() => setMobileOpen(false)}
                >
                  {link}
                </a>
              )
            )}
            <div className="flex items-center gap-3 pt-2 border-t border-civic-border">
              <button className="flex items-center gap-1.5 font-mono text-xs text-civic-text-secondary">
                🌐 EN
              </button>
              <a href="#" className="text-sm text-civic-text-secondary">
                Sign in
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
