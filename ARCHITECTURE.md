# NFL Spreads Picker - System Architecture

## Overview
A web application where users pick NFL game spreads with modified point adjustments. The MVP adds 6 points to home teams and matches the spread with away teams.

## Core Features (MVP)
- Display NFL Preseason Week 1 games with modified spreads
- User authentication and session management
- Pick submission for all games
- Scoring system (win = 1, loss = 0, tie = 0.5)
- Real-time score calculation and display
- Leaderboard

## Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **React 18**
- **Tailwind CSS** for styling
- **TypeScript** for type safety
- **Zustand** for state management

### Backend
- **Next.js API Routes** (serverless functions)
- **PostgreSQL** (via Vercel Postgres or Supabase)
- **Prisma ORM** for database management
- **NextAuth.js** for authentication

### Infrastructure
- **Vercel** for hosting and deployment
- **GitHub** for version control
- **External NFL Data API** (ESPN API or similar for game data)

## Data Models

### User
```typescript
{
  id: string
  email: string
  username: string
  createdAt: Date
  picks: Pick[]
  score: number
}
```

### Game
```typescript
{
  id: string
  week: number
  season: number
  homeTeam: string
  awayTeam: string
  originalSpread: number
  modifiedSpread: number // originalSpread + 6 for home
  homeScore?: number
  awayScore?: number
  gameTime: Date
  isComplete: boolean
}
```

### Pick
```typescript
{
  id: string
  userId: string
  gameId: string
  pickedTeam: 'home' | 'away'
  isCorrect?: boolean
  points?: number // 0, 0.5, or 1
  createdAt: Date
}
```

## API Structure

### Public Endpoints
- `GET /api/games` - Get all games for a week
- `GET /api/leaderboard` - Get user rankings

### Protected Endpoints
- `POST /api/picks` - Submit picks for games
- `GET /api/picks/user/:userId` - Get user's picks
- `GET /api/user/score` - Get current user score

### Admin Endpoints
- `POST /api/games/update` - Update game results
- `POST /api/games/import` - Import games from external source

## Application Flow

1. **User Registration/Login**
   - OAuth via Google/GitHub or email/password
   - Store user session

2. **Game Display**
   - Fetch current week's games
   - Apply spread modifications (home +6)
   - Show pick interface

3. **Pick Submission**
   - Validate all games picked
   - Store picks in database
   - Lock picks at game time

4. **Scoring**
   - After games complete, calculate results
   - Award points based on modified spreads
   - Update leaderboard

## Security Considerations
- Authentication required for picks
- Rate limiting on API endpoints
- Input validation and sanitization
- HTTPS only
- Environment variables for sensitive data

## Scalability Considerations
- Database indexing on frequently queried fields
- Caching strategy for game data
- CDN for static assets
- Optimistic UI updates
- Pagination for leaderboards