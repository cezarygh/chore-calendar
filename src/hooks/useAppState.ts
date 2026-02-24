import { useState, useEffect, useCallback } from 'react';
import { loadState, saveState } from '../lib/storage';
import type { AppState, Member, Chore, ChoreCompletion } from '../types';

export function useAppState() {
  const [state, setStateRaw] = useState<AppState>(loadState);

  // Persist to localStorage on every change
  useEffect(() => {
    saveState(state);
  }, [state]);

  const setState = useCallback((updater: (prev: AppState) => AppState) => {
    setStateRaw(updater);
  }, []);

  // --- Members ---
  const addMember = useCallback((member: Member) => {
    setState((s) => ({ ...s, members: [...s.members, member] }));
  }, [setState]);

  const removeMember = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      members: s.members.filter((m) => m.id !== id),
      chores: s.chores.map((c) =>
        c.assigneeId === id ? { ...c, assigneeId: null } : c
      ),
    }));
  }, [setState]);

  const updateMember = useCallback((updated: Member) => {
    setState((s) => ({
      ...s,
      members: s.members.map((m) => (m.id === updated.id ? updated : m)),
    }));
  }, [setState]);

  // --- Chores ---
  const addChore = useCallback((chore: Chore) => {
    setState((s) => ({ ...s, chores: [...s.chores, chore] }));
  }, [setState]);

  const removeChore = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      chores: s.chores.filter((c) => c.id !== id),
      completions: s.completions.filter((cp) => cp.choreId !== id),
    }));
  }, [setState]);

  const updateChore = useCallback((updated: Chore) => {
    setState((s) => ({
      ...s,
      chores: s.chores.map((c) => (c.id === updated.id ? updated : c)),
    }));
  }, [setState]);

  // --- Completions ---
  const toggleCompletion = useCallback((choreId: string, date: string) => {
    setState((s) => {
      const existing = s.completions.find(
        (cp) => cp.choreId === choreId && cp.date === date
      );
      if (existing) {
        return {
          ...s,
          completions: s.completions.filter(
            (cp) => !(cp.choreId === choreId && cp.date === date)
          ),
        };
      }
      const newCompletion: ChoreCompletion = {
        choreId,
        date,
        completedAt: new Date().toISOString(),
      };
      return { ...s, completions: [...s.completions, newCompletion] };
    });
  }, [setState]);

  const isCompleted = useCallback(
    (choreId: string, date: string): boolean => {
      return state.completions.some(
        (cp) => cp.choreId === choreId && cp.date === date
      );
    },
    [state.completions]
  );

  return {
    state,
    addMember,
    removeMember,
    updateMember,
    addChore,
    removeChore,
    updateChore,
    toggleCompletion,
    isCompleted,
  };
}
