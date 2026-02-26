import { useState } from 'react';
import { useAppState } from './hooks/useAppState';
import Sidebar from './components/layout/Sidebar';
import BottomNav from './components/layout/BottomNav';
import CalendarView from './components/calendar/CalendarView';
import ChoreList from './components/chores/ChoreList';
import MembersPanel from './components/members/MembersPanel';

type Page = 'calendar' | 'chores' | 'members';

const PAGE_TITLES: Record<Page, string> = {
  calendar: '📅 Calendar',
  chores: '🧹 Chores',
  members: '👥 Members',
};

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
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 overflow-hidden">
      {/* Mobile top header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-gray-900 text-white flex-shrink-0">
        <span className="font-bold tracking-tight">🏠 ChoreBoard</span>
        <span className="text-sm text-gray-300">{PAGE_TITLES[page]}</span>
      </header>

      <Sidebar page={page} onNavigate={setPage} members={state.members} />

      <main className="flex-1 overflow-auto pb-16 md:pb-0">
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

      <BottomNav page={page} onNavigate={setPage} />
    </div>
  );
}
