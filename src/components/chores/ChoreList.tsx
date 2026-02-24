import { useState } from 'react';
import type { Chore, Member } from '../../types';
import { recurrenceSummary } from '../../lib/recurrence';
import ChoreModal from './ChoreModal';

type Props = {
  chores: Chore[];
  members: Member[];
  onAdd: (chore: Chore) => void;
  onUpdate: (chore: Chore) => void;
  onRemove: (id: string) => void;
};

export default function ChoreList({ chores, members, onAdd, onUpdate, onRemove }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Chore | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  function memberName(id: string | null) {
    if (!id) return null;
    return members.find((m) => m.id === id) ?? null;
  }

  function handleSave(chore: Chore) {
    if (editing) {
      onUpdate(chore);
    } else {
      onAdd(chore);
    }
    setEditing(null);
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Chores</h1>
        <button
          onClick={() => { setEditing(null); setModalOpen(true); }}
          className="bg-indigo-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          + Add Chore
        </button>
      </div>

      {chores.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🧹</p>
          <p className="text-lg font-medium">No chores yet</p>
          <p className="text-sm mt-1">Click "+ Add Chore" to get started.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {chores.map((chore) => {
            const member = memberName(chore.assigneeId);
            return (
              <div
                key={chore.id}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex items-center gap-4"
              >
                {/* Color stripe */}
                <div
                  className="w-1.5 h-10 rounded-full flex-shrink-0"
                  style={{ backgroundColor: member?.color ?? '#9ca3af' }}
                />

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">{chore.title}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-gray-500">{recurrenceSummary(chore)}</span>
                    <span className="text-xs text-gray-400">·</span>
                    <span className="text-xs text-gray-500">
                      Starts {chore.startDate}
                    </span>
                  </div>
                </div>

                {/* Assignee badge */}
                {member ? (
                  <span
                    className="text-xs text-white px-2 py-1 rounded-full font-medium flex-shrink-0"
                    style={{ backgroundColor: member.color }}
                  >
                    {member.name}
                  </span>
                ) : (
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full flex-shrink-0">
                    Unassigned
                  </span>
                )}

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => { setEditing(chore); setModalOpen(true); }}
                    className="text-xs text-indigo-600 hover:text-indigo-800 border border-indigo-200 rounded px-2 py-1 hover:bg-indigo-50"
                  >
                    Edit
                  </button>
                  {confirmDeleteId === chore.id ? (
                    <div className="flex gap-1 items-center">
                      <span className="text-xs text-red-600">Remove?</span>
                      <button
                        onClick={() => { onRemove(chore.id); setConfirmDeleteId(null); }}
                        className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="text-xs text-gray-500 border border-gray-200 rounded px-2 py-1 hover:bg-gray-50"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(chore.id)}
                      className="text-xs text-red-500 hover:text-red-700 border border-red-200 rounded px-2 py-1 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ChoreModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        onSave={handleSave}
        members={members}
        initial={editing}
      />
    </div>
  );
}
