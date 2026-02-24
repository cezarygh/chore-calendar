export type Member = {
  id: string;
  name: string;
  color: string; // hex color
};

export type Recurrence =
  | { type: 'once' }
  | {
      type: 'interval';
      every: number;
      unit: 'days' | 'weeks' | 'months';
      endDate?: string; // ISO date, optional
    };

export type Chore = {
  id: string;
  title: string;
  description?: string;
  assigneeId: string | null;
  recurrence: Recurrence;
  startDate: string; // ISO date of first occurrence
  startTime?: string; // HH:mm, optional
};

export type ChoreCompletion = {
  choreId: string;
  date: string; // ISO date of the specific occurrence
  completedAt: string; // ISO timestamp
};

export type AppState = {
  members: Member[];
  chores: Chore[];
  completions: ChoreCompletion[];
};
