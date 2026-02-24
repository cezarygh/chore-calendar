import {
  parseISO,
  addDays,
  addWeeks,
  addMonths,
  isAfter,
  isBefore,
  isEqual,
  startOfDay,
} from 'date-fns';
import type { Chore } from '../types';

/**
 * Generate all occurrence dates for a chore within [rangeStart, rangeEnd].
 */
export function generateOccurrences(
  chore: Chore,
  rangeStart: Date,
  rangeEnd: Date
): Date[] {
  const start = startOfDay(parseISO(chore.startDate));
  const results: Date[] = [];

  if (chore.recurrence.type === 'once') {
    if (
      (isAfter(start, rangeStart) || isEqual(start, rangeStart)) &&
      (isBefore(start, rangeEnd) || isEqual(start, rangeEnd))
    ) {
      results.push(start);
    }
    return results;
  }

  const { every, unit, endDate } = chore.recurrence;
  const hardEnd = endDate ? startOfDay(parseISO(endDate)) : null;

  let current = start;
  // Walk to first occurrence >= rangeStart
  while (isBefore(current, rangeStart)) {
    current = advance(current, every, unit);
  }

  while (
    (isBefore(current, rangeEnd) || isEqual(current, rangeEnd)) &&
    (!hardEnd || isBefore(current, hardEnd) || isEqual(current, hardEnd))
  ) {
    results.push(current);
    current = advance(current, every, unit);
  }

  return results;
}

function advance(date: Date, every: number, unit: 'days' | 'weeks' | 'months'): Date {
  if (unit === 'days') return addDays(date, every);
  if (unit === 'weeks') return addWeeks(date, every);
  return addMonths(date, every);
}

/** Human-readable recurrence summary */
export function recurrenceSummary(chore: Chore): string {
  if (chore.recurrence.type === 'once') return 'One-time';
  const { every, unit } = chore.recurrence;
  if (every === 1) return `Every ${unit.slice(0, -1)}`; // "Every day"
  return `Every ${every} ${unit}`;
}
