import { SportMarkets } from './types';

export const SPORT_MARKETS: SportMarkets[] = [
  {
    sport: 'cricket',
    markets: [
      { label: 'Match Winner', value: 'match_winner' },
      { label: 'Top Batter', value: 'top_batter', requiresPlayer: true },
      { label: 'Top Bowler', value: 'top_bowler', requiresPlayer: true },
      { label: 'Player to Watch', value: 'player_to_watch', requiresPlayer: true },
      { label: 'Total Runs Over/Under', value: 'total_runs', requiresValue: true, valueLabel: 'Line (e.g., 280.5)' },
      { label: 'Team Runs Over/Under', value: 'team_runs', requiresValue: true, valueLabel: 'Line (e.g., 165.5)' },
      { label: 'Highest Opening Partnership', value: 'opening_partnership' },
      { label: 'Most Sixes', value: 'most_sixes' },
    ],
  },
  {
    sport: 'tennis',
    markets: [
      { label: 'Match Winner', value: 'match_winner' },
      { label: 'Games Handicap', value: 'games_handicap', requiresValue: true, valueLabel: 'Handicap (e.g., -4.5)' },
      { label: 'Sets Handicap', value: 'sets_handicap', requiresValue: true, valueLabel: 'Handicap (e.g., -1.5)' },
      { label: 'Total Games Over/Under', value: 'total_games', requiresValue: true, valueLabel: 'Line (e.g., 21.5)' },
      { label: 'Set 1 Winner', value: 'set1_winner' },
    ],
  },
  {
    sport: 'basketball',
    markets: [
      { label: 'Moneyline (Winner)', value: 'moneyline' },
      { label: 'Point Spread', value: 'point_spread', requiresValue: true, valueLabel: 'Spread (e.g., -5.5)' },
      { label: 'Total Points Over/Under', value: 'total_points', requiresValue: true, valueLabel: 'Line (e.g., 215.5)' },
      { label: 'Player Points Over/Under', value: 'player_points', requiresPlayer: true, requiresValue: true, valueLabel: 'Line (e.g., 25.5)' },
      { label: 'Player Rebounds Over/Under', value: 'player_rebounds', requiresPlayer: true, requiresValue: true, valueLabel: 'Line (e.g., 10.5)' },
      { label: 'Player Assists Over/Under', value: 'player_assists', requiresPlayer: true, requiresValue: true, valueLabel: 'Line (e.g., 8.5)' },
    ],
  },
  {
    sport: 'soccer',
    markets: [
      { label: 'Match Winner (1X2)', value: 'match_winner' },
      { label: 'Double Chance', value: 'double_chance' },
      { label: 'Both Teams To Score', value: 'btts' },
      { label: 'Total Goals Over/Under', value: 'total_goals', requiresValue: true, valueLabel: 'Line (e.g., 2.5)' },
      { label: 'Draw No Bet', value: 'draw_no_bet' },
      { label: 'Anytime Goal Scorer', value: 'goal_scorer', requiresPlayer: true },
    ],
  },
];

export function getMarketsForSport(sport: string) {
  return SPORT_MARKETS.find(s => s.sport === sport)?.markets || [];
}
