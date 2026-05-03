---
phase: 05-Counting-Day-Results
plan: 01
subsystem: api
tags: [playwright, express, caching, stage-resolution]
requires:
  - phase: 05-00
    provides: counting-day planning baseline and test skeletons
provides:
  - Playwright-based constituency results scraper with validated constituency IDs
  - 5-minute in-memory cache for scraped candidate results
  - Time-aware stage resolver with May 4, 2026 default counting date
  - GET /api/constituency/:id/status endpoint returning stage and results
affects: [phase-05-ui-results-visualization, backend-api-consumers]
tech-stack:
  added: []
  patterns: [header-relative table extraction, server-side ttl caching]
key-files:
  created:
    - apps/backend/src/services/scraper/results-engine.ts
    - apps/backend/src/services/db/results-cache.ts
    - apps/backend/src/routes/status.ts
  modified:
    - apps/backend/src/services/db/constituency-store.ts
    - apps/backend/src/app.ts
key-decisions:
  - "Constituency status endpoint only scrapes after entering Counting stage and cache miss."
  - "Constituency ID input is constrained to S#### to mitigate SSRF-like URL abuse."
patterns-established:
  - "Pattern: Validate all scraper-bound route params before URL construction."
  - "Pattern: Keep external scrape calls behind a short-lived server-side cache."
requirements-completed: [RES-01, RES-02, RES-04]
duration: 29min
completed: 2026-05-03
---

# Phase 05 Plan 01: Counting Day Results Backend Summary

**Counting-day backend now serves unified constituency stage + live candidate results using a validated Playwright scraper and 5-minute cache.**

## Performance

- **Duration:** 29 min
- **Started:** 2026-05-03T06:44:00Z
- **Completed:** 2026-05-03T07:13:30Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Added `results-engine.ts` to scrape ECI result tables using header-relative parsing and realistic browser headers.
- Added `results-cache.ts` singleton with 5-minute TTL behavior for backend-side rate protection.
- Implemented time-aware `resolveCurrentStage` and new `GET /api/constituency/:id/status` API, then registered it in app routing.

## Task Commits

Each task was committed atomically:

1. **Task 1: Implement Results Scraper & Cache** - `a0980b0` (feat)
2. **Task 2: Update Stage Resolver & Create Status API** - `dfd2fdb` (feat)

Additional correctness fix:
- `b4251e7` (fix): corrected type-only import that blocked backend startup.

## Files Created/Modified
- `apps/backend/src/services/db/results-cache.ts` - TTL cache singleton and candidate result type.
- `apps/backend/src/services/scraper/results-engine.ts` - Playwright scrape flow and header-relative HTML extraction.
- `apps/backend/src/routes/status.ts` - status endpoint returning `{ stage, results }` with cache-then-scrape behavior.
- `apps/backend/src/services/db/constituency-store.ts` - exported `resolveCurrentStage` with counting-date default.
- `apps/backend/src/app.ts` - router registration for `/api/constituency`.

## Decisions Made
- Route-level guard enforces `S####` constituency format before scrape URL assembly.
- Stage defaults to demo counting date (`2026-05-04`) when no constituency-specific counting date exists.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed ESM runtime import mismatch in scraper engine**
- **Found during:** Task 2 verification (backend startup + curl)
- **Issue:** `CandidateResult` was imported as a runtime symbol from a type-only export, causing server boot failure.
- **Fix:** Converted to `import type` in `results-engine.ts`.
- **Files modified:** `apps/backend/src/services/scraper/results-engine.ts`
- **Verification:** Backend starts successfully and endpoint responds with JSON.
- **Committed in:** `b4251e7`

---

**Total deviations:** 1 auto-fixed (Rule 1)
**Impact on plan:** Required for runtime correctness; no scope creep.

## Issues Encountered
- `gsd-sdk` CLI was unavailable in PATH in this environment, so SDK state automation commands could not be executed.

## Known Stubs
None.

## Threat Flags
None.

## Verification Run
- `node --test apps/backend/src/tests/scraper.test.ts` ✅
- `node --test apps/backend/src/tests/stage.test.ts` ✅
- `curl http://localhost:3000/api/constituency/S2477/status` equivalent via `Invoke-WebRequest` ✅ returned JSON shape `{ "stage": "Not Scheduled", "results": [] }`

## Next Phase Readiness
- Backend primitives for counting-day results are in place and callable from frontend.
- Frontend can now consume `/api/constituency/:id/status` for live/cached rendering.

## Self-Check: PASSED
- Found summary file: `.planning/phases/05-Counting-Day-Results/05-01-SUMMARY.md`
- Found commits: `a0980b0`, `b4251e7`, `dfd2fdb`
