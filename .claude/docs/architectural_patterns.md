# Architectural Patterns

## 1. Centralised State via Custom Hook

**Files:** `src/hooks/useAppState.ts`, `src/App.tsx`

All mutable application state lives in a single `useAppState` hook. `App.tsx` calls it once and fans out callbacks via props — no context, no global store.

```
useAppState()          ← single call in App.tsx (line 16)
  └─ useState(loadState)   ← hydrates from localStorage on mount
  └─ useEffect(saveState)  ← persists on every state change (lines 9–11)
  └─ returns { state, addMember, removeMember, updateMember,
                addChore, removeChore, updateChore,
                toggleCompletion, isCompleted }
```

Callers never call `setState` directly; they use the returned callbacks. This keeps mutation logic co-located and testable.

## 2. Prop Drilling (intentional, no Context)

**Files:** `src/App.tsx` (lines 21–57), all component files

The app is small enough that prop drilling is preferred over React Context. `App.tsx` acts as a page router and passes the relevant slice of `state` plus the needed callbacks to each page component. No component fetches its own data or owns persistent state.

## 3. Storage Abstraction

**File:** `src/lib/storage.ts` (lines 1–23)

`localStorage` is accessed only through `loadState` / `saveState`. The load function merges saved JSON with `defaultState` so new fields added to `AppState` are always present:

```typescript
return { ...defaultState, ...JSON.parse(raw) };  // line 15
```

This prevents crashes when the stored schema is older than the current type definition.

## 4. Discriminated Union for Recurrence

**File:** `src/types.ts` (lines 10–18)

`Recurrence` is a discriminated union — `{ type: 'once' }` or `{ type: 'interval'; every; unit; endDate? }`. Code that handles recurrence (e.g. `recurrence.ts` lines 20–55, `ChoreModal.tsx` lines 67–84) exhaustively narrows on `type`, making impossible states unrepresentable.

## 5. Recurrence Engine

**File:** `src/lib/recurrence.ts` (lines 1–66)

`generateOccurrences(chore, rangeStart, rangeEnd): Date[]` is a pure function that expands a `Chore` into concrete occurrence dates within a window. It is the only place that interprets `Recurrence`; the calendar and list views both consume its output. `date-fns` (`addDays`, `addWeeks`, `addMonths`) handles all date arithmetic.

`recurrenceSummary(chore): string` produces a human-readable label from the same data.

## 6. Calendar Event Memoization

**File:** `src/components/calendar/CalendarView.tsx` (lines 49–87)

Two optimisations prevent unnecessary calendar re-renders:

- **`useMemo` on `events`** (line 49) — regenerates the full event list only when `chores`, `memberMap`, `date`, or `isCompleted` change. Pre-calculates a ±2 month window.
- **`useCallback` on `eventPropGetter`** (line 73) — returns per-event style (member colour, completion opacity) without re-creating the function on every render.

## 7. Local Form State + Domain Transform on Submit

**File:** `src/components/chores/ChoreModal.tsx` (lines 27–84)

The modal keeps its own flat form state (`FormState`, lines 27–36) separate from the domain `Chore` type. A `useEffect` syncs the modal's local state when it opens with an existing chore (lines 41–57). On submit, the flat state is transformed back into the domain model (lines 67–84), including constructing the correct `Recurrence` discriminated union variant.

This pattern keeps controlled inputs simple while preserving domain type integrity at the boundary.

## 8. Member Colour as Visual Identity

**Files:** `src/components/members/MembersPanel.tsx` (lines 4–7), `src/components/calendar/CalendarView.tsx` (line 76), `src/components/layout/Sidebar.tsx`

A fixed palette of 8 hex colours is defined in `MembersPanel`. Each member's `color` field is reused as `backgroundColor` in calendar events (`eventPropGetter`), sidebar avatars, and chore badges — providing consistent visual identity without a theming system.

## 9. Per-Occurrence Completion (Composite Key)

**File:** `src/hooks/useAppState.ts` (lines 60–89)

Completion state is tracked as `ChoreCompletion[]` with `choreId` + ISO `date` string as a composite key. `toggleCompletion(choreId, date)` either appends or filters out the matching entry. `isCompleted(choreId, date)` is a pure lookup. This allows the same recurring chore to have different completion states on different dates without mutating the `Chore` itself.
