# Phase 3: Personalized Action Layer - Context

**Gathered:** $date
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 3 delivers the **Personalized Action Layer** â€” a stage-aware checklist that guides users through the specific steps they need to take based on their constituency's real-time election status and their own profile (age, residency, status). This covers checklist generation, progress tracking, and offline resilience for the 8-stage election pipeline.

</domain>

<decisions>
## Implementation Decisions

### Checklist Architecture
- **D-01:** Use a **Hybrid approach** with hardcoded templates for each of the 8 election stages. Gemini 1.5 Pro will be used to customize these templates with specific data (deadlines, local office addresses, stage-specific nuances) rather than generating the entire list from scratch.

### State Persistence
- **D-02:** Prioritize a **Local-first approach** using Zustand and localStorage for progress tracking (checked items). This ensures the app remains functional in rural polling areas with poor connectivity. State will sync to Firestore in the background when a connection is available.

### Action Depth
- **D-03:** Checklist items will focus on **Simple Instructions** â€” concise, readable text that tells the user exactly what to do. High-density data like time estimates and deep links to PDFs are deferred to maintain a clean UI for mobile-first users.

### Transition Behavior
- **D-04:** Implement **Persistent Tasks** logic. When a constituency moves to a new stage, "unchecked" items from previous stages that remain relevant (e.g., correcting Voter ID) will stay visible as overdue tasks instead of being automatically archived.

### Claude's Discretion
- Claude has discretion over the specific UI layout of the checklist (e.g., list vs. grid) and the exact wording of AI-customized instructions, provided they follow the "Simple Instructions" mandate.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Foundation
- .planning/ROADMAP.md â€” Phase 3 goal (ACT-01) and dependencies.
- .planning/PROJECT.md â€” Product vision and success criteria for the "Action Layer".
- .planning/phases/01-Foundation-Infrastructure/01-CONTEXT.md â€” Established identity (anonymous auth) and localization patterns.

### Technical Baseline
- .planning/codebase/ARCHITECTURE.md â€” Planned Next.js frontend and Node.js backend structure.
- .planning/codebase/INTEGRATIONS.md â€” Firebase (Auth/Firestore/RTDB) and Google Maps API details.
- .planning/codebase/STACK.md â€” Stack: Next.js 14, Firebase, next-intl, Zustand.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **Zustand Stores:** The onboarding state store can be extended or used as a pattern for the checklist progress and offline sync state.
- **Firebase Auth:** Phase 1's anonymous auth pattern ensures we can link progress to a UID even before the user explicitly signs in with Google.
- **Anek Fonts:** Already integrated for multi-language (English/Hindi) support in Phase 1.

### Established Patterns
- **Local-first state:** Use the planned Zustand patterns to manage transient state before syncing to Firestore.
- **Panel Isolation:** The Action Layer should be built as an isolated UI surface with its own error boundaries, as per the ARCHITECTURE.md conventions.

### Integration Points
- **Next.js App Router:** The checklist UI will likely live in a dedicated route or as a primary panel on the dashboard (apps/frontend/src/app/[locale]/dashboard/page.tsx).
- **Firebase Realtime DB:** Must subscribe to pipeline stage updates to trigger checklist refreshes/updates.
- **Firestore:** Persistent storage for user profile data needed for personalization (age, registration status).

</code_context>

<specifics>
## Specific Ideas

- Ensure "overdue" items from registration stages are clearly flagged if the user enters the app during the "Campaigning" stage.
- AI customization should focus on grounding templates with real-world deadlines relevant to the user's specific constituency.

</specifics>

<deferred>
## Deferred Ideas

- Rich metadata like "Time to Complete" and deep links to ECI PDF forms are deferred to a later "Polishing" phase.
- Interactive status charts (Recharts) remain out of scope for v1.

</deferred>

---

*Phase: 3-Personalized Action Layer*
*Context gathered: $date*
