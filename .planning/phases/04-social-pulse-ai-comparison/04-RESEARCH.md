<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Implement the Gemini-powered home country vs. India comparison using **Side-by-side or Stacked Cards**. This matches 1-to-1 data points (e.g., Electoral Commission vs. Home equivalent body) and provides a clean layout that avoids dense tables on mobile.
- **D-02:** The "Social Pulse" will be driven by **Aggregated Milestone Counts** (e.g., "150 users completed Stage 1"). This leverages the Community Reporting & Consensus Logic established in Phase 2.
- **D-03:** Badges will be awarded for **Both Personal & Community** achievements. This means users earn badges instantly when they complete personal Action Layer items, and also when their constituency reaches aggregated community thresholds (e.g., "Constituency 50% verified"). Re-use the existing `badge.tsx` component.

### the agent's Discretion
None explicitly stated in context, but frontend state caching and backend aggregation implementation specifics fall here.

### Deferred Ideas (OUT OF SCOPE)
None explicitly deferred in context.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| AI-01 | AI-powered home vs India system comparison | Verified Gemini JSON mode and Next.js responsive layout capabilities |
| SOC-01 | Social pulse and milestone badges | Verified Firestore `count()` aggregation and existing `badge.tsx` component |
</phase_requirements>

# Phase 04: Social Pulse & AI Comparison - Research

**Researched:** 2024-05-18
**Domain:** API Integration (Gemini), Backend Aggregation (Firestore), Frontend UI (Next.js)
**Confidence:** HIGH

## Summary

Phase 04 implements an AI-powered comparison between a user's home country election system and India's system using Gemini, and introduces a "Social Pulse" feature showing community milestone counts and awarding badges.

The architecture leverages the existing Express backend to securely orchestrate Gemini API calls, enforcing structured JSON output for clean rendering on the frontend. The Social Pulse leverages Firestore's native `count()` aggregation capabilities to compute community milestones efficiently without fetching raw report documents. The frontend displays this data using responsive "Side-by-side or Stacked Cards" for the comparison, and utilizes the pre-existing `badge.tsx` component for milestone achievements, caching results locally using Zustand to reduce latency and API costs.

**Primary recommendation:** Use Gemini's `responseMimeType: 'application/json'` with Zod validation on the backend to enforce the structure of the AI comparison cards, and use Firestore's `AggregateField.count()` to compute social pulse metrics.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| AI Comparison Generation | API / Backend | — | Securely stores Gemini API key, mitigates prompt injection, and caches cross-user results where applicable. |
| AI Comparison Display | Browser / Client | — | Renders responsive Side-by-side/Stacked Cards adapting to mobile screens. |
| Social Pulse Aggregation | Database / Storage | API / Backend | Uses native Firestore `count()` queries for O(1) bandwidth cost over large constituency datasets. |
| Milestone Badges | Browser / Client | Database / Storage | Evaluates personal achievements (local Zustand state) and community thresholds (fetched from backend) to render `badge.tsx`. |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @google/generative-ai | 0.21.0 | AI Comparison Generation | Official SDK, verified present in backend and already successfully used in Phase 3. |
| firebase-admin | ^13.8.0 | Social Pulse Aggregation | Latest SDK supports `.count().get()` aggregation, preventing memory/billing spikes. |
| zustand | 5.0.12 | UI State & AI Caching | Lightweight, highly performant React state manager with native persistence middleware. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| zod | ^3.25.76 | AI Output Validation | Essential for type-safe parsing of Gemini's JSON responses before sending to the client. |

**Installation:**
No new dependencies are required; use existing packages present in the workspace.

## Architecture Patterns

### Recommended Project Structure
```
apps/frontend/src/
├── components/
│   ├── ai-comparison/
│   │   └── ComparisonCards.tsx   # Renders the side-by-side or stacked layout
│   └── social-pulse/
│       ├── PulseCounter.tsx      # Renders aggregated milestone counts
│       └── MilestoneBadge.tsx    # Wrapper around ui/badge.tsx evaluating thresholds
apps/backend/src/
├── routes/
│   ├── ai-comparison.ts          # Endpoint for generating/fetching comparisons
│   └── pulse.ts                  # Endpoint for fetching aggregated constituency counts
└── services/
    ├── ai/
    │   └── comparison-generator.ts # Encapsulates Gemini API calls
    └── db/
        └── pulse-store.ts        # Encapsulates Firestore aggregation logic
```

### Pattern 1: Structured AI Responses
**What:** Forcing Gemini to return valid, typed JSON instead of raw markdown text.
**When to use:** Whenever AI output needs to be predictably mapped to UI components (like Side-by-side cards).
**Example:**
```typescript
// Source: @google/generative-ai official docs
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-pro',
  generationConfig: {
    responseMimeType: 'application/json',
  },
});
const prompt = "Compare US and India electoral bodies. Return JSON matching: { us: string, india: string }";
const result = await model.generateContent(prompt);
```

### Anti-Patterns to Avoid
- **Uncached AI Calls:** Do not trigger Gemini API calls on every page load or component mount. Cache the result in Zustand `persist` so returning users do not incur additional API costs or latency.
- **Client-Side Document Counting:** Do not fetch all community reports to the frontend just to count `reports.length`. It leaks data and crashes the browser. Use server-side `count()` aggregations.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Client-side Counting | `reports.filter(r => r.stage === 1).length` | Firestore `count()` Aggregation | Network bandwidth and billing explode when fetching thousands of documents just for a number. |
| Custom Layouts | `display: flex; flex-direction: row;` (hardcoded) | Tailwind `flex-col md:flex-row` | Fails D-01 constraint requiring clean layout on mobile; Tailwind's responsive prefixes are built exactly for this. |
| UI Badges | New CSS elements | `ui/badge.tsx` | Strict instruction in D-03 to re-use the existing component for visual consistency. |

