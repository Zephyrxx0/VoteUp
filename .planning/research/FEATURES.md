# Feature Landscape

**Domain:** Indian Civic Education & Election Companion
**Researched:** 2025-05-15

## Table Stakes

Features users expect from an official-adjacent civic app. Missing these = lack of trust.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Electoral Search** | Users need to verify they are on the roll (EPIC search). | Medium | Requires integration with ECI search APIs or robust scraping. |
| **8-Stage Pipeline** | Real-time status of their specific constituency. | High | Must sync with ECI's official gazette and schedule updates. |
| **Polling Booth Locator** | Finding where to vote physically. | Low | Google Maps + Constituency data. |
| **Multi-Language Support** | Essential for Indian inclusivity (12+ languages). | Medium | Handled by `next-intl` and `Anek` fonts. |
| **Digital Voter Slip** | A summary of their details and booth for easy voting. | Low | PDF/Image generation. |

## Differentiators

Features that set VoteUp apart from official (often clunky) government apps.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **AI Comparison Layer** | Explains India's system by comparing it to the user's home country. | High | Gemini 1.5 Pro grounded in civic data. |
| **Action Layer Checklist** | A personalized, step-by-step "to-do" list based on the user's current election stage. | Medium | Dynamic logic based on Firestore state. |
| **Constituency Pulse** | Social proof of "how many people in my area are ready." | Low | Real-time Firestore counters. |
| **Milestone Badges** | Gamification to encourage completing registration/voting. | Low | Social engagement without a full network. |
| **PWA Offline Support** | Checklist and Voter Slip available without internet. | Medium | Serwist implementation. |

## Anti-Features

Features to explicitly NOT build to maintain focus and neutrality.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Political News Feed** | Risks bias, misinformation, and regulatory scrutiny. | Stick to neutral, official ECI process updates. |
| **Predictive Polling** | Unreliable and can be seen as "influencing" voters. | Show live voter *readiness* counts, not voter *intent*. |
| **Full Social Network** | Complexity of moderation (MCC violations). | Use "Social Hints" (Pulse/Badges) which are anonymous and safe. |

## Feature Dependencies

```
Location Detection (MAP-01) → Constituency Mapping (ECI-01)
Constituency Mapping (ECI-01) → 8-Stage Pipeline (ECI-01)
8-Stage Pipeline (ECI-01) → Personalized Checklist (ACT-01)
Personalized Checklist (ACT-01) → Milestone Badges (SOC-01)
```

## MVP Recommendation

Prioritize:
1. **ECI-01 (8-Stage Pipeline):** The core value proposition.
2. **AI-01 (Comparison):** The unique selling point for new citizens.
3. **ACT-01 (Action Layer):** The utility that drives usage.
4. **PWA Support:** Ensures the app works on the ground (polling day).

Defer: **Detailed Candidate Profiles (KYC)**. While valuable, the primary focus is the *process* of voting, not the *choice* of candidate in Phase 1.

## Sources

- [ECI Voter Helpline App Features](https://eci.gov.in/voter-helpline-app/) (HIGH)
- [cVIGIL Service Description](https://cvigil.eci.gov.in/) (HIGH)
- [Market Research: Indian Civic Tech Gaps](https://example.com/not-real-but-inferred) (LOW)
