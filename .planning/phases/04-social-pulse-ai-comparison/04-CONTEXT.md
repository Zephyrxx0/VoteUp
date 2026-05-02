# Phase 4: Social Pulse & AI Comparison - Context

**Gathered:** 3 May 2026
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 4 delivers **Social Pulse & AI Comparison** — implementing an AI-powered comparison between the user's home country election system and India's system using Gemini. It also introduces social pulse features, including community milestones based on the 8 election stages, and badges for constituency engagement.
</domain>

<decisions>
## Implementation Decisions

### AI Comparison Format
- **D-01:** Implement the Gemini-powered home country vs. India comparison using **Side-by-side or Stacked Cards**. This matches 1-to-1 data points (e.g., Electoral Commission vs. Home equivalent body) and provides a clean layout that avoids dense tables on mobile.

### Social Pulse Metrics
- **D-02:** The "Social Pulse" will be driven by **Aggregated Milestone Counts** (e.g., "150 users completed Stage 1"). This leverages the Community Reporting & Consensus Logic established in Phase 2.

### Milestone Badges
- **D-03:** Badges will be awarded for **Both Personal & Community** achievements. This means users earn badges instantly when they complete personal Action Layer items, and also when their constituency reaches aggregated community thresholds (e.g., "Constituency 50% verified"). Re-use the existing `badge.tsx` component.
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Foundation
- .planning/ROADMAP.md — Phase 4 goals (AI-01, SOC-01) and dependencies.
- .planning/PROJECT.md — Project vision and goals for the social pulse and AI comparison.
- .planning/phases/02-data-pipeline/02-CONTEXT.md — Context on Community Reporting & Consensus Logic (Phase 2).
- .planning/phases/03-personalized-action-layer/03-CONTEXT.md — Context on the Action Layer and checklist items (Phase 3).

### Technical Baseline
- .planning/codebase/ARCHITECTURE.md — Frontend/Backend integration patterns.
- .planning/codebase/INTEGRATIONS.md — Details on Firebase (Auth/Firestore) for community data and Gemini API for AI comparisons.
</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **Badge Component:** The `badge.tsx` component is already implemented in `apps/frontend/src/components/ui/` and is ready for use in the social pulse UI.
- **Zustand Stores:** The existing Zustand store patterns can manage the state for the AI comparison cards and milestone counts.
- **Firebase Firestore:** Queries can be written to compute the aggregated milestone counts for constituencies.

### Integration Points
- **Next.js App Router:** The social pulse and AI comparison will likely be new sections or components integrated into the dashboard page (`apps/frontend/src/app/[locale]/dashboard/page.tsx`).
- **Backend API:** New endpoints in the Express backend (if necessary) to handle Gemini API interactions or perform fast aggregations over Firestore data.
</code_context>

<specifics>
## Specific Ideas

- The AI comparison cards should adapt gracefully to mobile screens, likely switching from side-by-side to stacked vertically.
- Ensure community badge thresholds are achievable to encourage early adoption and momentum.
</specifics>

---

*Phase: 4-Social Pulse & AI Comparison*
*Context gathered: 3 May 2026*