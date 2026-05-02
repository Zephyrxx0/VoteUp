export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  stage: number;
  isMandatory: boolean;
  category: string;
}

export interface ChecklistTemplate {
  stage: number;
  stageName: string;
  items: ChecklistItem[];
}

const STAGE_TEMPLATES: Record<number, ChecklistTemplate> = {
  1: {
    stage: 1,
    stageName: 'Registration',
    items: [
      { id: 's1-verify-eligibility', title: 'Check your eligibility', description: 'Confirm your age, citizenship, and residency match Form 6 rules.', stage: 1, isMandatory: true, category: 'Eligibility' },
      { id: 's1-collect-docs', title: 'Collect documents', description: 'Keep identity, address, and age proof ready before submitting.', stage: 1, isMandatory: true, category: 'Documents' },
      { id: 's1-submit-form6', title: 'Submit Form 6', description: 'Apply online or at the local ERO office to register as a voter.', stage: 1, isMandatory: true, category: 'Application' },
      { id: 's1-track-status', title: 'Track application status', description: 'Check your application reference number until verification completes.', stage: 1, isMandatory: false, category: 'Follow-up' },
    ],
  },
  2: {
    stage: 2,
    stageName: 'Nomination',
    items: [
      { id: 's2-read-notice', title: 'Read nomination notice', description: 'Review candidate filing dates announced for your constituency.', stage: 2, isMandatory: true, category: 'Awareness' },
      { id: 's2-verify-roll', title: 'Verify your name in roll', description: 'Confirm your voter details are correct before campaign activity begins.', stage: 2, isMandatory: true, category: 'Verification' },
      { id: 's2-note-helpdesk', title: 'Save local helpdesk details', description: 'Keep ERO and BLO contact numbers handy for corrections.', stage: 2, isMandatory: false, category: 'Support' },
    ],
  },
  3: {
    stage: 3,
    stageName: 'Scrutiny',
    items: [
      { id: 's3-watch-updates', title: 'Watch scrutiny updates', description: 'Follow official updates on accepted and rejected nominations.', stage: 3, isMandatory: false, category: 'Awareness' },
      { id: 's3-fix-voter-issues', title: 'Fix voter record issues', description: 'Submit correction requests immediately if your voter details are wrong.', stage: 3, isMandatory: true, category: 'Correction' },
      { id: 's3-confirm-booth', title: 'Confirm polling booth location', description: 'Check your assigned polling station in advance.', stage: 3, isMandatory: true, category: 'Preparation' },
    ],
  },
  4: {
    stage: 4,
    stageName: 'Withdrawal',
    items: [
      { id: 's4-review-final-list', title: 'Review final candidate list', description: 'Read the final list after withdrawal closes.', stage: 4, isMandatory: true, category: 'Awareness' },
      { id: 's4-plan-vote-day', title: 'Plan your vote day', description: 'Set your travel and time plan for polling day.', stage: 4, isMandatory: true, category: 'Planning' },
      { id: 's4-keep-id-ready', title: 'Keep voter ID alternatives ready', description: 'Prepare approved identity documents for booth verification.', stage: 4, isMandatory: true, category: 'Documents' },
    ],
  },
  5: {
    stage: 5,
    stageName: 'Campaigning',
    items: [
      { id: 's5-track-mcc-updates', title: 'Track MCC updates', description: 'Follow Model Code of Conduct advisories affecting your area.', stage: 5, isMandatory: false, category: 'Awareness' },
      { id: 's5-verify-information', title: 'Verify election information', description: 'Use official ECI channels to confirm claims before sharing.', stage: 5, isMandatory: true, category: 'Safety' },
      { id: 's5-prepare-voter-slip', title: 'Prepare voter slip details', description: 'Keep your part number and serial number handy for quick access.', stage: 5, isMandatory: true, category: 'Preparation' },
    ],
  },
  6: {
    stage: 6,
    stageName: 'Polling',
    items: [
      { id: 's6-check-polling-hours', title: 'Check polling hours', description: 'Confirm start and end times for your booth.', stage: 6, isMandatory: true, category: 'Timing' },
      { id: 's6-carry-id', title: 'Carry approved ID', description: 'Bring your EPIC or another approved ID to the booth.', stage: 6, isMandatory: true, category: 'Documents' },
      { id: 's6-follow-booth-rules', title: 'Follow booth rules', description: 'Respect queue, secrecy, and polling staff instructions.', stage: 6, isMandatory: true, category: 'Compliance' },
      { id: 's6-verify-vvpat', title: 'Verify VVPAT briefly', description: 'After voting, check the VVPAT slip display for your selected candidate.', stage: 6, isMandatory: false, category: 'Verification' },
    ],
  },
  7: {
    stage: 7,
    stageName: 'Counting',
    items: [
      { id: 's7-follow-official-results', title: 'Follow official counting updates', description: 'Track counting rounds from trusted ECI channels only.', stage: 7, isMandatory: false, category: 'Awareness' },
      { id: 's7-avoid-rumors', title: 'Avoid unverified rumors', description: 'Do not forward unofficial victory claims before declarations.', stage: 7, isMandatory: true, category: 'Safety' },
      { id: 's7-note-final-round', title: 'Note final round announcement', description: 'Watch for certified final round updates for your constituency.', stage: 7, isMandatory: false, category: 'Tracking' },
    ],
  },
  8: {
    stage: 8,
    stageName: 'Results',
    items: [
      { id: 's8-confirm-winner', title: 'Confirm declared winner', description: 'Check the final declaration on official ECI channels.', stage: 8, isMandatory: true, category: 'Awareness' },
      { id: 's8-save-civic-next-steps', title: 'Save post-result civic next steps', description: 'Note grievance, registration, and civic participation channels for future use.', stage: 8, isMandatory: false, category: 'Follow-up' },
      { id: 's8-update-household', title: 'Update household voter tasks', description: 'Help family members review pending voter corrections for upcoming cycles.', stage: 8, isMandatory: false, category: 'Community' },
    ],
  },
};

export class TemplateProvider {
  getTemplate(stage: number): ChecklistTemplate {
    const template = STAGE_TEMPLATES[stage];

    if (!template) {
      throw new Error('Invalid stage. Stage must be between 1 and 8.');
    }

    return template;
  }
}
