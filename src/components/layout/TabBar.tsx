import { Link, useLocation } from 'react-router-dom';

interface TabItem {
  id: string;
  label: string;
  icon: string;
  path: string;
}

const tabs: TabItem[] = [
  { id: 'home', label: '选号', icon: '🎯', path: '/' },
  { id: 'history', label: '历史', icon: '📜', path: '/history' },
  { id: 'settings', label: '设置', icon: '⚙️', path: '/settings' }
];

export function TabBar() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background-secondary border-t border-white/10 z-50">
      <div className="flex justify-around items-center">
        {tabs.map(tab => (
          <Link
            key={tab.id}
            to={tab.path}
            className={`
              flex flex-col items-center py-2 px-4 flex-1
              ${currentPath === tab.path 
                ? 'text-primary' 
                : 'text-text-secondary hover:text-text-primary'
              }
              transition-colors duration-200
            `}
          >
            <span className="text-2xl mb-1">{tab.icon}</span>
            <span className="text-xs">{tab.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
