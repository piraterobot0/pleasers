# Claude.md - Project Context and Instructions

## Project Overview
NFL Spreads Picker - A web app where users pick NFL games with modified spreads (+6 for home teams).

## Tech Stack
- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Database**: Supabase (PostgreSQL) via Vercel integration
- **ORM**: Prisma
- **Deployment**: Vercel
- **State**: localStorage for picks, Zustand ready but unused

## Key Features
1. **No Authentication Required** - Users enter username when submitting
2. **Modified Spreads** - Home teams get +6 points added to spread
3. **Scoring System** - Win=1, Loss=0, Push=0.5
4. **Dashboard** - Users can view their picks and scores
5. **Admin Panel** - Update game scores at `/admin` with ADMIN_KEY

## Database Schema
- `User` - Stores username, email (auto-generated)
- `Game` - NFL games with original/modified spreads
- `Pick` - User selections with scoring
- `Leaderboard` - Calculated rankings

## Current State
- Database connected to Supabase
- Build failing due to ESLint errors
- MVP functionally complete
- Needs deployment fixes

## Environment Variables
```
POSTGRES_PRISMA_URL - Supabase pooled connection
POSTGRES_URL_NON_POOLING - Direct connection
ADMIN_KEY - For admin panel access
```

## API Endpoints
- `GET /api/games` - Fetch games
- `POST /api/games/seed` - Initialize games
- `POST /api/games/update?key=ADMIN_KEY` - Update scores
- `POST /api/picks/submit` - Submit user picks
- `GET /api/user/picks?username=X` - Get user dashboard data
- `GET /api/leaderboard` - Get rankings

## User Flow
1. Visit site → Make picks → Enter username → Submit
2. Auto-redirect to dashboard
3. Admin updates scores → Automatic calculation
4. Leaderboard shows rankings

## Known Issues
1. ESLint errors blocking deployment (~20 errors)
2. Multiple lockfile warnings
3. TypeScript `any` types need fixing

## Quick Commands
```bash
# Development
npm run dev

# Build (currently failing)
npm run build

# Database
npx prisma db push
npx prisma generate

# Admin panel password (local)
test-admin-key-change-in-production
```

## Next Actions
See TODO.md for prioritized tasks