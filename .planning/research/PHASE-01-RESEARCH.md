# Research: Phase 1 — Foundation & Infrastructure

## Tech Stack Deep Dive

### Next.js 14 (App Router)
- **Pattern:** Using server components for data fetching (Firebase Admin) and client components for interactivity (Auth state, pipeline subscription).
- **Styling:** Tailwind CSS for rapid UI development, Radix UI for accessible primitives.
- **State Management:** **Zustand** for global UI state (country pair, onboarding progress). **SWR** for server-state caching.
- **i18n:** `next-intl` is the recommended library for App Router.

### Firebase Integration
- **Client SDK:** Used for Firebase Auth (client-side persistence) and Realtime DB (live updates).
- **Admin SDK:** Used in Cloud Run/API routes for secure database access and service account operations.
- **Auth Flow:** Anonymous login on first visit, linked to Google provider later.

### Project Structure (Turborepo)
- `apps/web`: Next.js frontend.
- `apps/ai`: Python LlamaIndex microservice (Cloud Run).
- `apps/api`: Node.js orchestration backend (Cloud Run).
- `packages/shared-types`: Shared TypeScript interfaces.
- `packages/country-data`: Static election metadata.
- `packages/config`: Shared tailwind/eslint/tsconfig.

## Setup Steps
1. Scaffold Next.js in `apps/web`.
2. Initialize Firebase project and local config.
3. Configure Turborepo for workspace management.
4. Implement the 3-step onboarding UI.

## Risks
- **Firebase SSR:** Handling auth tokens in server components requires middleware and cookie-based sessions or careful client-side state management.
- **Turborepo Config:** Ensuring correct build pipelines for Cloud Run vs Next.js.
