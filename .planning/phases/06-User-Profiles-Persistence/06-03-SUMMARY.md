---
phase: 06-User-Profiles-Persistence
plan: 03
subsystem: auth
tags: [firebase-auth, google-oauth, account-linking, merge-conflict, vitest]
requires:
  - phase: 06-02
    provides: owner-guarded Firestore user profile reads and writes
provides:
  - Anonymous-to-Google account upgrade flow with merge recovery
  - Constituency conflict signal and resolution dialog UI
  - Upgrade prompt for anonymous users with earned badges
affects: [profile-sync, dashboard-auth-ui, privacy-controls]
tech-stack:
  added: []
  patterns: [credential-already-in-use recovery, union merge for history/badges, explicit conflict-return contract]
key-files:
  created:
    - apps/frontend/src/lib/auth-linking.test.ts
    - apps/frontend/src/components/auth/MergeConflictDialog.tsx
    - apps/frontend/src/components/auth/MergeConflictDialog.test.tsx
    - apps/frontend/src/components/auth/UpgradePrompt.tsx
    - apps/frontend/src/components/auth/UpgradePrompt.test.tsx
  modified:
    - apps/frontend/src/lib/auth.ts
key-decisions:
  - "Return structured conflict payload from upgradeToGoogle instead of silently overwriting on constituency mismatch."
  - "Perform cloud-first union merge for history and badges after credential-already-in-use recovery."
patterns-established:
  - "Auth recovery pattern: linkWithPopup -> credentialFromError -> signInWithCredential -> merge profile"
requirements-completed: [PRF-02]
duration: 6min
completed: 2026-05-03
---

# Phase 6 Plan 03: Auth Upgrading & Account Linking Summary

**Google OAuth upgrade flow now preserves anonymous progress, recovers from credential collisions, and exposes merge-conflict choices for constituency mismatches.**

## Performance

- **Duration:** 6 min
- **Started:** 2026-05-03T08:50:00Z
- **Completed:** 2026-05-03T08:56:36Z
- **Tasks:** 3
- **Files modified:** 6

## Accomplishments
- Implemented `upgradeToGoogle` with Firebase `linkWithPopup` and merge recovery for `auth/credential-already-in-use`.
- Added `MergeConflictDialog` with both required choices and callback contract.
- Added `UpgradePrompt` for anonymous users with badges, including upgrade trigger and inline status feedback.

## Task Commits

1. **Task 1: Implement Account Linking with Merge Logic** - `777ebe7` (feat)
2. **Task 2: Create Merge Conflict UI** - `4ac92fa` (feat)
3. **Task 3: Create UpgradePrompt UI component** - `c412ecb` (feat)

## Files Created/Modified
- `apps/frontend/src/lib/auth.ts` - Adds upgrade flow, merge strategy, and conflict return model.
- `apps/frontend/src/lib/auth-linking.test.ts` - Tests direct link success, merge recovery, and constituency mismatch behavior.
- `apps/frontend/src/components/auth/MergeConflictDialog.tsx` - Conflict decision dialog with keep/overwrite options.
- `apps/frontend/src/components/auth/MergeConflictDialog.test.tsx` - Verifies dialog decision callback values.
- `apps/frontend/src/components/auth/UpgradePrompt.tsx` - Anonymous upgrade CTA tied to badge count and auth linking flow.
- `apps/frontend/src/components/auth/UpgradePrompt.test.tsx` - Verifies prompt triggers linking flow.

## Decisions Made
- Returned a typed `conflict` object from `upgradeToGoogle` so UI can gate destructive choices.
- Used set-union merge for `history`/`badges` to satisfy threat-model requirement for non-destructive merge.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Corrected verification command invocation**
- **Found during:** Task 1 verification
- **Issue:** Plan-specified `pnpm -F frontend vitest ...` failed because `vitest` is not a package script.
- **Fix:** Switched to `pnpm -F frontend exec vitest run ...` for file-level test execution.
- **Files modified:** None (execution-command only)
- **Verification:** Auth linking and UI tests all pass with corrected command.
- **Committed in:** N/A (no file change)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** No scope creep; change was required to execute plan verification in this workspace.

## Issues Encountered
- None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- PRF-02 linking flow is implemented and test-covered.
- Ready for persistence sync and privacy controls to consume `upgradeToGoogle` conflict contract.

## Self-Check: PASSED
