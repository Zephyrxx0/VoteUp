# VoteUp ✦

**VoteUp** is a civic education platform designed for newly naturalized citizens. It helps people understand the election process of their new home through the lens of the democracy they already know, providing a live, personalized, and grounded guide to participating in democracy.

![VoteUp Preview](https://raw.githubusercontent.com/Zephyrxx0/VoteUp/main/apps/web/public/favicon.svg)

## ✦ Key Features

- **Election Pipeline Tracker**: A live, visual timeline of the election process from the drop of the writ to the final result.
- **AI-Powered Comparisons**: Understand complex electoral systems by comparing them side-by-side with your home country's system (e.g., Nigeria vs. Canada).
- **Grounded Election Chatbot**: A production-grade AI assistant that provides factual, tool-based answers grounded in real election data (EPIC verification, polling day checklists, etc.).
- **Multilingual Support**: Built with `next-intl` to support 22+ languages, including English and Hindi, ensuring accessibility for all new citizens.
- **Warm Editorial Aesthetic**: A premium design system using "Warm Editorial Civic" tokens, featuring full-body **Open Peeps** illustrations by Pablo Stanley.

## ✦ Built With

- **Frontend**: Next.js 15+, Tailwind CSS, Shadcn UI, Framer Motion.
- **Backend**: Node.js API with Express.
- **AI Intelligence**: 
  - **Google Gemini 1.5 Flash / 2.0 Flash**: Powers comparisons, chatbots, and personalized action steps.
  - **ADK (Agent Development Kit)**: Grounding engine for the election chatbot.
- **Infrastructure**:
  - **Firebase**: Authentication, Firestore, and Real-time Database for live results.
  - **next-intl**: Internationalization and localization framework.
- **Assets**: Open Peeps (CC0) by Pablo Stanley.

## ✦ Getting Started

### 1. Prerequisites
- [PNPM](https://pnpm.io/) installed.
- A [Google AI Studio](https://aistudio.google.com/) API Key.
- A [Firebase](https://console.firebase.google.com/) Project.

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/Zephyrxx0/VoteUp.git
cd VoteUp

# Install dependencies
pnpm install
```

### 3. Environment Setup
Copy the example environment file and fill in your keys:
```bash
cp .env.example .env
```
Key variables required:
- `GEMINI_API_KEY`: Your Google Gemini API key.
- `GEMINI_MODEL`: Defaults to `gemini-1.5-flash` for stability.
- `FIREBASE_*`: Your Firebase project configuration.

### 4. Development
Run the full stack (Web + API) using Turbo:
```bash
pnpm dev
```
- Web: `http://localhost:3000`
- API: `http://localhost:3001`

## ✦ Project Structure
```text
.
├── apps/
│   ├── web/          # Next.js frontend (Landing, Dashboard, i18n)
│   ├── api/          # Backend services (Gemini, Firebase, Actions)
│   └── agent_adk/    # Grounding and tool context for AI
├── packages/         # Shared configurations and contracts
└── .planning/        # Project roadmap and specifications
```

## ✦ License
Open Source under the MIT License. Illustrations by Pablo Stanley (Open Peeps, CC0).

---
*Built for Google Prompt Wars 2 — Empowering new citizens in a new world.*
