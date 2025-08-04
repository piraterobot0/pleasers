import { prisma } from '@/lib/prisma';

export interface PickSubmission {
  gameId: string;
  pickedTeam: 'home' | 'away';
}

export async function submitPicks(userId: string, picks: PickSubmission[]) {
  // Validate that games haven't started
  const gameIds = picks.map(p => p.gameId);
  const games = await prisma.game.findMany({
    where: {
      id: { in: gameIds },
    },
  });
  
  const now = new Date();
  const invalidGames = games.filter(game => game.gameTime <= now);
  
  if (invalidGames.length > 0) {
    throw new Error(`Cannot submit picks for games that have already started: ${invalidGames.map(g => `${g.awayTeam} @ ${g.homeTeam}`).join(', ')}`);
  }
  
  // Delete existing picks for these games
  await prisma.pick.deleteMany({
    where: {
      userId,
      gameId: { in: gameIds },
    },
  });
  
  // Create new picks
  const createdPicks = await prisma.pick.createMany({
    data: picks.map(pick => ({
      userId,
      gameId: pick.gameId,
      pickedTeam: pick.pickedTeam,
    })),
  });
  
  return createdPicks;
}

export async function getUserPicks(userId: string, season?: number, weekType?: string, week?: number) {
  const where: Record<string, unknown> = { userId };
  
  if (season && weekType && week) {
    where.game = {
      season,
      weekType,
      week,
    };
  }
  
  return prisma.pick.findMany({
    where,
    include: {
      game: true,
    },
    orderBy: {
      game: {
        gameTime: 'asc',
      },
    },
  });
}

export async function getPicksByGame(gameId: string) {
  return prisma.pick.findMany({
    where: { gameId },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          name: true,
        },
      },
    },
  });
}

export async function getUserScore(userId: string, season?: number, weekType?: string, week?: number) {
  const where: Record<string, unknown> = {
    userId,
    points: { not: null },
  };
  
  if (season && weekType && week) {
    where.game = {
      season,
      weekType,
      week,
    };
  }
  
  const picks = await prisma.pick.findMany({
    where,
  });
  
  const totalPoints = picks.reduce((sum, pick) => sum + (pick.points || 0), 0);
  const totalPicks = picks.length;
  const correctPicks = picks.filter(p => p.points === 1).length;
  const ties = picks.filter(p => p.points === 0.5).length;
  
  return {
    totalPoints,
    totalPicks,
    correctPicks,
    ties,
    winPercentage: totalPicks > 0 ? (correctPicks / totalPicks) * 100 : 0,
  };
}

export async function getLeaderboard(season: number, weekType: string, week: number) {
  // First try to get from leaderboard table (for completed/scored picks)
  const leaderboardEntries = await prisma.leaderboard.findMany({
    where: {
      season,
      weekType,
      week,
    },
    orderBy: {
      totalPoints: 'desc',
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          name: true,
          image: true,
        },
      },
    },
  });

  // If we have scored entries, return them
  if (leaderboardEntries.length > 0) {
    return leaderboardEntries;
  }

  // Otherwise, get all users who have submitted picks for this week
  const usersWithPicks = await prisma.user.findMany({
    where: {
      picks: {
        some: {
          game: {
            season,
            weekType,
            week,
          },
        },
      },
    },
    include: {
      picks: {
        where: {
          game: {
            season,
            weekType,
            week,
          },
        },
        include: {
          game: true,
        },
      },
    },
  });

  // Transform to leaderboard format
  return usersWithPicks.map((user, index) => {
    const completedPicks = user.picks.filter(pick => pick.game.isComplete);
    const totalPoints = completedPicks.reduce((sum, pick) => sum + (pick.points || 0), 0);
    const correctPicks = completedPicks.filter(p => p.points === 1).length;
    const ties = completedPicks.filter(p => p.points === 0.5).length;
    const winPercentage = completedPicks.length > 0 ? (correctPicks / completedPicks.length) * 100 : 0;

    return {
      id: `temp-${user.id}`,
      userId: user.id,
      season,
      weekType,
      week,
      totalPicks: user.picks.length,
      correctPicks,
      ties,
      totalPoints,
      winPercentage,
      rank: completedPicks.length > 0 ? null : null, // Will be calculated client-side
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        image: user.image,
      },
    };
  }).sort((a, b) => {
    // Sort by total points desc, then by total picks desc
    if (b.totalPoints !== a.totalPoints) {
      return b.totalPoints - a.totalPoints;
    }
    return b.totalPicks - a.totalPicks;
  });
}