# Phase 3: Personalized Action Layer - Research

**Researched:** 2026-05-04
**Domain:** Stage-aware Personalized Action Checklists
**Confidence:** HIGH

## Summary

This research establishes the architectural and technical foundation for the **Personalized Action Layer** in Phase 3. The primary goal is to provide users with a dynamic, stage-aware checklist based on the 8-stage Election Commission of India (ECI) pipeline. We recommend a **Hybrid Checklist Architecture** where core templates are hardcoded for reliability, and Gemini 1.5 Pro is utilized to inject localized, constituency-specific details (e.g., specific deadlines, local office addresses). 

**Primary recommendation:** Use Zustand with `persist` middleware for local-first progress tracking, combined with a background synchronization service to Firestore for multi-device persistence and cloud backups.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Checklist Template Management | API / Backend | — | Centralized control of the 8-stage logic |
| AI Personalization (Gemini) | API / Backend | — | Secure handling of API keys and prompt orchestration |
| Progress Tracking (Checked items) | Browser / Client | Database / Storage | Local-first for offline resilience; Firestore for sync |
| Stage Transition Detection | API / Backend | Firebase RTDB | Vertex AI monitor triggers real-time updates to all clients |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.2.4 | Frontend Framework | Latest stable with App Router support |
| Zustand | 5.0.12 | State Management | Lightweight, supports persistence middleware |
| Firebase SDK | 12.12.1 | Client Services | Auth and Realtime/Firestore integration |
| @google/generative-ai | 0.21.0 | Gemini Integration | Official SDK for Gemini 1.5 Pro [VERIFIED] |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|--------------|
| Lucide React | 1.14.0 | UI Icons | Standardized icon set |
| Zod | 3.x | Schema Validation | Validating AI outputs and API responses |

**Installation:**
```powershell
pnpm add zustand @google/generative-ai zod
```

## Architecture Patterns

### Recommended Project Structure
```
apps/frontend/src/
├── components/checklist/  # Action Layer UI components
├── lib/stores/            # Zustand stores for checklist state
└── app/[locale]/dashboard/ # Main integration point
apps/backend/src/
├── services/checklist/    # Template logic and AI orchestration
└── agents/                # Vertex AI stage monitors
```

### Pattern 1: Local-First with Background Sync
**What:** Use Zustand's `persist` middleware to save checklist state to `localStorage` immediately upon user interaction.
**When to use:** All user-facing progress markers.
**Example:**
```typescript
// Pattern based on apps/frontend/src/lib/onboarding-store.ts
export const useChecklistStore = create<ChecklistState>()(
  persist(
    (set) => ({
      items: {}, // Record<itemId, boolean>
      toggleItem: (id) => set((state) => ({ items: { ...state.items, [id]: !state.items[id] } })),
    }),
    { name: 'voteup-checklist' }
  )
);
```

### Anti-Patterns to Avoid
- **Pure Cloud-State:** Do not rely on Firestore as the primary state for checkboxes; rural polling booths often have < 1 bar of signal.
- **Dynamic-only Templates:** Do not ask Gemini to "invent" the checklist from scratch; use hardcoded templates to ensure regulatory compliance with ECI rules.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Offline Persistence | Custom LocalStorage sync | Zustand `persist` | Handles hydration and serialization edge cases |
| Stage Monitoring | Polling loops in client | Firebase RTDB | Real-time push is more battery-efficient for mobile |

## Common Pitfalls

### Pitfall 1: Overdue Task Confusion
**What goes wrong:** User registers in Stage 4 (Nomination), but hasn't completed Stage 1 (Registration) tasks.
**Prevention:** Implement "Persistent Tasks" logic where unchecked items from previous stages are flagged as `OVERDUE` rather than being hidden.

## Code Examples

### Gemini Template Customization (Backend)
```typescript
// Prompt pattern for Gemini 1.5 Pro
const prompt = `Ground the following ECI checklist template for ${constituency} given current stage ${stage}. 
Inject real deadlines and addresses from search grounding.
Template: ${templateJSON}`;
```

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest + React Testing Library |
| Full suite command | `pnpm test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command |
|--------|----------|-----------|-------------------|
| ACT-01 | Checklist renders correct stage items | Unit | `pnpm test apps/frontend/src/components/checklist` |
| SYNC-01 | Progress syncs to Firestore when online | Integration | `pnpm test apps/backend/src/services/sync` |

## Sources

### Primary (HIGH confidence)
- `apps/frontend/src/lib/onboarding-store.ts` - Verified Zustand persistence pattern.
- `apps/backend/package.json` - Verified Firebase Admin and Node.js environment.
- ECI Official Voter Guide - Verified 8-stage pipeline and registration requirements.

## Metadata
**Confidence breakdown:**
- Standard stack: HIGH - Package versions verified against registry.
- Architecture: HIGH - Aligned with existing local-first project patterns.

**Research date:** 2024-05-04
**Valid until:** 2024-06-03
