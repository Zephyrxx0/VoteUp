# Roadmap: VoteUp

## Project Goals
Real-time election pipeline transparency for Indian citizens with personalized action layers.

## Phases

### Phase 1: Foundation & Infrastructure (Completed)
Goal: Established project structure, core UI components, and basic navigation.
**Requirements:** [INF-01, UI-01]

### Phase 2: Data Pipeline & ECI Sync
Goal: Implement the core data engine including ECI scraping, GPS mapping, and community reporting.
**Requirements:** [DATA-01, SYNC-01, MAP-01, VAL-01, RPT-01, ADM-01]

**Plans:**
- [x] 02-01-PLAN.md — Backend TS Migration & Geo-Spatial Core
- [x] 02-02-PLAN.md — ECI Scraper Engine (Playwright + PDF-Parse)
- [x] 02-03-PLAN.md — Cloud Sync & Firestore Persistence
- [x] 02-04-PLAN.md — Community Reporting & Consensus Logic
- [x] 02-05-PLAN.md — Discovery UI (GPS & EPIC Search)
- [x] 02-06-PLAN.md — Admin Dashboard & Data Control
- [x] 02-07-PLAN.md — Offline Resilience & Fallback

### Phase 3: Personalized Action Layer
Goal: Checklist generation based on current stage and user profile.
**Requirements:** [ACT-01]

**Plans:**
**Wave 1**
- [x] 03-01-PLAN.md — Foundation & Template System

**Wave 2 (Blocked on Wave 1)**
- [ ] 03-02-PLAN.md — AI Personalization Engine
- [ ] 03-03-PLAN.md — Local-First State & Persistence

**Wave 2 (Blocked on Wave 1) (Blocked on Wave 2)**
- [ ] 03-04-PLAN.md — UI Implementation & Dashboard Integration

### Phase 4: Social Pulse & AI Comparison
Goal: Side-by-side system comparison (Gemini) and constituency pulse.
**Requirements:** [AI-01, SOC-01]

**Plans:** 4 plans
**Wave 1**
- [x] 04-01-PLAN.md — Social Pulse Backend
**Wave 2**
- [x] 04-02-PLAN.md — AI Comparison Backend
**Wave 2 (Blocked on Wave 1)**
- [x] 04-03-PLAN.md — Social Pulse Frontend
**Wave 3 (Blocked on Wave 2)**
- [x] 04-04-PLAN.md — AI Comparison Frontend

### Phase 5: Counting Day & Result Visualization
Goal: Live election results scraping and real-time dashboard updates for Counting Day (May 4, 2026).
**Requirements:** [RES-01, RES-02, RES-03, RES-04, RES-05]

**Plans:** 3 plans
**Wave 1**
- [ ] 05-01-PLAN.md — Live Results Engine & Stage Logic
**Wave 2 (Blocked on Wave 1)**
- [ ] 05-02-PLAN.md — Counting Dashboard & Result Cards
**Wave 3 (Blocked on Wave 1)**
- [ ] 05-03-PLAN.md — Firebase Finalization & Polish

### Phase 6: User Profiles & Persistence
Goal: Add user profiles, voting history, and persistent badges with client-side encryption.
**Requirements:** [PRF-01, PRF-02, PRF-03]

**Plans:** 6 plans
**Wave 1**
- [ ] 06-01-PLAN.md — Encryption Utility (TDD)
- [ ] 06-02-PLAN.md — Firestore Schema & User Service
**Wave 2**
- [ ] 06-03-PLAN.md — Auth Upgrading & Account Linking
- [ ] 06-04-PLAN.md — Profile View & Dashboard Integration
**Wave 3**
- [ ] 06-05-PLAN.md — Persistence Sync Component (TDD)
- [ ] 06-06-PLAN.md — Privacy Controls & Cleanup

---
## Requirement Registry

| ID | Description |
|----|-------------|
| DATA-01 | 8-stage election pipeline data model |
| SYNC-01 | 12h Automated ECI Sync mechanism |
| MAP-01 | GPS to AC/PC Mapping using Turf.js |
| VAL-01 | EPIC Number Validation and lookup |
| RPT-01 | Community Stage Reporting & Consensus |
| ADM-01 | Secure Admin Dashboard for overrides |
| ACT-01 | Personalized checklist based on stage |
| AI-01 | AI-powered home vs India system comparison |
| SOC-01 | Social pulse and milestone badges |
| RES-01 | Live results scraping from official ECI portal |
| RES-02 | Time-aware stage transition (Stage 8: Counting) |
| RES-03 | Mobile-first Result Card visualization |
| RES-04 | Live dashboard updates with stage indicator |
| RES-05 | Finalized Firestore sync and demo polish |
| PRF-01 | Secure User Profile store with encryption |
| PRF-02 | Google account linking for badge sync |
| PRF-03 | Stage-level journey history tracking |
