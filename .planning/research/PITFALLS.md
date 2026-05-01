# Domain Pitfalls

**Domain:** Indian Civic Education & Election Companion
**Researched:** 2025-05-15

## Critical Pitfalls

Mistakes that cause rewrites or major user trust issues.

### Pitfall 1: Fragile ECI Data Dependency
**What goes wrong:** The 8-stage pipeline stops updating, showing outdated election dates.
**Why it happens:** Relying on direct web scraping of ECI websites. ECI frequently changes DOM structures, introduces captchas during peak times, or restricts access.
**Consequences:** Users miss registration deadlines; product loses credibility.
**Prevention:** 
- Use official APIs if available (rare).
- Build a resilient scraping layer in a separate Cloud Function.
- **Crucial:** Implement an "Admin Override" tool in Firestore to manually update constituency stages if the automated sync fails.
**Detection:** Set up monitoring for when the scraped ECI schedule data hasn't changed in X days despite an active election cycle.

### Pitfall 2: Firebase Phone Auth Deliverability (TRAI DLT)
**What goes wrong:** Indian users cannot receive OTP SMS messages.
**Why it happens:** India has strict telecom regulations (TRAI DLT) for commercial SMS. If using Firebase Phone Auth without registering sender IDs and templates with an Indian telecom operator, SMS delivery is unreliable or blocked.
**Consequences:** Complete block on new user onboarding.
**Prevention:** 
- Register your brand and SMS templates via the DLT portal (e.g., Jio, Airtel).
- **Fallback:** Always offer Google Sign-In or WhatsApp-based login as an alternative to SMS OTP.
**Detection:** High drop-off rate at the login screen; user complaints about missing OTPs.

## Moderate Pitfalls

### Pitfall 3: Multi-Script Layout Breaking
**What goes wrong:** Tamil or Telugu text clips out of its container or looks disproportionately small compared to English.
**Why it happens:** Indian scripts have complex conjuncts and extensive "matras" (vowels) that extend above and below the baseline.
**Prevention:** 
- Always test UI components with the tallest script (usually Malayalam or Telugu).
- Use `line-height: 1.6` or `1.8` globally for Indian locales.
- Do not use fixed heights (`h-10` in Tailwind) for text containers; use min-heights (`min-h-10`) or padding.

### Pitfall 4: "Flash of Unauthenticated Content" (FOUC)
**What goes wrong:** Users see a generic "Login" screen for a second before their personalized checklist appears.
**Why it happens:** Relying purely on Firebase's client-side `onAuthStateChanged` in a Next.js App Router app.
**Prevention:** Use `next-firebase-auth-edge` to verify session cookies in Next.js middleware before the page renders.

## Minor Pitfalls

### Pitfall 5: PWA Cache Bloat
**What goes wrong:** The PWA fails to install or consumes too much storage on cheap Android phones.
**Why it happens:** Precaching all language assets and high-res Gemini-generated comparisons.
**Prevention:** 
- Only precache the core shell and the user's *selected* language bundle.
- Fetch and cache the AI comparison (Gemini) lazily only when requested.

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| **01: Foundation** | Choosing `next-pwa` over `serwist`. | `next-pwa` is unmaintained; strictly use `serwist` for Next.js 14+. |
| **02: Data Layer** | Syncing user counts on the client. | Use Firestore Aggregation Queries to calculate "Pulse", not client-side counting. |
| **03: i18n UI** | Relying on system fonts. | Force `next/font` with the `Anek` variable font series to ensure consistent shaping. |

## Sources

- [TRAI DLT SMS Regulations](https://trai.gov.in/) (HIGH)
- [Firebase Phone Auth in India Limitations](https://stackoverflow.com/questions/firebase-otp-india) (MEDIUM)
- [Next.js Typography Best Practices](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) (HIGH)
