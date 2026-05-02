// ─── CivicMirror Landing Page Data ─────────────────────────────────────

export const PEEPS = {
  standing: "https://cdn.prod.website-files.com/5e51c674258ffe10d286d30a/5e5350f9d399238698511b2f_peep-7.svg",
  afro: "https://cdn.prod.website-files.com/5e51c674258ffe10d286d30a/5e53533367293a3e5c5a8b35_peep-21.svg",
  curly: "https://cdn.prod.website-files.com/5e51c674258ffe10d286d30a/5e535b57f5fa1ab5dbfc2764_peep-83.svg",
  bun: "https://cdn.prod.website-files.com/5e51c674258ffe10d286d30a/5e535c03c6b24912b82c061d_peep-89.svg",
  reading: "https://cdn.prod.website-files.com/5e51c674258ffe10d286d30a/5e535b1d67293aaf6b5e7a33_peep-81.svg",
  waving: "https://cdn.prod.website-files.com/5e51c674258ffe10d286d30a/5e5358fb9b55b0b0f453f5f5_peep-63.svg",
  glasses: "https://cdn.prod.website-files.com/5e51c674258ffe10d286d30a/5e53510f2b568ad72715a304_peep-8.svg",
  sitting: "https://cdn.prod.website-files.com/5e51c674258ffe10d286d30a/5e51c674258ffe2fcb86d313_peep-1.svg",
} as const;

export const PERSONAS = [
  {
    name: "Adaeze",
    from: "Nigeria",
    fromFlag: "🇳🇬",
    to: "Canada",
    toFlag: "🇨🇦",
    peep: PEEPS.afro,
    quote:
      "I'd voted in Nigeria three times. The Canadian system felt completely foreign. CivicMirror made it click in 10 minutes.",
    election: "Canadian Federal Election",
  },
  {
    name: "Mateo",
    from: "Mexico",
    fromFlag: "🇲🇽",
    to: "Spain",
    toFlag: "🇪🇸",
    peep: PEEPS.standing,
    quote:
      "I knew how elections worked back home. But Spain's system? Completely different. CivicMirror was like having a patient friend explain it all.",
    election: "Catalonia Regional Election",
  },
  {
    name: "Priya",
    from: "India",
    fromFlag: "🇮🇳",
    to: "United Kingdom",
    toFlag: "🇬🇧",
    peep: PEEPS.bun,
    quote:
      "India has the world's biggest election. But the UK does it so differently — no voter ID, no ink on the finger. CivicMirror bridged that gap.",
    election: "UK General Election",
  },
  {
    name: "Stefan",
    from: "Poland",
    fromFlag: "🇵🇱",
    to: "Germany",
    toFlag: "🇩🇪",
    peep: PEEPS.glasses,
    quote:
      "The German mixed-member proportional system confused me. CivicMirror compared it side-by-side with Poland's system. Now I get both votes.",
    election: "Bundestag Federal Election",
  },
] as const;

export const PIPELINE_STAGES = [
  "Writ",
  "Nomination",
  "Campaign",
  "Silence",
  "Polling",
  "Counting",
  "Result",
] as const;

export const PIPELINE_DATA: Record<
  string,
  {
    label: string;
    activeIndex: number;
    comparisons: Record<
      number,
      { home: string; new_: string; stageName: string }
    >;
  }
