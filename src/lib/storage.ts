import { PosterDraft, GeneratedPoster, AppSettings, Sport } from './types';

const DRAFTS_KEY = 'sport_predictions_drafts';
const POSTERS_KEY = 'sport_predictions_posters';
const SETTINGS_KEY = 'sport_predictions_settings';
const MAX_ITEMS = 50;

export const DEFAULT_SETTINGS: AppSettings = {
  watermarkName: 'Nirm Picks',
  accentColor: '#3B82F6',
  showWatermark: true,
  defaultAspect: 'square',
  defaultThemes: {
    cricket: 'cricket-1',
    tennis: 'tennis-1',
    basketball: 'basketball-1',
    soccer: 'soccer-1',
  },
};

export function getSettings(): AppSettings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
    alert('Failed to save settings. Storage might be full.');
  }
}

export function getDrafts(): PosterDraft[] {
  try {
    const stored = localStorage.getItem(DRAFTS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading drafts:', error);
  }
  return [];
}

export function saveDraft(draft: PosterDraft): void {
  try {
    const drafts = getDrafts();
    const existingIndex = drafts.findIndex(d => d.id === draft.id);

    if (existingIndex >= 0) {
      drafts[existingIndex] = draft;
    } else {
      drafts.unshift(draft);
      if (drafts.length > MAX_ITEMS) {
        drafts.pop();
      }
    }

    localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
  } catch (error) {
    console.error('Error saving draft:', error);
    alert('Failed to save draft. Storage might be full. Try deleting old items.');
  }
}

export function deleteDraft(id: string): void {
  try {
    const drafts = getDrafts().filter(d => d.id !== id);
    localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
  } catch (error) {
    console.error('Error deleting draft:', error);
  }
}

export function getPosters(): GeneratedPoster[] {
  try {
    const stored = localStorage.getItem(POSTERS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading posters:', error);
  }
  return [];
}

export function savePoster(poster: GeneratedPoster): void {
  try {
    const posters = getPosters();
    posters.unshift(poster);

    if (posters.length > MAX_ITEMS) {
      posters.pop();
    }

    localStorage.setItem(POSTERS_KEY, JSON.stringify(posters));
  } catch (error) {
    console.error('Error saving poster:', error);
    alert('Failed to save poster. Storage might be full. Try deleting old items.');
  }
}

export function deletePoster(id: string): void {
  try {
    const posters = getPosters().filter(p => p.id !== id);
    localStorage.setItem(POSTERS_KEY, JSON.stringify(posters));
  } catch (error) {
    console.error('Error deleting poster:', error);
  }
}

export function checkStorageSpace(): { used: number; available: boolean } {
  try {
    const test = 'x'.repeat(1024 * 1024);
    localStorage.setItem('storage_test', test);
    localStorage.removeItem('storage_test');
    return { used: 0, available: true };
  } catch (error) {
    return { used: 100, available: false };
  }
}
