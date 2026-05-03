export type StageStatus = 'complete' | 'active' | 'upcoming';

export interface PipelineStage {
  id: string;
  name: string;
  status: StageStatus;
  startDate: string | null;
  endDate: string | null;
}

export interface ElectionPipeline {
  countryCode: string;
  electionId: string;
  electionName: string;
  scheduledPollingDate: string;
  currentStageId: string;
  lastUpdated: number;
  dataSource: 'manual' | 'vertex_ai' | 'scraper';
  stages: Record<string, PipelineStage>;
}
