import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Pick {
  gameId: string;
  pickedTeam: 'home' | 'away';
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { picks, username } = body;

    if (!username || !username.trim()) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    if (!picks || !Array.isArray(picks) || picks.length === 0) {
      return NextResponse.json(
        { error: 'Invalid picks data' },
        { status: 400 }
      );
    }

    // Find or create user based on username
    let user = await prisma.user.findUnique({
      where: { username: username.trim() },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          username: username.trim(),
          email: `${username.trim().toLowerCase().replace(/\s+/g, '')}@picks.local`,
          name: username.trim(),
        },
      });
    }

    // Validate that games haven't started
    const gameIds = picks.map((p: Pick) => p.gameId);
    const games = await prisma.game.findMany({
      where: {
        id: { in: gameIds },
      },
    });

    const now = new Date();
    const invalidGames = games.filter(game => game.gameTime <= now);

    if (invalidGames.length > 0) {
      return NextResponse.json(
        { 
          error: `Cannot submit picks for games that have already started: ${
            invalidGames.map(g => `${g.awayTeam} @ ${g.homeTeam}`).join(', ')
          }` 
        },
        { status: 400 }
      );
    }

    // Delete existing picks for these games
    await prisma.pick.deleteMany({
      where: {
        userId: user.id,
        gameId: { in: gameIds },
      },
    });

    // Create new picks
    const createdPicks = await prisma.pick.createMany({
      data: picks.map((pick: Pick) => ({
        userId: user.id,
        gameId: pick.gameId,
        pickedTeam: pick.pickedTeam,
      })),
    });

    return NextResponse.json({
      message: 'Picks submitted successfully',
      count: createdPicks.count,
      username: user.username,
    });
  } catch (error) {
    console.error('Error submitting picks:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to submit picks' },
      { status: 500 }
    );
  }
}