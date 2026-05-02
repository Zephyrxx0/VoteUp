# Technology Stack

**Project:** Indian Election Companion (VoteUp)
**Researched:** 2025-05-15
**Status:** Prescriptive for Greenfield Development

## Recommended Stack

### Core Framework & Hosting
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **Next.js** | 14.2.x | Application Framework | App Router support, Server Actions, and optimized `next/font` for multi-script loading. |
| **Vercel** | N/A | Hosting & Edge | Best-in-class support for Next.js 14 features and global edge middleware. |

### Backend & Database (Firebase v11)
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **Cloud Firestore** | v11.x | Primary Database | Real-time updates for "Constituency Pulse" and "Election Pipeline" status. |
| **Firebase Auth** | v11.x | Identity Management | Simplifies multi-platform auth (Google, Phone). |
| **Cloud Functions** | Gen 2 | Background Logic | Handles intensive AI tasks (Gemini) and ECI data scraping/sync in the background. |

### Authentication Bridge
| Library | Version | Purpose | Rationale |
|---------|---------|---------|-----------|
| **next-firebase-auth-edge** | ^1.6.0 | SSR/Middleware Auth | The only reliable way in 2025 to verify Firebase tokens in Next.js Middleware and Server Components without sacrificing performance. |

### Internationalization (i18n)
| Library | Version | Purpose | Rationale |
|---------|---------|---------|-----------|
| **next-intl** | ^3.x | Multi-language Routing | Built-in ICU support for complex Indian language pluralization rules and localized URL pathnames (e.g., `/hi/register` vs `/ta/register`). |

### PWA
| Library | Version | Purpose | Rationale |
|---------|---------|---------|-----------|
| **Serwist** | ^9.0.0 | PWA / Service Worker | Successor to `next-pwa`. Essential for offline-first checklist support and "Election Day" reliability in low-connectivity areas. |

### UI & Typography
| Technology | Version | Purpose | When to Use |
|------------|---------|---------|-------------|
| **Tailwind CSS** | ^3.4 | Styling | Utility-first styling for rapid, responsive development. |
| **Shadcn/UI** | Latest | Component Library | Accessible, customizable components that don't bloat the bundle. |
| **Anek Multi-Script** | Variable | Typography | Use the `Anek` series (Anek Devanagari, Anek Tamil, etc.) via `next/font/google` for harmonized script weights. |

### Maps & AI
| Library | Version | Purpose | Rationale |
|---------|---------|---------|-----------|
| **@vis.gl/react-google-maps** | ^1.1.0 | Google Maps Integration | Modern, declarative React components for polling booth locations. |
| **Vercel AI SDK** | ^3.x | Gemini Integration | Stream side-by-side civic comparisons using Gemini 1.5 Pro. |
| **@ai-sdk/google** | Latest | Gemini Provider | Official provider for Vercel AI SDK. |

---

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| **i18n** | `next-intl` | `react-i18next` | `next-intl` has superior App Router integration and simpler setup for localized routing. |
| **PWA** | `Serwist` | `next-pwa` | `next-pwa` is largely unmaintained; `Serwist` is the community-driven fork optimized for Next.js 14+. |
| **Auth** | `next-firebase-auth-edge` | `FirebaseServerApp` | `FirebaseServerApp` is complex to set up with Service Workers; the edge-auth library is more "Next.js native". |
| **Fonts** | `Anek` Series | `Noto Sans` | `Anek` is a variable font that harmonizes weights across scripts better than the standard Noto series. |

---

## Implementation Details

### Multi-Script Font Loading (Optimized)
```typescript
// app/layout.tsx
import { Anek_Devanagari, Anek_Tamil } from 'next/font/google';

const devanagari = Anek_Devanagari({
  subsets: ['devanagari'],
  display: 'swap',
  variable: '--font-anek-devanagari',
});

// Load only on-demand or in global layout if high usage
const tamil = Anek_Tamil({
  subsets: ['tamil'],
  display: 'swap',
  variable: '--font-anek-tamil',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${devanagari.variable} ${tamil.variable}`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
```

### i18n Number Formatting (Lakhs/Crores)
```typescript
// Standard JS Intl works for India
const formatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumSignificantDigits: 3,
});

formatter.format(100000); // "₹1,00,000" (1 Lakh)
```

## Installation

```bash
# Core
npm install next@14.2 firebase next-intl serwist @serwist/next next-firebase-auth-edge

# UI & Styles
npm install -D tailwindcss postcss autoprefixer
npx shadcn-ui@latest init

# AI & Maps
npm install ai @ai-sdk/google @vis.gl/react-google-maps
```

## Sources

- [Next.js Documentation](https://nextjs.org/docs) (HIGH)
- [Firebase Documentation](https://firebase.google.com/docs) (HIGH)
- [Next-Intl Reference](https://next-intl-docs.vercel.app/) (HIGH)
- [Serwist Documentation](https://serwist.pages.dev/) (HIGH)
- [Google Fonts: Anek Series](https://fonts.google.com/specimen/Anek+Devanagari) (HIGH)
