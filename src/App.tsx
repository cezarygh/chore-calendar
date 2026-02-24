import { useState } from 'react';
import { useAppState } from './hooks/useAppState';
import Sidebar from './components/layout/Sidebar';
import CalendarView from './components/calendar/CalendarView';
import ChoreList from './components/chores/ChoreList';
import MembersPanel from './components/members/MembersPanel';

type Page = 'calendar' | 'chores' | 'members';

export default function App() {
  const [page, setPage] = useState<Page>('calendar');
  const {
    state,
    addMember,
    removeMember,
    updateMember,
    addChore,
    removeChore,
    updateChore,
    toggleCompletion,
    isCompleted,
  } = useAppState();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar page={page} onNavigate={setPage} members={state.members} />

      <main className="flex-1 overflow-auto">
        {page === 'calendar' && (
          <CalendarView
            chores={state.chores}
            members={state.members}
            isCompleted={isCompleted}
            onToggleComplete={toggleCompletion}
          />
        )}
        {page === 'chores' && (
          <ChoreList
            chores={state.chores}
            members={state.members}
            onAdd={addChore}
            onUpdate={updateChore}
            onRemove={removeChore}
          />
        )}
        {page === 'members' && (
          <MembersPanel
            members={state.members}
            onAdd={addMember}
            onRemove={removeMember}
            onUpdate={updateMember}
          />
        )}
      </main>
    </div>
  );
}
