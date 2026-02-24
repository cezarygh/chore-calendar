import { useMemo, useState, useCallback } from 'react';
import { Calendar, dateFnsLocalizer, Views, type View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, addMonths, subMonths } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import type { Chore, Member } from '../../types';
import { generateOccurrences } from '../../lib/recurrence';
import EventPopover from './EventPopover';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales: { 'en-US': enUS },
});

type CalendarEvent = {
  title: string;
  start: Date;
  end: Date;
  resource: {
    chore: Chore;
    dateStr: string; // ISO date
    completed: boolean;
    member: Member | null;
  };
};

type Props = {
  chores: Chore[];
  members: Member[];
  isCompleted: (choreId: string, date: string) => boolean;
  onToggleComplete: (choreId: string, date: string) => void;
};

export default function CalendarView({ chores, members, isCompleted, onToggleComplete }: Props) {
  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const memberMap = useMemo(() => {
    const map = new Map<string, Member>();
    members.forEach((m) => map.set(m.id, m));
    return map;
  }, [members]);

  // Generate events for a ±3-month window around the current date
  const events = useMemo<CalendarEvent[]>(() => {
    const rangeStart = subMonths(date, 2);
    const rangeEnd = addMonths(date, 2);

    return chores.flatMap((chore) => {
      const occurrences = generateOccurrences(chore, rangeStart, rangeEnd);
      const member = chore.assigneeId ? memberMap.get(chore.assigneeId) ?? null : null;
      return occurrences.map((d) => {
        const dateStr = format(d, 'yyyy-MM-dd');
        return {
          title: chore.title,
          start: d,
          end: d,
          resource: {
            chore,
            dateStr,
            completed: isCompleted(chore.id, dateStr),
            member,
          },
        };
      });
    });
  }, [chores, memberMap, date, isCompleted]);

  const eventPropGetter = useCallback((event: CalendarEvent) => {
    const { member, completed } = event.resource;
    const bg = member?.color ?? '#9ca3af';
    return {
      style: {
        backgroundColor: bg,
        borderColor: bg,
        opacity: completed ? 0.55 : 1,
        textDecoration: completed ? 'line-through' : 'none',
        color: '#fff',
        borderRadius: '4px',
        fontSize: '0.75rem',
      },
    };
  }, []);

  function handleSelectEvent(event: CalendarEvent) {
    setSelectedEvent(event);
  }

  function handleNavigate(newDate: Date) {
    setDate(newDate);
  }

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex-1 min-h-0">
        <Calendar
          localizer={localizer}
          events={events}
          view={view}
          date={date}
          onView={setView}
          onNavigate={handleNavigate}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventPropGetter}
          popup
          style={{ height: '100%' }}
        />
      </div>

      {selectedEvent && (
        <EventPopover
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onToggleComplete={(choreId, dateStr) => {
            onToggleComplete(choreId, dateStr);
            // Update the selected event's completed state in the popover
            setSelectedEvent((prev) =>
              prev
                ? {
                    ...prev,
                    resource: {
                      ...prev.resource,
                      completed: !prev.resource.completed,
                    },
                  }
                : null
            );
          }}
        />
      )}
    </div>
  );
}
