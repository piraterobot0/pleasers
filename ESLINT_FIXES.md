# ESLint Fixes Required

## Summary
~20 errors blocking build, mostly TypeScript type issues and React escape sequences.

## Error Categories

### 1. TypeScript `any` Types (Critical)
**Files affected**: All API routes and error handlers
**Fix**: Replace `any` with proper types or `unknown`

```typescript
// Before
} catch (err: any) {

// After
} catch (err) {
  const error = err as Error;
```

### 2. Unescaped Quotes in JSX
**File**: `/app/admin/page.tsx`
**Lines**: 293, 295
**Fix**: Replace `"` with `&quot;`

```jsx
// Before
<li>• Click "Seed Games" to initialize</li>

// After  
<li>• Click &quot;Seed Games&quot; to initialize</li>
```

### 3. Unused Variables/Imports
**Files**: Multiple
**Fix**: Remove or prefix with underscore

```typescript
// Before
import { getServerSession } from 'next-auth';

// After
// Remove if not used
```

## Quick Fix Options

### Option A: Fix All Properly (Recommended)
1. Replace all `any` with `unknown` or proper types
2. Escape all quotes in JSX
3. Remove unused imports
4. ~30 minutes work

### Option B: Minimal Fixes
1. Change `any` to `unknown` (quick fix)
2. Use template literals for strings with quotes
3. Comment out unused imports
4. ~10 minutes work

### Option C: Configure ESLint
```json
{
  "extends": "next/core-web-vitals",
  "rules": {
    "@typescript-eslint/no-explicit-any": "warn",
    "react/no-unescaped-entities": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }]
  }
}
```

## Specific Fixes Needed

1. **app/admin/page.tsx**
   - Remove unused `router` import (line 3)
   - Fix quote escaping (lines 293, 295)
   - Type error handlers properly

2. **app/api/*** routes**
   - Replace all `: any` with proper types
   - Use `unknown` for error catches

3. **lib/db/games.ts**
   - Remove unused imports (Game, Pick, Prisma)

4. **app/dashboard/page.tsx**
   - Remove unused GameCard import

## Build Command
```bash
npm run build
```

## Verification
After fixes, ensure:
1. Build completes successfully
2. Type checking passes
3. No runtime errors