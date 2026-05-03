export interface KeyDifference {
  dimension: string;
  homeValue: string;
  newValue: string;
}

export interface StageComparison {
  homeCountryCode: string;
  newCountryCode: string;
  stageId: string;
  homeSummary: string;
  newSummary: string;
  keyDifferences: KeyDifference[];
}

export interface TranslatedComparison extends StageComparison {
  language: string;
  isTranslated: boolean;
}
