# Phase 3 Validation Strategy: Personalized Action Layer

This document outlines the verification strategy for ensuring the "Action Layer" is accurate, resilient, and personalized.

## 1. Automated Testing Strategy

### Backend (Logic & Customization)
- **Unit Tests (`template-provider.test.ts`):** Verify that the static template provider returns the correct set of items for each of the 8 ECI stages.
- **Unit Tests (`ai-customizer.test.ts`):**
  - Verify that the prompt injection correctly includes the static template and constituency context.
  - Verify that the Zod schema correctly validates and strips any unexpected AI output.
  - Test fallback logic by mocking Gemini API failures and ensuring the static template is returned.
- **Integration Tests (`checklist-routes.test.ts`):** Verify the `GET` and `POST` endpoints return the expected JSON structures and handle rate limiting.

### Frontend (State & Sync)
- **Unit Tests (`checklist-store.test.ts`):** Verify that `toggleItem` updates the state and that Zustand persistence correctly saves to `localStorage`.
- **Unit Tests (`checklist-sync.test.ts`):**
  - Verify that sync logic is debounced.
  - Verify that `setDoc` is called with the correct `userId` and merge options.
- **Component Tests (`ChecklistContainer.test.tsx`):**
  - Verify that the container correctly fetches data from the API.
  - Verify that "Overdue" logic correctly merges items from previous stages.

## 2. Manual Verification (UAT)

### Personalized Customization
1. **Constituency Grounding:** Call `/api/checklist/customize` with diverse constituencies (e.g., "Lucknow", "Wayand", "Chennai South") and verify that Gemini provides specific local details (e.g., District Collectorate address, specific deadline dates for that region).
2. **"Simple Instructions" Audit:** Manually review AI-generated instructions to ensure they remain concise and actionable (D-03).

### Resilience & Sync
1. **Offline Mode:**
   - Open the app, toggle several checklist items.
   - Disable internet connection (DevTools Offline).
   - Refresh the page and verify toggled items remain checked (LocalStorage persistence).
   - Re-enable internet and verify Firestore contains the updated state.
2. **Authentication Linkage:** Verify that checklist progress is correctly associated with the UID (anonymous or Google) and persists across logins if linked.

### Pipeline Transition (D-04)
1. **Overdue Flagging:** 
   - Start in Stage 1 (Registration), leave some items unchecked.
   - Advance the constituency to Stage 2 (Nomination).
   - Verify that Stage 1 items appear in the "Overdue" section of the Stage 2 checklist.

## 3. Security & Privacy Audit

- **Auth Gates:** Ensure `/api/checklist/*` and `/dashboard` are protected by Firebase Auth middleware.
- **AI Privacy:** Verify that no PII (User Name, Email, Phone) is sent in the prompt to Gemini; only `constituency`, `stage`, and `template` should be transmitted.
- **Firestore Rules:** Verify that a user can only read/write their own checklist document:
  ```
  match /checklists/{userId} {
    allow read, write: if request.auth != null && request.auth.uid == userId;
  }
  ```