> = {
  "NG-CA": {
    label: "🇳🇬 Nigeria → 🇨🇦 Canada",
    activeIndex: 2,
    comparisons: {
      0: {
        stageName: "Writ Drop",
        home: "In Nigeria, INEC announces the election timetable. The President sets a date within a constitutional window. No formal 'writ' exists.",
        new_: "In Canada, the Governor General dissolves Parliament by issuing writs of election to each riding. This is the official start of the election period.",
      },
      1: {
        stageName: "Nomination Period",
        home: "INEC opens a 3-week window for party primaries and candidate registration. Nomination fees are steep — ₦100M for presidential.",
        new_: "Candidates have 21 days to file nomination papers. A $1,000 CAD deposit is required, refunded if you win 10% of the vote.",
      },
      2: {
        stageName: "Campaign Period",
        home: "In Nigeria, campaigns run for 90 days. Spending limits exist but enforcement is inconsistent. Rallies dominate.",
        new_: "In Canada, the campaign period is capped at 36 days by the Canada Elections Act, with strict $35,000 per-riding spending limits.",
      },
      3: {
        stageName: "Silence Period",
        home: "Nigeria has a 24-hour campaign blackout before polling day. Social media is not formally covered.",
        new_: "Canada has no formal silence period, but broadcast advertising is banned on polling day itself.",
      },
      4: {
        stageName: "Polling Day",
        home: "Voters use paper ballots at designated polling units. Voting is on a Saturday. Biometric verification is used.",
        new_: "Voters mark a paper ballot at their assigned polling station. Voting is on a Monday. ID can be vouched by another voter.",
      },
      5: {
        stageName: "Counting",
        home: "Results are collated from polling units to ward → LGA → state → national level. This can take days.",
        new_: "Ballots are counted at each polling station immediately after polls close. Results are typically known the same night.",
      },
      6: {
        stageName: "Result Declaration",
        home: "INEC declares the final result at a national collation centre. Results can be challenged in court within 21 days.",
        new_: "The Chief Electoral Officer validates results. Judicial recounts are rare but possible within 4 days.",
      },
    },
  },
  "IN-GB": {
    label: "🇮🇳 India → 🇬🇧 United Kingdom",
    activeIndex: 2,
    comparisons: {
      0: {
        stageName: "Election Announcement",
        home: "The Election Commission of India announces the election schedule, typically 6-8 weeks before polling begins.",
        new_: "The Prime Minister asks the King to dissolve Parliament. A minimum 25 working days before the election is required.",
      },
      2: {
        stageName: "Campaign Period",
        home: "India's campaign period can stretch 2-3 months across phases. Door-to-door canvassing and massive rallies are the norm.",
        new_: "The UK campaign is typically 5-6 weeks. Spending is capped nationally and per constituency. Broadcast time is allocated.",
      },
    },
  },
  "MX-US": {
    label: "🇲🇽 Mexico → 🇺🇸 United States",
    activeIndex: 2,
    comparisons: {
      0: {
        stageName: "Election Call",
        home: "In Mexico, INE (National Electoral Institute) manages a fixed 6-year presidential cycle. The date is constitutionally set.",
        new_: "US presidential elections are held every 4 years on the first Tuesday after the first Monday in November. Fixed by law.",
      },
      2: {
        stageName: "Campaign Period",
        home: "Mexico has a 90-day official campaign window. INE enforces strict media spending caps and equal airtime rules.",
        new_: "US campaigns can run for over a year. Spending is virtually unlimited after Citizens United. Super PACs dominate.",
      },
    },
  },
  "PL-DE": {
    label: "🇵🇱 Poland → 🇩🇪 Germany",
    activeIndex: 2,
    comparisons: {
      0: {
        stageName: "Election Call",
        home: "Poland's President sets the election date. The Sejm is elected every 4 years under a proportional system.",
        new_: "Germany's Bundestag elections are held every 4 years. The Federal President dissolves the Bundestag on the Chancellor's request.",
      },
      2: {
        stageName: "Campaign Period",
        home: "Poland uses an open-list proportional system. Campaign spending is capped. Television debates are standard.",
        new_: "Germany's mixed-member proportional system means voters cast two votes. Campaign spending limits are relatively low.",
      },
    },
  },
};

