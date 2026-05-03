import { create } from 'zustand';
import { 
  ElectionPipeline, 
  PipelineStage, 
  StageComparison, 
  PersonalisedActions 
} from '@voteup/contracts';

interface YouTubeVideo {
  id: string;
  title: string;
  thumbnailUrl: string;
  url: string;
}

// Extend PipelineStage with a convenience stageId field
interface ActiveStage extends PipelineStage {
  stageId: string;
}

interface PipelineState {
  pipeline: ElectionPipeline | null;
  activeStage: ActiveStage | null;
  comparison: StageComparison | null;
  actions: PersonalisedActions | null;
  videos: YouTubeVideo[];
  
  pipelineLoading: boolean;
  comparisonLoading: boolean;

  setPipeline: (pipeline: ElectionPipeline | null) => void;
  setComparison: (comparison: StageComparison | null) => void;
  setActions: (actions: PersonalisedActions | null) => void;
  setVideos: (videos: YouTubeVideo[]) => void;
  setPipelineLoading: (loading: boolean) => void;
  setComparisonLoading: (loading: boolean) => void;
  
  handleStageTransition: (newStageId: string) => void;
}

export const usePipelineStore = create<PipelineState>((set, get) => ({
  pipeline: null,
  activeStage: null,
  comparison: null,
  actions: null,
  videos: [],
  
  pipelineLoading: true,
  comparisonLoading: true,

  setPipeline: (pipeline) => {
    set({ pipeline });
    if (pipeline && pipeline.currentStageId) {
      get().handleStageTransition(pipeline.currentStageId);
    }
  },
  
  setComparison: (comparison) => set({ comparison }),
  
  setActions: (actions) => set({ actions }),
  
  setVideos: (videos) => set({ videos }),
  
  setPipelineLoading: (loading) => set({ pipelineLoading: loading }),
  
  setComparisonLoading: (loading) => set({ comparisonLoading: loading }),

  handleStageTransition: (newStageId) => {
    const { pipeline } = get();
    if (!pipeline) return;

    const stageData = pipeline.stages[newStageId];
    
    if (stageData) {
      set({ 
        activeStage: {
          ...stageData,
          stageId: newStageId,
          id: stageData.id || newStageId,
          name: stageData.name || newStageId.replace(/_/g, ' '),
        }
      });
    }
  }
}));

