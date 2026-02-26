type Page = 'calendar' | 'chores' | 'members';

type Props = {
  page: Page;
  onNavigate: (page: Page) => void;
};

const navItems: { id: Page; label: string; icon: string }[] = [
  { id: 'calendar', label: 'Calendar', icon: '📅' },
  { id: 'chores', label: 'Chores', icon: '🧹' },
  { id: 'members', label: 'Members', icon: '👥' },
];

export default function BottomNav({ page, onNavigate }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex md:hidden z-30">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className={`flex-1 flex flex-col items-center justify-center py-3 text-xs font-medium transition-colors ${
            page === item.id
              ? 'text-indigo-600'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <span className="text-xl mb-0.5">{item.icon}</span>
          {item.label}
        </button>
      ))}
    </nav>
  );
}
