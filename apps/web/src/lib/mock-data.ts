import { ElectionPipeline, StageComparison, PersonalisedActions } from '@voteup/contracts';

export const MOCK_PIPELINES: Record<string, ElectionPipeline> = {
  'India': {
    countryCode: 'India',
    electionId: 'federal_2026',
    electionName: 'Lok Sabha General Elections 2026',
    scheduledPollingDate: '2026-04-15',
    currentStageId: 'registration',
    lastUpdated: Date.now(),
    dataSource: 'manual',
    stages: {
      'pre_election': {
        id: 'pre_election',
        name: 'Delimitation & Planning',
        status: 'complete',
        startDate: '2025-10-01',
        endDate: '2025-12-31'
      },
      'registration': {
        id: 'registration',
        name: 'Voter List Revision',
        status: 'active',
        startDate: '2026-01-01',
        endDate: '2026-03-15'
      },
      'campaigning': {
        id: 'campaigning',
        name: 'Public Campaigning',
        status: 'upcoming',
        startDate: '2026-03-16',
        endDate: '2026-04-13'
      },
      'voting': {
        id: 'voting',
        name: 'Phase 1 Polling',
        status: 'upcoming',
        startDate: '2026-04-15',
        endDate: '2026-04-15'
      },
      'results': {
        id: 'results',
        name: 'Final Counting',
        status: 'upcoming',
        startDate: '2026-05-20',
        endDate: '2026-05-20'
      }
    }
  },
  'United States': {
    countryCode: 'United States',
    electionId: 'midterms_2026',
    electionName: '2026 Midterm Elections',
    scheduledPollingDate: '2026-11-03',
    currentStageId: 'pre_election',
    lastUpdated: Date.now(),
    dataSource: 'manual',
    stages: {
      'pre_election': {
        id: 'pre_election',
        name: 'Primaries Phase',
        status: 'active',
        startDate: '2026-03-01',
        endDate: '2026-09-15'
      },
      'registration': {
        id: 'registration',
        name: 'Voter Registration',
        status: 'upcoming',
        startDate: '2026-09-01',
        endDate: '2026-10-20'
      },
      'voting': {
        id: 'voting',
        name: 'Election Day',
        status: 'upcoming',
        startDate: '2026-11-03',
        endDate: '2026-11-03'
      }
    }
  }
};

export const MOCK_COMPARISONS: Record<string, StageComparison> = {
  'India-registration': {
    homeCountryCode: 'India',
    newCountryCode: 'India',
    stageId: 'registration',
    homeSummary: 'Voter registration in India is primarily handled via the EPIC card system. Revisions happen annually.',
    newSummary: 'You are tracking the same system. The 2026 revision focuses on youth enrollment and address updates.',
    keyDifferences: [
      { dimension: 'Method', homeValue: 'NVSP Portal', newValue: 'NVSP Portal' },
      { dimension: 'Identity', homeValue: 'Aadhar/EPIC', newValue: 'Aadhar/EPIC' },
      { dimension: 'Deadline', homeValue: 'March 15', newValue: 'March 15' }
    ]
  }
};

export const MOCK_ACTIONS: Record<string, PersonalisedActions> = {
  'India-registration': {
    stageId: 'registration',
    items: [
      {
        id: '1',
        priority: 'urgent',
        title: 'Update Voter Address',
        description: 'Since you moved to New Delhi, ensure your constituency is updated on the NVSP portal.',
        ctaType: 'external_url',
        ctaPayload: 'https://voters.eci.gov.in/'
      },
      {
        id: '2',
        priority: 'high',
        title: 'Download e-EPIC Card',
        description: 'Get your digital voter ID card to carry as a valid identity proof.',
        ctaType: 'external_url',
        ctaPayload: 'https://voters.eci.gov.in/'
      }
    ],
    mapLocations: []
  }
};

export const PAST_ELECTIONS_DATA = [
  {
    id: 'ls_2024',
    name: 'Lok Sabha 2024',
    region: 'India',
    date: '2024-06-04',
    summary: 'The 18th Lok Sabha election was held to elect 543 members.',
    results: [
      { party: 'BJP', seats: 240, voteShare: '36.57%', color: '#FF9933' },
      { party: 'INC', seats: 99, voteShare: '21.19%', color: '#19AAED' },
      { party: 'SP', seats: 37, voteShare: '4.58%', color: '#FF2222' }
    ]
  },
  {
    id: 'bihar_2025',
    name: 'Bihar Assembly 2025',
    region: 'India',
    date: '2025-02-15',
    summary: 'Recent state assembly elections with high voter turnout.',
    results: [
      { party: 'NDA', seats: 125, voteShare: '38.2%', color: '#FF9933' },
      { party: 'MGB', seats: 110, voteShare: '37.5%', color: '#19AAED' }
    ]
  }
];
