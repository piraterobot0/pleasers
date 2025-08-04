import { NextResponse } from 'next/server';
import { getLeaderboard } from '@/lib/db/picks';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const season = searchParams.get('season') || '2025';
    const weekType = searchParams.get('weekType') || 'preseason';
    const week = searchParams.get('week') || '1';

    const leaderboard = await getLeaderboard(
      parseInt(season),
      weekType,
      parseInt(week)
    );

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}