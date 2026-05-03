export type TimelineStep = {
  stage: string;
  window: string;
  whatToDo: string;
};

export type ToolContext = {
  policy: {
    indiaSupport: 'detailed';
    otherCountriesSupport: 'mock';
    hardRules: string[];
  };
  country: string;
  query: string;
  timeline?: {
    country: string;
    support: 'full' | 'mock';
    timeline: TimelineStep[] | string[];
    note: string;
  };
  registration?: {
    country: string;
    support: 'full' | 'mock';
    checklist: string[];
    note: string;
  };
};

const INDIA_TIMELINE: TimelineStep[] = [
  {
    stage: 'Voter registration',
    window: 'Before roll freeze',
    whatToDo: 'Verify EPIC details, address, and constituency mapping.',
  },
  {
    stage: 'Draft and final electoral roll',
    window: 'Weeks before polling',
    whatToDo: 'Track claims/objections and final roll publication.',
  },
  {
    stage: 'Campaign and silence period',
    window: 'Campaign window to 48 hours pre-poll silence',
    whatToDo: 'Understand allowed outreach and silence restrictions.',
  },
  {
    stage: 'Polling day',
    window: 'ECI schedule date',
    whatToDo: 'Carry accepted ID, locate booth, follow queue and VVPAT process.',
  },
  {
    stage: 'Counting and result',
    window: 'Post polling',
    whatToDo: 'Track round-wise updates; treat early leads as provisional.',
  },
];

export function getPolicy() {
  return {
    indiaSupport: 'detailed' as const,
    otherCountriesSupport: 'mock' as const,
    hardRules: [
      'Do not invent official deadlines.',
      'Do not fabricate constituency-specific official results.',
      'Prompt user to verify legal/official details with election authority websites.',
    ],
  };
}

export function getElectionTimeline(country = 'India') {
  const normalized = country.trim() || 'India';
  if (normalized.toLowerCase() !== 'india') {
    return {
      country: normalized,
      support: 'mock' as const,
      timeline: ['registration', 'voter list verification', 'campaign', 'polling', 'counting/result'],
      note: 'Detailed country-specific legal flow is coming soon.',
    };
  }

  return {
    country: 'India',
    support: 'full' as const,
    timeline: INDIA_TIMELINE,
    note: 'Verify official dates and legal notices from Election Commission of India.',
  };
}

export function getRegistrationChecklist(country = 'India') {
  const normalized = country.trim() || 'India';
  if (normalized.toLowerCase() !== 'india') {
    return {
      country: normalized,
      support: 'mock' as const,
      checklist: [
        'Check official election authority portal',
        'Confirm voter eligibility and registration status',
        'Verify polling place before election day',
      ],
      note: 'Detailed checklist for this country is not yet configured.',
    };
  }

  return {
    country: 'India',
    support: 'full' as const,
    checklist: [
      'Validate EPIC and personal details',
      'Confirm assembly/parliament constituency',
      'Check polling station and voting date',
      'Track correction/objection status if filed',
    ],
    note: 'Carry valid ID on polling day and verify booth timing from official sources.',
  };
}

export function buildToolContext(query: string, country = 'India'): ToolContext {
  const lower = query.toLowerCase();
  const result: ToolContext = {
    policy: getPolicy(),
    country,
    query,
  };

  if (/(timeline|stage|process|steps)/.test(lower)) {
    result.timeline = getElectionTimeline(country);
  }

  if (/(register|epic|voter id|checklist|polling)/.test(lower)) {
    result.registration = getRegistrationChecklist(country);
  }

  if (!result.timeline && !result.registration) {
    result.timeline = getElectionTimeline(country);
  }

  return result;
}
