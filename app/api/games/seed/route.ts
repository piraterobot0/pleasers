import { NextResponse } from 'next/server';
import { seedGames } from '@/lib/db/games';

export async function POST() {
  try {
    // For MVP, we'll allow seeding without auth check
    // In production, you'd want to restrict this to admins
    
    const games = await seedGames();
    
    return NextResponse.json({
      message: 'Games seeded successfully',
      count: games.length,
      games,
    });
  } catch (error) {
    console.error('Error seeding games:', error);
    return NextResponse.json(
      { error: 'Failed to seed games' },
      { status: 500 }
    );
  }
}