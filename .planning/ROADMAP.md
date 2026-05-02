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
- [ ] 03-01-PLAN.md — Foundation & Template System
- [ ] 03-02-PLAN.md — AI Personalization Engine
- [ ] 03-03-PLAN.md — Local-First State & Persistence
- [ ] 03-04-PLAN.md — UI Implementation & Dashboard Integration

### Phase 4: Social Pulse & AI Comparison
Goal: Side-by-side system comparison (Gemini) and constituency pulse.
**Requirements:** [AI-01, SOC-01]

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