export const JOURNEY_CHIPS = [
  { fromFlag: "🇳🇬", from: "Nigeria", toFlag: "🇨🇦", to: "Canada" },
  { fromFlag: "🇮🇳", from: "India", toFlag: "🇬🇧", to: "United Kingdom" },
  { fromFlag: "🇵🇭", from: "Philippines", toFlag: "🇺🇸", to: "United States" },
  { fromFlag: "🇲🇽", from: "Mexico", toFlag: "🇺🇸", to: "United States" },
  { fromFlag: "🇵🇱", from: "Poland", toFlag: "🇩🇪", to: "Germany" },
  { fromFlag: "🇧🇩", from: "Bangladesh", toFlag: "🇬🇧", to: "United Kingdom" },
  { fromFlag: "🇨🇳", from: "China", toFlag: "🇦🇺", to: "Australia" },
  { fromFlag: "🇮🇳", from: "India", toFlag: "🇦🇺", to: "Australia" },
  { fromFlag: "🇳🇬", from: "Nigeria", toFlag: "🇬🇧", to: "United Kingdom" },
  { fromFlag: "🇵🇭", from: "Philippines", toFlag: "🇦🇺", to: "Australia" },
  { fromFlag: "🇲🇽", from: "Mexico", toFlag: "🇪🇸", to: "Spain" },
  { fromFlag: "🇵🇰", from: "Pakistan", toFlag: "🇬🇧", to: "United Kingdom" },
] as const;

export const FEED_ITEMS = [
  {
    flags: "🇮🇳→🇬🇧",
    text: "Priya from Mumbai just added her polling day to Calendar.",
    time: "2 min ago",
    type: "action" as const,
  },
  {
    flags: "🇳🇬→🇨🇦",
    text: 'Adaeze asked: "Why is there no presidential ballot?"',
    time: "5 min ago",
    type: "indigo" as const,
  },
  {
    flags: "🇲🇽→🇪🇸",
    text: "Mateo completed Stage 3 of Spain's election process.",
    time: "8 min ago",
    type: "milestone" as const,
  },
  {
    flags: "🇵🇭→🇺🇸",
    text: "New comparison available: Philippines → United States",
    time: "12 min ago",
    type: "indigo" as const,
  },
  {
    flags: "🇵🇱→🇩🇪",
    text: "Stefan registered for Germany's Bundestag election updates.",
    time: "15 min ago",
    type: "action" as const,
  },
  {
    flags: "🇧🇩→🇬🇧",
    text: "Farhan found his polling station in Tower Hamlets.",
    time: "18 min ago",
    type: "milestone" as const,
  },
  {
    flags: "🇨🇳→🇦🇺",
    text: "Wei added the Australian registration deadline to Calendar.",
    time: "22 min ago",
    type: "action" as const,
  },
  {
    flags: "🇮🇳→🇦🇺",
    text: 'Arun asked: "Is voting mandatory in Australia?"',
    time: "25 min ago",
    type: "indigo" as const,
  },
] as const;

export const FEATURES = [
  {
    icon: "🔴",
    title: "The election, live.",
    body: "A real-time 7-stage pipeline showing exactly where the election process is right now — from the moment it's called to the final declaration.",
    bg: "bg-civic-indigo-pale",
    border: "border-[rgba(45,43,107,0.15)]",
    wide: true,
  },
  {
    icon: "🌐",
    title: "In your language.",
    body: "Switch to Hindi, Yoruba, Tagalog, French, or 18 more — everything redraws in your preferred language instantly.",
    bg: "bg-civic-card",
    border: "border-civic-border",
    wide: false,
  },
  {
    icon: "⚡",
    title: "What to do, right now.",
    body: "No generic advice. Based on where you are in the process, we tell you the exact next step — and how to do it.",
    bg: "bg-civic-coral-pale",
    border: "border-[rgba(232,99,74,0.2)]",
    wide: false,
  },
  {
    icon: "🪞",
    title: "Explained through what you already know.",
    body: "Every election stage side-by-side with the equivalent from your home country. Not a civics lesson — a personal translation.",
    bg: "bg-civic-card",
    border: "border-civic-border",
    wide: true,
  },
  {
    icon: "📅",
    title: "Never miss a deadline.",
    body: "Registration deadline. Campaign silence. Polling day. All added to your Google Calendar in one tap.",
    bg: "bg-civic-card",
    border: "border-civic-border",
    wide: false,
  },
  {
    icon: "💬",
    title: "Ask. We'll answer.",
    body: "Any question about the election process — answered through the lens of your home country system. Powered by AI, grounded in official sources.",
    bg: "bg-civic-gold-pale",
    border: "border-[rgba(201,151,42,0.2)]",
    wide: false,
  },
] as const;
