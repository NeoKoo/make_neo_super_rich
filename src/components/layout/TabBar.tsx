import { Link, useLocation } from 'react-router-dom';
import { Target, History, Settings, BarChart3 } from 'lucide-react';
import { soundManager } from '../../utils/soundManager';

interface TabItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
}

const tabs: TabItem[] = [
  { id: 'home', label: '选号', icon: Target, path: '/' },
  { id: 'analysis', label: '分析', icon: BarChart3, path: '/analysis' },
  { id: 'history', label: '历史', icon: History, path: '/history' },
  { id: 'settings', label: '设置', icon: Settings, path: '/settings' }
];

export function TabBar() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-background-secondary/95 to-background-secondary/80 backdrop-blur-xl border-t border-white/10">
      <div className="flex justify-around items-center py-2">
        {tabs.map(tab => {
          const isActive = currentPath === tab.path;
          return (
            <Link
              key={tab.id}
              to={tab.path}
              onClick={() => {
                if (!isActive) {
                  soundManager.playTabSwitch();
                }
              }}
              className={`
                flex flex-col items-center py-2 px-4 flex-1
                transition-all duration-300
                ${isActive
                  ? 'text-primary'
                  : 'text-text-secondary hover:text-text-primary'
                }
              `}
            >
              <div className={`
                p-2 rounded-xl transition-all duration-300
                ${isActive
                  ? 'bg-primary/20 shadow-lg shadow-primary/20'
                  : 'hover:bg-white/5'
                }
              `}>
                <tab.icon
                  className={`w-6 h-6 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </div>
              <span className={`text-xs mt-1 font-medium ${isActive ? 'text-primary' : ''}`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 w-8 h-1 bg-primary rounded-full shadow-lg shadow-primary/50" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
