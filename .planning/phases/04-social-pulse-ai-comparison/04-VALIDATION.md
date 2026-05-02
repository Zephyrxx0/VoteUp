# Phase 4 Validation Strategy: Social Pulse & AI Comparison

This document outlines the verification strategy for ensuring the "Social Pulse" and "AI Comparison" features are accurate, performant, and resilient.

## 1. Automated Testing Strategy

### Backend (Logic & Customization)
- **Unit Tests (`pulse.test.ts`):** 
  - Verify that the `pulse-store.ts` correctly executes Firestore `.count()` aggregations.
  - Verify that queries correctly filter by `acId` and `reportedStage`.
- **Unit Tests (`comparison.test.ts`):**
  - Verify that the prompt injection correctly requests JSON output from Gemini.
  - Verify that the Zod schema correctly validates the structure of the AI comparison.
  - Test fallback logic for Gemini API failures or invalid JSON formatting.

### Frontend (State & UI)
- **Unit Tests (`ai-comparison.test.tsx`):** 
  - Verify that `ComparisonCards` render side-by-side on desktop and stack vertically on mobile (checking responsive Tailwind classes).
- **Unit Tests (`badge-threshold.test.tsx`):**
  - Verify that the `MilestoneBadge` component accurately computes when to display a badge based on both personal completion state and community thresholds.
- **Component Tests (`ai-comparison-store.ts` & `social-pulse-store.ts`):**
  - Verify that Zustand persistence locally caches the generated AI comparison to prevent redundant API calls.

## 2. Manual Verification (UAT)

### AI Comparison Caching
1. **Zustand Persistence:**
   - Navigate to the Dashboard and trigger the AI comparison generation for a selected country.
   - Refresh the page or close and reopen the tab.
   - Verify that the comparison data loads instantly without triggering a new network request to the backend.

### Social Pulse Metrics
1. **Aggregation Accuracy:**
   - Seed test reports in Firestore for a specific constituency (`acId`).
   - Load the dashboard and verify the `PulseCounter` accurately displays the total milestone counts (e.g., "150 users completed Stage 1").
   - Add a new report manually via Firebase Console and refresh the frontend to ensure the count updates correctly.

### Responsive UI Audit
1. **Comparison Layout:**
   - Render `ComparisonCards` with the generated data.
   - Resize the browser window to mobile width (<768px).
   - Verify the cards transition cleanly from side-by-side to stacked vertically without horizontal scrolling or text overflow.

## 3. Security & Privacy Audit

- **Auth Gates:** Ensure `/api/pulse` and `/api/ai-comparison` endpoints are protected by Firebase Auth middleware to prevent unauthorized or excessive API usage.
- **Cost Protection:** Verify that Firestore queries exclusively use `AggregateField.count()` instead of fetching document collections to prevent billing spikes.
- **Input Validation:** Ensure Zod strictly validates the user's home country input string on the backend before injecting it into the Gemini prompt to mitigate prompt injection risks.
