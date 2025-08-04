# NFL Spreads Picker

A web application for picking NFL games with modified spreads where home teams get a +6 point advantage.

## Features

- 🏈 Pick NFL games against modified spreads
- 🏠 Home teams get +6 points added to their spread
- 📊 Real-time leaderboard
- 💾 Local storage for picks until submission
- 🎯 No sign-up required - just enter a username
- 📱 Mobile-responsive design

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Database**: PostgreSQL (via Vercel Postgres)
- **ORM**: Prisma
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Vercel account (for deployment)
- PostgreSQL database (Vercel Postgres recommended)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/piraterobot0/pleasers.git
cd pleasers
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your `.env.local`:
```env
# Get these from Vercel Postgres dashboard
POSTGRES_PRISMA_URL="your-connection-string"
POSTGRES_URL_NON_POOLING="your-direct-connection-string"

# Generate a secure admin key
ADMIN_KEY="your-secure-admin-key"
```

5. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000)

## Deployment to Vercel

1. Push your code to GitHub

2. Import project to Vercel from GitHub

3. Add environment variables in Vercel dashboard:
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING` 
   - `ADMIN_KEY`

4. Vercel will automatically deploy on push to main branch

## Database Setup

### Using Vercel Postgres

1. Go to your Vercel dashboard
2. Select your project
3. Go to "Storage" tab
4. Create a new Postgres database
5. Copy the environment variables to your project

### Initialize Database

After deployment, seed the games:

1. Go to `/admin` on your deployed site
2. Enter your admin key
3. Click "Seed Games" to populate the database

## Admin Panel

Access the admin panel at `/admin` to:
- Seed initial game data
- Update game scores
- Mark games as complete
- Trigger scoring calculations

## How It Works

1. **Modified Spreads**: Original spreads are adjusted by adding 6 points to favor home teams
2. **Scoring**: 
   - Correct pick = 1 point
   - Push (tie) = 0.5 points
   - Incorrect pick = 0 points
3. **Picks Storage**: Picks are saved locally until submitted with a username
4. **Leaderboard**: Updates automatically as games are marked complete

## Project Structure

```
/app              # Next.js app directory
  /api            # API routes
  /admin          # Admin panel
  /picks          # Pick selection page
  /leaderboard    # Leaderboard page
/components       # React components
/lib              # Utility functions and database
  /data           # Game data
  /db             # Database utilities
/prisma           # Database schema
/public           # Static assets
```

## Development

```bash
# Run development server
npm run dev

# Run linting
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT