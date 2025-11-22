export enum AppStep {
  AUTH_CHECK = 'AUTH_CHECK',
  CAPTURE = 'CAPTURE',
  INPUT = 'INPUT',
  PROCESSING_IMAGE = 'PROCESSING_IMAGE',
  PROCESSING_VIDEO = 'PROCESSING_VIDEO',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}

export interface AppState {
  step: AppStep;
  originalImage: string | null; // Base64
  animal: string;
  modifiedImage: string | null; // Base64
  videoUrl: string | null;
  error: string | null;
}

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
}