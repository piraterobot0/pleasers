import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    const season = searchParams.get('season') || '2025';
    const weekType = searchParams.get('weekType') || 'preseason';
    const week = searchParams.get('week') || '1';

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    // Find user by username
    const user = await prisma.user.findUnique({
      where: { username: username.trim() },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get user's picks with game details
    const picks = await prisma.pick.findMany({
      where: {
        userId: user.id,
        game: {
          season: parseInt(season),
          weekType,
          week: parseInt(week),
        },
      },
      include: {
        game: true,
      },
      orderBy: {
        game: {
          gameTime: 'asc',
        },
      },
    });

    // Calculate score
    let totalPoints = 0;
    let correctPicks = 0;
    let incorrectPicks = 0;
    let ties = 0;
    let pendingGames = 0;

    picks.forEach(pick => {
      if (pick.game.isComplete && pick.points !== null) {
        totalPoints += pick.points;
        if (pick.points === 1) correctPicks++;
        else if (pick.points === 0.5) ties++;
        else incorrectPicks++;
      } else {
        pendingGames++;
      }
    });

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
      },
      picks: picks.map(pick => ({
        id: pick.id,
        gameId: pick.gameId,
        pickedTeam: pick.pickedTeam,
        isCorrect: pick.isCorrect,
        points: pick.points,
        game: {
          id: pick.game.id,
          homeTeam: pick.game.homeTeam,
          awayTeam: pick.game.awayTeam,
          originalSpread: pick.game.originalSpread,
          modifiedSpread: pick.game.modifiedSpread,
          homeScore: pick.game.homeScore,
          awayScore: pick.game.awayScore,
          gameTime: pick.game.gameTime,
          isComplete: pick.game.isComplete,
        },
      })),
      stats: {
        totalPoints,
        correctPicks,
        incorrectPicks,
        ties,
        pendingGames,
        totalPicks: picks.length,
        completedGames: picks.length - pendingGames,
      },
    });
  } catch (error) {
    console.error('Error fetching user picks:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to fetch user picks' },
      { status: 500 }
    );
  }
}