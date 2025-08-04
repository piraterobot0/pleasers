import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { submitPicks, getUserPicks } from '@/lib/db/picks';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const season = searchParams.get('season');
    const weekType = searchParams.get('weekType');
    const week = searchParams.get('week');

    const picks = await getUserPicks(
      session.user.id,
      season ? parseInt(season) : undefined,
      weekType || undefined,
      week ? parseInt(week) : undefined
    );

    return NextResponse.json(picks);
  } catch (error) {
    console.error('Error fetching picks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch picks' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { picks } = body;

    if (!picks || !Array.isArray(picks) || picks.length === 0) {
      return NextResponse.json(
        { error: 'Invalid picks data' },
        { status: 400 }
      );
    }

    const result = await submitPicks(session.user.id, picks);

    return NextResponse.json({
      message: 'Picks submitted successfully',
      count: result.count,
    });
  } catch (error: any) {
    console.error('Error submitting picks:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit picks' },
      { status: 500 }
    );
  }
}