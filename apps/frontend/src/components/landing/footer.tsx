import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="bg-civic-dark py-16" role="contentinfo">
      <div className="mx-auto max-w-[1200px] px-4 lg:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1 — Logo + tagline */}
          <div>
            <p
              className="text-xl font-bold italic text-civic-text-inverse"
              style={{ fontFamily: "var(--font-lora)" }}
            >
              <span className="text-civic-coral">✦</span> CivicMirror
            </p>
            <p
              className="mt-2 text-sm italic text-white/50"
              style={{ fontFamily: "var(--font-lora)" }}
            >
              The election process, mirrored for a new world.
            </p>
            <p className="mt-4 font-mono text-[11px] text-white/30">
              Google Prompt Wars 2026
            </p>
          </div>

          {/* Column 2 — Product */}
          <div>
            <p className="mb-4 font-mono text-xs uppercase tracking-wider text-white/40">
              Product
            </p>
            <ul className="flex flex-col gap-2.5">
              {[
                "How it works",
                "Supported countries",
                "22 Languages",
                "Dashboard",
              ].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Open Source */}
          <div>
            <p className="mb-4 font-mono text-xs uppercase tracking-wider text-white/40">
              Open Source
            </p>
            <ul className="flex flex-col gap-2.5">
              {[
                "Built with Google AI",
                "Open Peeps by Pablo Stanley (CC0)",
                "Powered by Gemini 1.5 Pro",
                "Firebase · Vertex AI · Maps",
              ].map((link) => (
                <li key={link}>
                  <span className="text-sm text-white/60">{link}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Get Started */}
          <div>
            <p className="mb-4 font-mono text-xs uppercase tracking-wider text-white/40">
              Get Started
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-xl bg-civic-coral px-6 py-3 text-sm font-medium text-white transition-all hover:bg-civic-coral-light hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Started — Free
            </a>
            <div className="mt-4">
              <button className="flex items-center gap-1.5 font-mono text-xs text-white/40 transition-colors hover:text-white/60">
                🌐 Language: English
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <Separator className="my-10 bg-white/10" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="font-mono text-[11px] text-white/30">
            © 2026 CivicMirror
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="font-mono text-[11px] text-white/30 transition-colors hover:text-white/50"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="font-mono text-[11px] text-white/30 transition-colors hover:text-white/50"
            >
              Terms
            </a>
          </div>
          <div className="flex gap-1 text-base" aria-hidden="true">
            {["🇳🇬", "🇮🇳", "🇵🇭", "🇲🇽", "🇵🇱", "🇨🇦", "🇬🇧", "🇺🇸", "🇩🇪", "🇦🇺"].map(
              (flag) => (
                <span key={flag}>{flag}</span>
              )
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
