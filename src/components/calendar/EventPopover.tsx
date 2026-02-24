import type { Chore, Member } from '../../types';
import { recurrenceSummary } from '../../lib/recurrence';

type CalendarEvent = {
  title: string;
  start: Date;
  end: Date;
  resource: {
    chore: Chore;
    dateStr: string;
    completed: boolean;
    member: Member | null;
  };
};

type Props = {
  event: CalendarEvent;
  onClose: () => void;
  onToggleComplete: (choreId: string, dateStr: string) => void;
};

export default function EventPopover({ event, onClose, onToggleComplete }: Props) {
  const { chore, dateStr, completed, member } = event.resource;

  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-sm p-5 z-50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {member && (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ backgroundColor: member.color }}
              >
                {member.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h3
                className="font-bold text-gray-800"
                style={{ textDecoration: completed ? 'line-through' : 'none' }}
              >
                {chore.title}
              </h3>
              <p className="text-xs text-gray-500">{dateStr}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg leading-none ml-2"
          >
            ✕
          </button>
        </div>

        {/* Details */}
        <div className="space-y-1.5 mb-4">
          {chore.description && (
            <p className="text-sm text-gray-600">{chore.description}</p>
          )}
          <p className="text-xs text-gray-500">
            <span className="font-medium">Recurrence:</span> {recurrenceSummary(chore)}
          </p>
          <p className="text-xs text-gray-500">
            <span className="font-medium">Assigned to:</span>{' '}
            {member ? (
              <span style={{ color: member.color }} className="font-medium">
                {member.name}
              </span>
            ) : (
              'Unassigned'
            )}
          </p>
        </div>

        {/* Action */}
        <button
          onClick={() => onToggleComplete(chore.id, dateStr)}
          className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
            completed
              ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {completed ? '↩ Mark as not done' : '✓ Mark as done'}
        </button>
      </div>
    </div>
  );
}
