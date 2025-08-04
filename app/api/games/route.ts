import { NextResponse } from 'next/server';
import { getAllGames, getGamesByWeek } from '@/lib/db/games';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const season = searchParams.get('season');
    const weekType = searchParams.get('weekType');
    const week = searchParams.get('week');

    let games;
    if (season && weekType && week) {
      games = await getGamesByWeek(
        parseInt(season),
        weekType,
        parseInt(week)
      );
    } else {
      games = await getAllGames();
    }

    return NextResponse.json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json(
      { error: 'Failed to fetch games' },
      { status: 500 }
    );
  }
}