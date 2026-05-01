# Architecture Patterns

**Domain:** Hybrid SSR/Real-time Civic Application
**Researched:** 2025-05-15

## Recommended Architecture

A **Hybrid Real-time SSR** architecture using Next.js 14 for the shell/SEO and Firebase for the real-time data layer.

### Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| **Next.js Frontend** | UI Rendering, i18n routing, SEO metadata. | User, Firebase SDK (Client), Server Actions. |
| **Auth Bridge** | Validates session cookies via Edge Middleware. | next-firebase-auth-edge, Firebase Admin. |
| **Data Layer (Firestore)** | Stores real-time pipeline status, Pulse counts. | Next.js Client (Listeners), Cloud Functions. |
| **AI Orchestrator** | Gemini 1.5 Pro processing for comparisons. | Vercel AI SDK, ECI Data Source. |
| **ECI Sync (Functions)** | Scrapes or fetches official ECI schedules. | Cloud Functions Gen 2, ECI Official Site. |

### Data Flow

1. **User Request:** Middleware checks for session cookie. If valid, passes user ID to Server Component.
2. **Initial Render:** Server Component fetches the current 8-stage pipeline status from Firestore using the **Admin SDK** for speed and SEO.
3. **Real-time Hydration:** On the client, a Firestore listener attaches to the user's constituency document to handle immediate status changes (e.g., stage shifts).
4. **Action Input:** User updates a checklist item. A **Server Action** updates Firestore, which triggers a background **Cloud Function** to re-calculate "Constituency Pulse" or award "Milestone Badges".

## Patterns to Follow

### Pattern 1: Edge-Auth Validation
**What:** Verifying Firebase Auth tokens in Next.js Middleware.
**When:** Every protected route request.
**Example:**
```typescript
// middleware.ts
import { authMiddleware } from 'next-firebase-auth-edge';

export default authMiddleware({
  loginPath: '/api/login',
  logoutPath: '/api/logout',
  apiKey: process.env.FIREBASE_API_KEY!,
  // ... configuration
});
```

### Pattern 2: Multi-Script Font Injection
**What:** Dynamically loading the correct Indian script font based on the locale.
**When:** In the root `layout.tsx`.

## Anti-Patterns to Avoid

### Anti-Pattern 1: Client-Side-Only Auth
**What:** Relying solely on `onAuthStateChanged` in a Next.js app.
**Why bad:** Causes "flash of unauthenticated content" (FOUC) and breaks SEO for personalized pages.
**Instead:** Use session cookies and verify on the server.

### Anti-Pattern 2: Heavy Client-Side Scraping
**What:** Trying to fetch ECI data directly from the browser.
**Why bad:** CORS issues, IP blocking, and poor performance for the user.
**Instead:** Use Cloud Functions to proxy and cache ECI data.

## Scalability Considerations

| Concern | At 100 users | At 10K users | At 1M users |
|---------|--------------|--------------|-------------|
| **Firestore Reads** | Direct client listeners. | Use caching/SWR for common data. | Shard "Pulse" counters. |
| **Gemini API** | Direct calls. | Implement rate limiting. | Cache common comparisons. |
| **ECI Sync** | Periodic cron job. | Trigger-based updates. | Dedicated queue (Pub/Sub). |

## Sources

- [Next.js App Router Architecture Guide](https://nextjs.org/docs/app/building-your-application/architecture) (HIGH)
- [Firebase Admin SDK for Node.js](https://firebase.google.com/docs/admin/setup) (HIGH)
- [next-firebase-auth-edge Documentation](https://github.com/awinogrodzki/next-firebase-auth-edge) (HIGH)
