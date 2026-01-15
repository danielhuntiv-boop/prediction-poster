import { PosterDraft } from './types';

export function generateCaption(draft: PosterDraft): string {
  const sportEmoji = {
    cricket: '🏏',
    tennis: '🎾',
    basketball: '🏀',
    soccer: '⚽',
  };

  const parts: string[] = [];

  const sportName = draft.sport.toUpperCase();
  parts.push(`${sportEmoji[draft.sport]} ${sportName} PICK`);

  if (draft.eventTitle) {
    parts.push(`${draft.eventTitle}`);
  }

  if (draft.pickText) {
    parts.push(`📊 ${draft.pickText}`);
  }

  parts.push(`⭐ Confidence ${draft.confidence}/5`);

  if (draft.league) {
    parts.push(`🏆 ${draft.league}`);
  }

  if (draft.notes) {
    parts.push(`💭 ${draft.notes}`);
  }

  return parts.join(' | ');
}
