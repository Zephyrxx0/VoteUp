# Phase 3: Personalized Action Layer - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md â€” this log preserves the alternatives considered.

**Date:** $date
**Phase:** 3-Personalized Action Layer
**Areas discussed:** Checklist Architecture, State Persistence, Action Depth, Transition Behavior

---

## Checklist Architecture

| Option | Description | Selected |
|--------|-------------|----------|
| Hybrid (Templates) | Reliable, fast, but less flexible for edge cases. AI only fills in variables like dates. | âœ“ |
| Pure AI Generation | Highly personalized, handles complex edge cases, but potentially slower/more expensive. | |

**User's choice:** Hybrid (Templates)
**Notes:** The user prefers reliability and speed, using templates that AI merely customizes with specific data points.

---

## State Persistence

| Option | Description | Selected |
|--------|-------------|----------|
| Cloud-first (Firestore) | Simpler, always synced, but requires internet to check items. | |
| Local-first (Offline) | Works offline, snappier UI, syncs to cloud when connection is available. Essential for rural polling. | âœ“ |

**User's choice:** Local-first (Offline)
**Notes:** Critical for ensuring functionality in areas with poor connectivity.

---

## Action Depth

| Option | Description | Selected |
|--------|-------------|----------|
| Simple Instructions | Clean, fast to read, low maintenance. | âœ“ |
| Rich Action Items | Includes deep links to ECI forms, time estimates, and required document lists. | |

**User's choice:** Simple Instructions
**Notes:** Prioritizes clarity and a clean UI over high-density information.

---

## Transition Behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Stage-specific Focus | Only show actions for the current election stage. Old items are cleared or archived. | |
| Persistent Tasks | Show overdue items from previous stages if they are still relevant. | âœ“ |

**User's choice:** Persistent Tasks
**Notes:** Ensures users who join late don't miss critical foundational steps.

---

## Claude's Discretion

- Specific UI layout (list vs grid)
- Exact wording of AI-customized instructions (following "Simple Instructions" rule)
- Implementation details of the Zustand offline-sync mechanism

## Deferred Ideas

- Deep links to official ECI PDF forms (Rich metadata)
- Estimated time per task
