export type Sport = 'cricket' | 'tennis' | 'basketball' | 'soccer';

export type AspectRatio = 'square' | 'story';

export type Layout = 'hero' | 'split' | 'collage';

export interface UploadedImage {
  id: string;
  dataUrl: string;
  fileName: string;
}

export interface PosterDraft {
  id: string;
  createdAt: string;
  updatedAt: string;
  sport: Sport;
  eventTitle: string;
  league?: string;
  startTime?: string;
  marketType: string;
  pickText: string;
  teamA?: string;
  teamB?: string;
  playerA?: string;
  playerB?: string;
  confidence: number;
  notes?: string;
  images: UploadedImage[];
  layout: Layout;
  aspect: AspectRatio;
  themeId: string;
}

export interface GeneratedPoster {
  id: string;
  draftId: string;
  createdAt: string;
  aspect: AspectRatio;
  imageDataUrl: string;
  captionText: string;
}

export interface AppSettings {
  watermarkName: string;
  accentColor: string;
  showWatermark: boolean;
  defaultAspect: AspectRatio;
  defaultThemes: Record<Sport, string>;
}

export interface MarketOption {
  label: string;
  value: string;
  requiresValue?: boolean;
  valueLabel?: string;
  requiresPlayer?: boolean;
}

export interface SportMarkets {
  sport: Sport;
  markets: MarketOption[];
}
