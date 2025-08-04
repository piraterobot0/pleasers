import { prisma } from '@/lib/prisma';
import { Game, Pick, Prisma } from '@prisma/client';
import { getGamesWithModifiedSpreads } from '@/lib/data/preseason-games';

export async function seedGames() {
  const games = getGamesWithModifiedSpreads();
  
  const createdGames = await Promise.all(
    games.map(game => 
      prisma.game.upsert({
        where: {
          id: game.id,
        },
        update: {},
        create: {
          id: game.id,
          week: game.week,
          season: game.season,
          weekType: game.weekType,
          homeTeam: game.homeTeam,
          awayTeam: game.awayTeam,
          originalSpread: game.originalSpread,
          modifiedSpread: game.modifiedSpread,
          gameTime: game.gameTime,
          isComplete: false,
        },
      })
    )
  );
  
  return createdGames;
}

export async function getGamesByWeek(
  season: number,
  weekType: string,
  week: number
) {
  return prisma.game.findMany({
    where: {
      season,
      weekType,
      week,
    },
    orderBy: {
      gameTime: 'asc',
    },
  });
}

export async function getAllGames() {
  return prisma.game.findMany({
    orderBy: {
      gameTime: 'asc',
    },
  });
}

export async function updateGameScore(
  gameId: string,
  homeScore: number,
  awayScore: number
) {
  const game = await prisma.game.update({
    where: { id: gameId },
    data: {
      homeScore,
      awayScore,
      isComplete: true,
    },
  });
  
  // Calculate pick results for this game
  await calculatePickResults(gameId);
  
  return game;
}

async function calculatePickResults(gameId: string) {
  const game = await prisma.game.findUnique({
    where: { id: gameId },
  });
  
  if (!game || !game.isComplete || game.homeScore === null || game.awayScore === null) {
    return;
  }
  
  const picks = await prisma.pick.findMany({
    where: { gameId },
  });
  
  const spreadResult = game.homeScore - game.awayScore + game.modifiedSpread;
  
  for (const pick of picks) {
    let isCorrect: boolean;
    let points: number;
    
    if (spreadResult === 0) {
      // It's a tie (push)
      isCorrect = false;
      points = 0.5;
    } else if (pick.pickedTeam === 'home') {
      // Picked home team
      isCorrect = spreadResult > 0;
      points = isCorrect ? 1 : 0;
    } else {
      // Picked away team
      isCorrect = spreadResult < 0;
      points = isCorrect ? 1 : 0;
    }
    
    await prisma.pick.update({
      where: { id: pick.id },
      data: {
        isCorrect,
        points,
      },
    });
  }
  
  // Update leaderboard
  await updateLeaderboard(game.season, game.weekType, game.week);
}

async function updateLeaderboard(season: number, weekType: string, week: number) {
  const picks = await prisma.pick.findMany({
    where: {
      game: {
        season,
        weekType,
        week,
        isComplete: true,
      },
    },
    include: {
      user: true,
    },
  });
  
  const userStats = new Map<string, {
    totalPicks: number;
    correctPicks: number;
    ties: number;
    totalPoints: number;
  }>();
  
  for (const pick of picks) {
    const stats = userStats.get(pick.userId) || {
      totalPicks: 0,
      correctPicks: 0,
      ties: 0,
      totalPoints: 0,
    };
    
    stats.totalPicks++;
    if (pick.points === 1) {
      stats.correctPicks++;
    } else if (pick.points === 0.5) {
      stats.ties++;
    }
    stats.totalPoints += pick.points || 0;
    
    userStats.set(pick.userId, stats);
  }
  
  // Update or create leaderboard entries
  for (const [userId, stats] of userStats.entries()) {
    await prisma.leaderboard.upsert({
      where: {
        userId_season_weekType_week: {
          userId,
          season,
          weekType,
          week,
        },
      },
      update: {
        ...stats,
        winPercentage: (stats.correctPicks / stats.totalPicks) * 100,
      },
      create: {
        userId,
        season,
        weekType,
        week,
        ...stats,
        winPercentage: (stats.correctPicks / stats.totalPicks) * 100,
      },
    });
  }
  
  // Update ranks
  const leaderboardEntries = await prisma.leaderboard.findMany({
    where: {
      season,
      weekType,
      week,
    },
    orderBy: {
      totalPoints: 'desc',
    },
  });
  
  for (let i = 0; i < leaderboardEntries.length; i++) {
    await prisma.leaderboard.update({
      where: { id: leaderboardEntries[i].id },
      data: { rank: i + 1 },
    });
  }
}