## Common Pitfalls

### Pitfall 1: Unhandled Gemini Parsing Errors
**What goes wrong:** The backend crashes because Gemini returned wrapped markdown (e.g. ````json ... ````) instead of raw JSON, despite `responseMimeType`.
**Why it happens:** LLMs sometimes fail to strictly follow output constraints.
**How to avoid:** Use Zod to parse the response, and wrap `JSON.parse` in a try/catch block with fallback or retry logic.
**Warning signs:** 500 Internal Server Errors originating from `ai-comparison.ts` endpoints.

### Pitfall 2: Firestore Aggregation Limits
**What goes wrong:** Aggregation queries become slow.
**Why it happens:** Missing composite indexes on `acId` and `reportedStage`.
**How to avoid:** Ensure the Firestore index configuration (`firestore.indexes.json`) includes necessary compound indexes for the `.where().count()` queries.

## Code Examples

Verified patterns from official sources:

### Firestore Count Aggregation
```typescript
// Source: Firebase Admin Node.js SDK Documentation
import { getFirestore } from 'firebase-admin/firestore';
const db = getFirestore();

export async function getStageCompletionCount(acId: string, stage: number): Promise<number> {
  const snapshot = await db.collection('reports')
    .where('acId', '==', acId)
    .where('reportedStage', '==', stage.toString())
    .count()
    .get();
  
  return snapshot.data().count;
}
```

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Zustand is the intended state manager for AI caching | Standard Stack | High. If context meant React Context or URL state, implementation will violate project patterns. (Zustand is verified in Phase 3 code, but implicitly required here). |
| A2 | GEMINI_API_KEY is available in production | Env Availability | High. Feature completely blocked without a valid API key. |

## Open Questions (RESOLVED)

1. **AI Comparison Caching Strategy**
   - What we know: The comparison depends on the user's home country.
   - What's unclear: Should the generated comparisons be cached globally in Firestore (e.g., "US vs India" stored once for all US users), or just locally in Zustand per user?
   - Resolution: Decided to use local Zustand caching to start for simplicity and privacy. If API costs become a concern, we will implement backend Firestore caching later.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| @google/generative-ai | AI Comparison Engine | ✓ | 0.21.0 | — |
| firebase-admin | Social Pulse Aggregation | ✓ | ^13.8.0 | In-memory `Map` (already stubbed in `reports-store.ts`) |
| GEMINI_API_KEY | AI Comparison Engine | ✗ | — | Define in `.env`; provide static mock data in dev environment if key missing. |

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | vitest ^3.2.4 (Frontend) / node --test (Backend) |
| Config file | vitest.config.ts / package.json |
| Quick run command | `pnpm test` |
| Full suite command | `pnpm test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| AI-01 | Backend returns valid JSON comparison for valid prompt | unit | `npm run test -- apps/backend/src/tests/comparison.test.ts` | ❌ Wave 0 |
| AI-01 | Cards stack on mobile layout (CSS class presence) | unit | `npm run test -- apps/frontend/src/__tests__/ai-comparison.test.tsx` | ❌ Wave 0 |
| SOC-01 | Firestore `count()` accurately reflects community reports | unit | `npm run test -- apps/backend/src/tests/pulse.test.ts` | ❌ Wave 0 |
| SOC-01 | Badge renders when personal threshold met | unit | `npm run test -- apps/frontend/src/__tests__/badge-threshold.test.tsx` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `pnpm test`
- **Per wave merge:** `pnpm test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `apps/backend/src/tests/comparison.test.ts` — covers AI-01 backend logic
- [ ] `apps/frontend/src/__tests__/ai-comparison.test.tsx` — covers AI-01 UI logic
- [ ] `apps/backend/src/tests/pulse.test.ts` — covers SOC-01 aggregation logic

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | yes | Next.js Firebase Auth matching user ID to reports |
| V3 Session Management | yes | Firebase Auth tokens |
| V4 Access Control | yes | Firestore Security Rules for reports collection |
| V5 Input Validation | yes | Zod validation for all Gemini output parsing and user country input |
| V6 Cryptography | no | — |

### Known Threat Patterns for Next.js / Express / Gemini

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Prompt Injection | Tampering | Strict system prompts and Zod output schema enforcement |
| Expensive Query DoS | Denial of Service | Use `.count()` instead of `.get()` for aggregate endpoints |
| Unauthorized Read | Information Disclosure | Validate `acId` ownership or public visibility via Firebase Rules / backend middleware |

## Sources

### Primary (HIGH confidence)
- Context file: `.planning/phases/04-social-pulse-ai-comparison/04-CONTEXT.md`
- Codebase check: `apps/backend/src/services/checklist/ai-customizer.ts` (Gemini integration precedent)
- Codebase check: `apps/backend/package.json` and `apps/frontend/package.json`

### Secondary (MEDIUM confidence)
- Firebase Admin Node.js SDK docs for Firestore Aggregations (via Context7 fallback).

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Verified in `package.json` and existing codebase patterns.
- Architecture: HIGH - Follows established Phase 3 Next.js/Express split.
- Pitfalls: HIGH - Based on common LLM issues and Firestore billing traps.

**Research date:** 2024-05-18
**Valid until:** 2024-06-18
