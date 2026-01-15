import { Sport } from './types';

export interface SportTheme {
  id: string;
  name: string;
  sport: Sport;
  background: string;
  pattern: string;
  textColor: string;
  accentColor: string;
}

export const SPORT_THEMES: SportTheme[] = [
  {
    id: 'cricket-1',
    name: 'Classic Pitch',
    sport: 'cricket',
    background: 'linear-gradient(135deg, #1a5f3a 0%, #2d8659 50%, #1a5f3a 100%)',
    pattern: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 50%)',
    textColor: '#ffffff',
    accentColor: '#4ade80',
  },
  {
    id: 'cricket-2',
    name: 'Night Match',
    sport: 'cricket',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
    pattern: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,0.03) 35px, rgba(255,255,255,0.03) 70px)',
    textColor: '#ffffff',
    accentColor: '#60a5fa',
  },
  {
    id: 'cricket-3',
    name: 'Stadium Lights',
    sport: 'cricket',
    background: 'linear-gradient(135deg, #14532d 0%, #16a34a 50%, #14532d 100%)',
    pattern: 'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.08) 0%, transparent 50%)',
    textColor: '#ffffff',
    accentColor: '#86efac',
  },
  {
    id: 'tennis-1',
    name: 'Hard Court',
    sport: 'tennis',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #1e3a8a 100%)',
    pattern: 'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.05) 40px, rgba(255,255,255,0.05) 42px)',
    textColor: '#ffffff',
    accentColor: '#93c5fd',
  },
  {
    id: 'tennis-2',
    name: 'Clay Court',
    sport: 'tennis',
    background: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 50%, #7c2d12 100%)',
    pattern: 'radial-gradient(circle at 30% 40%, rgba(255,255,255,0.06) 0%, transparent 50%)',
    textColor: '#ffffff',
    accentColor: '#fdba74',
  },
  {
    id: 'tennis-3',
    name: 'Grass Court',
    sport: 'tennis',
    background: 'linear-gradient(135deg, #15803d 0%, #22c55e 50%, #15803d 100%)',
    pattern: 'repeating-linear-gradient(90deg, transparent, transparent 30px, rgba(255,255,255,0.04) 30px, rgba(255,255,255,0.04) 60px)',
    textColor: '#ffffff',
    accentColor: '#86efac',
  },
  {
    id: 'basketball-1',
    name: 'Classic Hardwood',
    sport: 'basketball',
    background: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 50%, #7c2d12 100%)',
    pattern: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,0.04) 35px, rgba(255,255,255,0.04) 70px)',
    textColor: '#ffffff',
    accentColor: '#fb923c',
  },
  {
    id: 'basketball-2',
    name: 'Night Game',
    sport: 'basketball',
    background: 'linear-gradient(135deg, #0f172a 0%, #dc2626 50%, #0f172a 100%)',
    pattern: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.06) 0%, transparent 50%)',
    textColor: '#ffffff',
    accentColor: '#fca5a5',
  },
  {
    id: 'basketball-3',
    name: 'Arena',
    sport: 'basketball',
    background: 'linear-gradient(135deg, #1e293b 0%, #f97316 50%, #1e293b 100%)',
    pattern: 'repeating-linear-gradient(0deg, transparent, transparent 45px, rgba(255,255,255,0.05) 45px, rgba(255,255,255,0.05) 47px)',
    textColor: '#ffffff',
    accentColor: '#fdba74',
  },
  {
    id: 'soccer-1',
    name: 'Pitch Classic',
    sport: 'soccer',
    background: 'linear-gradient(135deg, #14532d 0%, #16a34a 50%, #14532d 100%)',
    pattern: 'repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(255,255,255,0.04) 50px, rgba(255,255,255,0.04) 100px)',
    textColor: '#ffffff',
    accentColor: '#4ade80',
  },
  {
    id: 'soccer-2',
    name: 'Night Match',
    sport: 'soccer',
    background: 'linear-gradient(135deg, #0c4a6e 0%, #0ea5e9 50%, #0c4a6e 100%)',
    pattern: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.06) 0%, transparent 60%)',
    textColor: '#ffffff',
    accentColor: '#7dd3fc',
  },
  {
    id: 'soccer-3',
    name: 'Stadium',
    sport: 'soccer',
    background: 'linear-gradient(135deg, #064e3b 0%, #10b981 50%, #064e3b 100%)',
    pattern: 'repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.05) 40px, rgba(255,255,255,0.05) 80px)',
    textColor: '#ffffff',
    accentColor: '#6ee7b7',
  },
];

export function getThemesForSport(sport: Sport): SportTheme[] {
  return SPORT_THEMES.filter(t => t.sport === sport);
}

export function getThemeById(id: string): SportTheme | undefined {
  return SPORT_THEMES.find(t => t.id === id);
}

export function getRandomTheme(sport: Sport): SportTheme {
  const themes = getThemesForSport(sport);
  return themes[Math.floor(Math.random() * themes.length)];
}
