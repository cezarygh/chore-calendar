import { useState } from 'react';
import type { Member } from '../../types';

const PRESET_COLORS = [
  '#6366f1', '#ec4899', '#f97316', '#22c55e',
  '#06b6d4', '#eab308', '#ef4444', '#8b5cf6',
];

type Props = {
  members: Member[];
  onAdd: (member: Member) => void;
  onRemove: (id: string) => void;
  onUpdate: (member: Member) => void;
};

export default function MembersPanel({ members, onAdd, onRemove, onUpdate }: Props) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ id: crypto.randomUUID(), name: name.trim(), color });
    setName('');
    setColor(PRESET_COLORS[0]);
  }

  function startEdit(m: Member) {
    setEditingId(m.id);
    setEditName(m.name);
    setEditColor(m.color);
  }

  function saveEdit(id: string) {
    if (!editName.trim()) return;
    onUpdate({ id, name: editName.trim(), color: editColor });
    setEditingId(null);
  }

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Household Members</h1>

      {/* Add member form */}
      <form onSubmit={handleAdd} className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">Add Member</h2>
        <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-1">Name</label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alice"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Color</label>
            <div className="flex gap-1">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110"
                  style={{
                    backgroundColor: c,
                    borderColor: color === c ? '#1e1b4b' : 'transparent',
                  }}
                />
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-indigo-700 transition-colors w-full sm:w-auto"
          >
            Add
          </button>
        </div>
      </form>

      {/* Member list */}
      {members.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-8">No members yet. Add one above.</p>
      ) : (
        <div className="space-y-2">
          {members.map((m) => (
            <div
              key={m.id}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex items-center gap-4"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={{ backgroundColor: editingId === m.id ? editColor : m.color }}
              >
                {(editingId === m.id ? editName : m.name).charAt(0).toUpperCase()}
              </div>

              {editingId === m.id ? (
                <div className="flex-1 flex items-center gap-3">
                  <input
                    className="border border-gray-300 rounded px-2 py-1 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                  <div className="flex gap-1">
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setEditColor(c)}
                        className="w-5 h-5 rounded-full border-2 transition-transform hover:scale-110"
                        style={{
                          backgroundColor: c,
                          borderColor: editColor === c ? '#1e1b4b' : 'transparent',
                        }}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => saveEdit(m.id)}
                    className="text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-between">
                  <span className="font-medium text-gray-800">{m.name}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(m)}
                      className="text-xs text-indigo-600 hover:text-indigo-800 border border-indigo-200 rounded px-2 py-1 hover:bg-indigo-50"
                    >
                      Edit
                    </button>
                    {confirmDeleteId === m.id ? (
                      <div className="flex gap-1 items-center">
                        <span className="text-xs text-red-600">Remove?</span>
                        <button
                          onClick={() => { onRemove(m.id); setConfirmDeleteId(null); }}
                          className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="text-xs text-gray-500 hover:text-gray-700 border border-gray-200 rounded px-2 py-1"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(m.id)}
                        className="text-xs text-red-500 hover:text-red-700 border border-red-200 rounded px-2 py-1 hover:bg-red-50"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
