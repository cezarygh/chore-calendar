import { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { format } from 'date-fns';
import type { Chore, Member, Recurrence } from '../../types';

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (chore: Chore) => void;
  members: Member[];
  initial?: Chore | null;
};

const TODAY = format(new Date(), 'yyyy-MM-dd');

const defaultForm = (): FormState => ({
  title: '',
  description: '',
  assigneeId: '',
  startDate: TODAY,
  startTime: '',
  recurrenceType: 'once',
  every: 1,
  unit: 'weeks',
  endDate: '',
});

type FormState = {
  title: string;
  description: string;
  assigneeId: string;
  startDate: string;
  startTime: string;
  recurrenceType: 'once' | 'interval';
  every: number;
  unit: 'days' | 'weeks' | 'months';
  endDate: string;
};

export default function ChoreModal({ open, onClose, onSave, members, initial }: Props) {
  const [form, setForm] = useState<FormState>(defaultForm());

  useEffect(() => {
    if (initial) {
      const r = initial.recurrence;
      setForm({
        title: initial.title,
        description: initial.description ?? '',
        assigneeId: initial.assigneeId ?? '',
        startDate: initial.startDate,
        startTime: initial.startTime ?? '',
        recurrenceType: r.type,
        every: r.type === 'interval' ? r.every : 1,
        unit: r.type === 'interval' ? r.unit : 'weeks',
        endDate: r.type === 'interval' && r.endDate ? r.endDate : '',
      });
    } else {
      setForm(defaultForm());
    }
  }, [initial, open]);

  function set<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.startDate) return;

    const recurrence: Recurrence =
      form.recurrenceType === 'once'
        ? { type: 'once' }
        : {
            type: 'interval',
            every: form.every,
            unit: form.unit,
            ...(form.endDate ? { endDate: form.endDate } : {}),
          };

    const chore: Chore = {
      id: initial?.id ?? crypto.randomUUID(),
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      assigneeId: form.assigneeId || null,
      recurrence,
      startDate: form.startDate,
      ...(form.startTime ? { startTime: form.startTime } : {}),
    };

    onSave(chore);
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
          <Dialog.Title className="text-lg font-bold text-gray-800 mb-4">
            {initial ? 'Edit Chore' : 'Add Chore'}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="e.g. Vacuum living room"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                rows={2}
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                placeholder="Optional notes..."
              />
            </div>

            {/* Assignee */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assign to</label>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={form.assigneeId}
                onChange={(e) => set('assigneeId', e.target.value)}
              >
                <option value="">Unassigned</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Start date + time */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start date <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="date"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  value={form.startDate}
                  onChange={(e) => set('startDate', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time (optional)</label>
                <input
                  type="time"
                  className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  value={form.startTime}
                  onChange={(e) => set('startTime', e.target.value)}
                />
              </div>
            </div>

            {/* Recurrence type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recurrence</label>
              <div className="flex gap-4">
                {(['once', 'interval'] as const).map((t) => (
                  <label key={t} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="recurrenceType"
                      value={t}
                      checked={form.recurrenceType === t}
                      onChange={() => set('recurrenceType', t)}
                      className="accent-indigo-600"
                    />
                    <span className="text-sm text-gray-700">
                      {t === 'once' ? 'One-time' : 'Repeating'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Interval config */}
            {form.recurrenceType === 'interval' && (
              <div className="bg-indigo-50 rounded-lg p-3 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-700">Every</span>
                  <input
                    type="number"
                    min={1}
                    max={365}
                    className="w-16 border border-gray-300 rounded px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    value={form.every}
                    onChange={(e) => set('every', Math.max(1, parseInt(e.target.value) || 1))}
                  />
                  <select
                    className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    value={form.unit}
                    onChange={(e) => set('unit', e.target.value as 'days' | 'weeks' | 'months')}
                  >
                    <option value="days">day(s)</option>
                    <option value="weeks">week(s)</option>
                    <option value="months">month(s)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">End date (optional)</label>
                  <input
                    type="date"
                    className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    value={form.endDate}
                    onChange={(e) => set('endDate', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors font-medium"
              >
                {initial ? 'Save Changes' : 'Add Chore'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
