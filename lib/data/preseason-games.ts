export interface GameData {
  id: string;
  week: number;
  season: number;
  weekType: 'preseason' | 'regular' | 'playoffs';
  homeTeam: string;
  awayTeam: string;
  originalSpread: number; // Negative means home team favored
  modifiedSpread: number; // originalSpread + 6 for home team
  overUnder: number;
  gameTime: Date;
  homeScore?: number;
  awayScore?: number;
  isComplete: boolean;
}

// 2025 NFL Preseason Week 1 Games
// Note: Spreads are from home team perspective (negative = home favored)
export const preseasonWeek1Games: Omit<GameData, 'id' | 'modifiedSpread' | 'isComplete'>[] = [
  // Thursday, August 7, 2025
  {
    week: 1,
    season: 2025,
    weekType: 'preseason',
    homeTeam: 'Baltimore Ravens',
    awayTeam: 'Indianapolis Colts',
    originalSpread: 4, // Colts favored by 4 (Ravens +4)
    overUnder: 35.5,
    gameTime: new Date('2025-08-07T20:00:00-04:00'),
  },
  {
    week: 1,
    season: 2025,
    weekType: 'preseason',
    homeTeam: 'Philadelphia Eagles',
    awayTeam: 'Cincinnati Bengals',
    originalSpread: 3.5, // Bengals favored by 3.5 (Eagles +3.5)
    overUnder: 35.5,
    gameTime: new Date('2025-08-07T20:00:00-04:00'),
  },
  {
    week: 1,
    season: 2025,
    weekType: 'preseason',
    homeTeam: 'Seattle Seahawks',
    awayTeam: 'Las Vegas Raiders',
    originalSpread: 1.5, // Raiders favored by 1.5 (Seahawks +1.5)
    overUnder: 35.5,
    gameTime: new Date('2025-08-07T22:00:00-07:00'),
  },
  
  // Friday, August 8, 2025
  {
    week: 1,
    season: 2025,
    weekType: 'preseason',
    homeTeam: 'Atlanta Falcons',
    awayTeam: 'Detroit Lions',
    originalSpread: 3, // Lions favored by 3 (Falcons +3)
    overUnder: 32.5,
    gameTime: new Date('2025-08-08T19:30:00-04:00'),
  },
  {
    week: 1,
    season: 2025,
    weekType: 'preseason',
    homeTeam: 'Carolina Panthers',
    awayTeam: 'Cleveland Browns',
    originalSpread: -2.5, // Panthers favored by 2.5
    overUnder: 34.5,
    gameTime: new Date('2025-08-08T19:30:00-04:00'),
  },
  {
    week: 1,
    season: 2025,
    weekType: 'preseason',
    homeTeam: 'New England Patriots',
    awayTeam: 'Washington Commanders',
    originalSpread: -2.5, // Patriots favored by 2.5
    overUnder: 33.5,
    gameTime: new Date('2025-08-08T19:30:00-04:00'),
  },
  
  // Saturday, August 9, 2025
  {
    week: 1,
    season: 2025,
    weekType: 'preseason',
    homeTeam: 'Buffalo Bills',
    awayTeam: 'New York Giants',
    originalSpread: -2.5, // Bills favored by 2.5
    overUnder: 36.5,
    gameTime: new Date('2025-08-09T13:00:00-04:00'),
  },
  {
    week: 1,
    season: 2025,
    weekType: 'preseason',
    homeTeam: 'Minnesota Vikings',
    awayTeam: 'Houston Texans',
    originalSpread: -2.5, // Vikings favored by 2.5
    overUnder: 35.5,
    gameTime: new Date('2025-08-09T13:00:00-05:00'),
  },
  {
    week: 1,
    season: 2025,
    weekType: 'preseason',
    homeTeam: 'Jacksonville Jaguars',
    awayTeam: 'Pittsburgh Steelers',
    originalSpread: -1.5, // Jaguars favored by 1.5
    overUnder: 35.5,
    gameTime: new Date('2025-08-09T19:30:00-04:00'),
  },
  {
    week: 1,
    season: 2025,
    weekType: 'preseason',
    homeTeam: 'Los Angeles Rams',
    awayTeam: 'Dallas Cowboys',
    originalSpread: 3, // Cowboys favored by 3 (Rams +3)
    overUnder: 33.5,
    gameTime: new Date('2025-08-09T16:00:00-07:00'),
  },
  {
    week: 1,
    season: 2025,
    weekType: 'preseason',
    homeTeam: 'Tampa Bay Buccaneers',
    awayTeam: 'Tennessee Titans',
    originalSpread: 1.5, // Titans favored by 1.5 (Bucs +1.5)
    overUnder: 34.5,
    gameTime: new Date('2025-08-09T19:30:00-04:00'),
  },
  {
    week: 1,
    season: 2025,
    weekType: 'preseason',
    homeTeam: 'Arizona Cardinals',
    awayTeam: 'Kansas City Chiefs',
    originalSpread: 1.5, // Chiefs favored by 1.5 (Cardinals +1.5)
    overUnder: 35.5,
    gameTime: new Date('2025-08-09T17:00:00-07:00'),
  },
  {
    week: 1,
    season: 2025,
    weekType: 'preseason',
    homeTeam: 'Green Bay Packers',
    awayTeam: 'New York Jets',
    originalSpread: -1.5, // Packers favored by 1.5
    overUnder: 34.5,
    gameTime: new Date('2025-08-09T20:00:00-05:00'),
  },
  {
    week: 1,
    season: 2025,
    weekType: 'preseason',
    homeTeam: 'San Francisco 49ers',
    awayTeam: 'Denver Broncos',
    originalSpread: 3, // Broncos favored by 3 (49ers +3)
    overUnder: 34.5,
    gameTime: new Date('2025-08-09T20:00:00-07:00'),
  },
  
  // Sunday, August 10, 2025
  {
    week: 1,
    season: 2025,
    weekType: 'preseason',
    homeTeam: 'Chicago Bears',
    awayTeam: 'Miami Dolphins',
    originalSpread: -2.5, // Bears favored by 2.5
    overUnder: 36.5,
    gameTime: new Date('2025-08-10T13:00:00-05:00'),
  },
  {
    week: 1,
    season: 2025,
    weekType: 'preseason',
    homeTeam: 'Los Angeles Chargers',
    awayTeam: 'New Orleans Saints',
    originalSpread: 2.5, // Saints favored by 2.5 (Chargers +2.5)
    overUnder: 35.5,
    gameTime: new Date('2025-08-10T16:00:00-07:00'),
  },
];

// Helper function to calculate modified spread
export function calculateModifiedSpread(originalSpread: number): number {
  // Add 6 points to home team (make spread more favorable for home)
  // If home is favored (negative spread), make them more favored
  // If home is underdog (positive spread), reduce the underdog points
  return originalSpread - 6;
}

// Helper function to get all games with calculated modified spreads
export function getGamesWithModifiedSpreads() {
  return preseasonWeek1Games.map((game, index) => ({
    ...game,
    id: `game-${index + 1}`,
    modifiedSpread: calculateModifiedSpread(game.originalSpread),
    isComplete: false,
  }));
}