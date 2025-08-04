# TODO - Action Plan

## 🚨 Critical (Blocking Deployment)
- [ ] Fix ESLint errors preventing build
  - [ ] Replace all `any` types with proper types
  - [ ] Escape quotes in JSX (use `&quot;`)
  - [ ] Remove unused imports and variables
  - [ ] OR create balanced ESLint config
- [ ] Add ADMIN_KEY to Vercel environment variables
- [ ] Remove duplicate lockfile warning

## 🎯 High Priority (Core Functionality)
- [ ] Test full user flow after deployment
  - [ ] Pick submission
  - [ ] Dashboard viewing
  - [ ] Score calculation after admin update
- [ ] Seed games in production database
- [ ] Verify Supabase connection in production

## 📈 Medium Priority (Improvements)
- [ ] Add loading states for better UX
- [ ] Add error boundaries for graceful failures
- [ ] Implement rate limiting on pick submissions
- [ ] Add data validation for game score updates
- [ ] Create backup/export functionality for picks

## 🎨 Low Priority (Nice to Have)
- [ ] Add team logos/colors
- [ ] Implement email notifications
- [ ] Add previous weeks history
- [ ] Create pick confirmation email
- [ ] Add social sharing for scores
- [ ] Implement leagues/groups
- [ ] Add confidence points system

## 🏗️ Technical Debt
- [ ] Remove NextAuth code (no longer used)
- [ ] Clean up unused dependencies
- [ ] Add proper TypeScript types everywhere
- [ ] Create API response type definitions
- [ ] Add unit tests for scoring logic
- [ ] Document API with Swagger/OpenAPI

## 🐛 Bug Fixes
- [ ] Handle timezone display consistency
- [ ] Fix potential race conditions in pick submission
- [ ] Validate game times against current time properly

## 📝 Documentation
- [ ] Create API documentation
- [ ] Add JSDoc comments to utility functions
- [ ] Create deployment guide
- [ ] Document scoring algorithm clearly
- [ ] Add troubleshooting guide

## 🔒 Security
- [ ] Implement CSRF protection
- [ ] Add rate limiting to all endpoints
- [ ] Sanitize username inputs
- [ ] Add request validation middleware
- [ ] Implement proper CORS settings

## Current Sprint Focus
1. Fix ESLint errors
2. Deploy successfully
3. Test core flow
4. Seed production data