# ChoreBoard

Household chore management SPA for assigning, scheduling, and tracking tasks among family/roommate groups. Features a calendar view with per-occurrence completion tracking.

## Tech Stack

| Layer | Technology |
|---|---|
| UI | React 19, TypeScript 5 |
| Build | Vite 7 (`vite.config.ts`) |
| Styling | Tailwind CSS 3 (`tailwind.config.js`) |
| Calendar | react-big-calendar, date-fns |
| Accessibility | Headless UI (Dialog) |
| Storage | Browser `localStorage` |
| Linting | ESLint 9 flat config (`eslint.config.js`) |

## Key Directories

```
src/
  App.tsx              # Page router; owns no state, passes callbacks down
  types.ts             # All domain types (Member, Chore, Recurrence, AppState)
  hooks/
    useAppState.ts     # Single source of truth; auto-persists to localStorage
  lib/
    storage.ts         # localStorage read/write with safe defaults
    recurrence.ts      # Generates occurrence dates from Chore recurrence rules
  components/
    calendar/          # CalendarView (react-big-calendar wrapper), EventPopover
    chores/            # ChoreList (CRUD table), ChoreModal (Headless UI Dialog)
    members/           # MembersPanel (CRUD with color picker)
    layout/            # Sidebar (navigation + member quick-list)
```

## Commands

```bash
npm run dev       # Dev server with HMR (Vite)
npm run build     # tsc -b && vite build → dist/
npm run lint      # ESLint on all .ts/.tsx
npm run preview   # Serve dist/ locally
```

TypeScript is configured in strict mode — `noUnusedLocals` and `noUnusedParameters` are enforced (`tsconfig.app.json`).

## Domain Model (src/types.ts)

- **Member** — `id`, `name`, `color` (hex)
- **Chore** — has a discriminated-union `Recurrence` (`once` | `interval`)
- **ChoreCompletion** — tracks per-occurrence completion by `choreId + date`
- **AppState** — `{ members, chores, completions }`

## Adding new Features or Fixing Bugs

**IMPORTANT**: When you work on a new feature or bug, create a git branch first. Then WOrk or changes in that branch for the remainder of the session.

## Additional Documentation

Check these files when working on the relevant area:

| File | When to read |
|---|---|
| `.claude/docs/architectural_patterns.md` | State flow, component contracts, recurrence logic, memoization strategy |
