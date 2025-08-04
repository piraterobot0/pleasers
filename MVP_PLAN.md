# MVP Development Plan - NFL Spreads Picker

## Project Goal
Build an MVP where users can pick NFL games against modified spreads (home teams +6 points) for Preseason Week 1, with a scoring system that tracks performance.

## Development Phases

### Phase 1: Project Setup & Foundation (Day 1)
- [x] Initialize Git repository
- [x] Connect to GitHub
- [ ] Setup Next.js project with TypeScript
- [ ] Configure Tailwind CSS
- [ ] Setup ESLint and Prettier
- [ ] Configure Vercel deployment
- [ ] Setup environment variables structure

### Phase 2: Database & Authentication (Day 2)
- [ ] Setup PostgreSQL database (Vercel Postgres or Supabase)
- [ ] Configure Prisma ORM
- [ ] Create database schema
- [ ] Implement NextAuth.js
- [ ] Setup Google OAuth provider
- [ ] Create user registration/login flow
- [ ] Add session management

### Phase 3: Data Layer & Mock Data (Day 3)
- [ ] Create NFL game data structure
- [ ] Build mock data for Preseason Week 1
- [ ] Implement spread modification logic (+6 home)
- [ ] Create API routes for games
- [ ] Setup data fetching hooks
- [ ] Add game data validation

### Phase 4: Core Picking Interface (Day 4-5)
- [ ] Design game card component
- [ ] Create pick selection UI
- [ ] Implement pick state management
- [ ] Build pick submission flow
- [ ] Add pick confirmation modal
- [ ] Create "My Picks" view
- [ ] Add pick deadline logic

### Phase 5: Scoring System (Day 6)
- [ ] Implement scoring calculation
- [ ] Create game result input (admin)
- [ ] Build automatic score updates
- [ ] Add tie-handling (0.5 points)
- [ ] Create user score display
- [ ] Build score history

### Phase 6: Leaderboard & Social (Day 7)
- [ ] Create leaderboard component
- [ ] Implement ranking algorithm
- [ ] Add week-by-week filtering
- [ ] Build user profile pages
- [ ] Add basic stats (win %, total points)

### Phase 7: Polish & Testing (Day 8-9)
- [ ] Responsive design optimization
- [ ] Loading states and error handling
- [ ] Form validation improvements
- [ ] Performance optimization
- [ ] Basic E2E tests
- [ ] Bug fixes and refinements

### Phase 8: Deployment & Launch (Day 10)
- [ ] Production environment setup
- [ ] Database migration
- [ ] Environment variables configuration
- [ ] Domain setup (if applicable)
- [ ] Monitoring setup
- [ ] Launch MVP

## MVP Success Criteria
1. Users can register and login
2. Users can view all Preseason Week 1 games with modified spreads
3. Users can submit picks for all games
4. System calculates scores correctly (including ties)
5. Leaderboard shows user rankings
6. Mobile-responsive design
7. Deployed and accessible on Vercel

## Post-MVP Features (Future)
- Multiple weeks support
- Regular season games
- Custom spread modifications
- Pick confidence levels
- Group/League creation
- Pick history and analytics
- Email notifications
- Live game score updates
- Custom scoring systems
- Social sharing features

## Technical Decisions for MVP

### Simplified Choices
1. **Static game data** - Hardcode Preseason Week 1 initially
2. **Manual score updates** - Admin updates scores manually
3. **Single pick per game** - No confidence points yet
4. **Basic auth** - Google OAuth only for MVP
5. **Simple UI** - Focus on functionality over aesthetics

### Data Source Options
1. **Option A (Simplest)**: Hardcoded game data
2. **Option B**: ESPN API integration
3. **Option C**: The Odds API for spreads

## Risk Mitigation
- Start with mock data to avoid API dependencies
- Use Vercel's built-in services for quick setup
- Focus on core loop: pick → score → rank
- Deploy early and iterate
- Keep UI simple but functional

## Definition of Done for MVP
- [ ] All Phase 1-8 tasks complete
- [ ] Successfully deployed to production
- [ ] 5+ test users have successfully made picks
- [ ] Scoring system verified accurate
- [ ] No critical bugs
- [ ] Basic documentation complete