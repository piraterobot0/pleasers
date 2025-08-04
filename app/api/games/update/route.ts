import { NextResponse } from 'next/server';
import { updateGameScore } from '@/lib/db/games';

export async function POST(request: Request) {
  try {
    // Simple admin check - in production, use proper authentication
    const { searchParams } = new URL(request.url);
    const adminKey = searchParams.get('key');
    
    if (adminKey !== process.env.ADMIN_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { gameId, homeScore, awayScore } = body;

    if (!gameId || homeScore === undefined || awayScore === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const game = await updateGameScore(gameId, homeScore, awayScore);

    return NextResponse.json({
      message: 'Game score updated successfully',
      game,
    });
  } catch (error: any) {
    console.error('Error updating game score:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update game score' },
      { status: 500 }
    );
  }
}