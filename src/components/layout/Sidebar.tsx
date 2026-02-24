import type { Member } from '../../types';

type Page = 'calendar' | 'chores' | 'members';

type Props = {
  page: Page;
  onNavigate: (page: Page) => void;
  members: Member[];
};

const navItems: { id: Page; label: string; icon: string }[] = [
  { id: 'calendar', label: 'Calendar', icon: '📅' },
  { id: 'chores', label: 'Chores', icon: '🧹' },
  { id: 'members', label: 'Members', icon: '👥' },
];

export default function Sidebar({ page, onNavigate, members }: Props) {
  return (
    <aside className="w-56 flex-shrink-0 bg-gray-900 text-white flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-lg font-bold tracking-tight">🏠 ChoreBoard</h1>
        <p className="text-xs text-gray-400 mt-0.5">Home chore planner</p>
      </div>

      {/* Nav */}
      <nav className="p-3 flex-1">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onNavigate(item.id)}
                className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  page === item.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Members quick list */}
        {members.length > 0 && (
          <div className="mt-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
              Household
            </p>
            <ul className="space-y-1">
              {members.map((m) => (
                <li
                  key={m.id}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded text-sm text-gray-300"
                >
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: m.color }}
                  >
                    {m.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="truncate">{m.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </aside>
  );
}
