---
phase: 06-User-Profiles-Persistence
plan: 02
subsystem: database
tags: [firebase, firestore, zod, vitest, user-profile]
requires:
  - phase: 06-User-Profiles-Persistence
    provides: 06-01 encryption payload contract (ciphertext/iv/salt)
provides:
  - User profile schema contract for history, badges, and encrypted voter data
  - Auth-guarded Firestore user profile CRUD service
  - Unit-tested merge/update behavior for users collection writes
affects: [06-03, 06-04, 06-05, profile-sync, account-linking]
tech-stack:
  added: []
  patterns: [Owner-UID authorization guard in client service, Firestore merge writes for profile lifecycle]
key-files:
  created:
    - packages/contracts/src/user.ts
    - apps/frontend/src/lib/user-service.ts
    - apps/frontend/src/lib/user-service.test.ts
    - apps/frontend/src/lib/firestore-db.ts
  modified: []
key-decisions:
  - "Use `users/{uid}` as canonical profile document path and guard service calls with current auth UID checks."
  - "Use merge writes with server timestamps for profile creation and incremental updates."
patterns-established:
  - "Pattern: verify caller UID equals target UID before any profile read/write operation."
requirements-completed: [PRF-01, PRF-03]
duration: 10min
completed: 2026-05-03
---

# Phase 6 Plan 02: Firestore Schema & User Service Summary

**Firestore-backed user profile contract and service now persist stage history and badges with owner-only UID enforcement and tested CRUD merge behavior.**

## Performance

- **Duration:** 10 min
- **Started:** 2026-05-03T14:12:00Z
- **Completed:** 2026-05-03T14:22:00Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Added `UserProfileSchema` and inferred type in contracts package for profile/history/badges/encrypted payload fields.
- Implemented frontend Firestore user profile service with `getUserProfile`, `createInitialProfile`, and `updateUserProfile`.
- Added unit tests covering fetch/no-doc behavior, create/update merge writes, and authorization guards.

## Task Commits

1. **Task 1: Define User Profile contract** - `37e7309` (feat)
2. **Task 2: Implement User Service for Firestore** - `e954162` (feat)

## Files Created/Modified
- `packages/contracts/src/user.ts` - Zod profile schema and exported `UserProfile` type.
- `apps/frontend/src/lib/user-service.ts` - Firestore profile CRUD service with UID authorization checks.
- `apps/frontend/src/lib/user-service.test.ts` - Vitest coverage for CRUD logic and auth guards.
- `apps/frontend/src/lib/firestore-db.ts` - Firestore DB accessor shared by frontend profile service.

## Decisions Made
- Use client-side authorization assertions (`currentUser.uid === targetUid`) before all service operations to enforce owner-only behavior at call sites.
- Keep Firestore writes merge-based so profile updates are additive and preserve existing fields.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added missing Firestore DB helper used by new service**
- **Found during:** Task 2 (Implement User Service for Firestore)
- **Issue:** Planned service referenced Firestore access, but no shared DB accessor module existed in `src/lib`.
- **Fix:** Added `apps/frontend/src/lib/firestore-db.ts` to initialize/reuse Firestore safely in browser context.
- **Files modified:** `apps/frontend/src/lib/firestore-db.ts`, `apps/frontend/src/lib/user-service.ts`
- **Verification:** `pnpm -F frontend exec vitest run src/lib/user-service.test.ts`
- **Committed in:** `e954162`

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Required for service operability; no scope creep.

## Issues Encountered
- `gsd-sdk` CLI is unavailable in this environment, so state/roadmap automation handlers could not be invoked directly.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- `06-03` can now integrate auth account-linking with profile creation/update primitives.
- `06-04` can consume profile history/badges for dashboard rendering.

## Self-Check: PASSED

- Verified file exists: `.planning/phases/06-User-Profiles-Persistence/06-02-SUMMARY.md`
- Verified file exists: `packages/contracts/src/user.ts`
- Verified file exists: `apps/frontend/src/lib/user-service.ts`
- Verified file exists: `apps/frontend/src/lib/user-service.test.ts`
- Verified file exists: `apps/frontend/src/lib/firestore-db.ts`
- Verified commit exists: `37e7309`
- Verified commit exists: `e954162`
