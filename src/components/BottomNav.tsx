import React from 'react';
import { 
  BookOpen, 
  Heart, 
  Sparkles, 
  Calendar, 
  Bookmark as BookmarkIcon,
  Search
} from 'lucide-react';
import { ReaderSettings } from '../types';

interface BottomNavProps {
  activeTab?: string;
  onOpenBooks: () => void;
  onOpenDailyVerse: () => void;
  onOpenAiAssistant: () => void;
  onOpenReadingPlans: () => void;
  onOpenLibrary: () => void;
  settings: ReaderSettings;
  unreadCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  onOpenBooks,
  onOpenDailyVerse,
  onOpenAiAssistant,
  onOpenReadingPlans,
  onOpenLibrary,
  settings,
}) => {
  const isDark = settings.theme === 'dark' || settings.theme === 'midnight';

  const navItems = [
    {
      id: 'read',
      label: 'Scripture',
      icon: BookOpen,
      onClick: onOpenBooks,
      accent: false,
    },
    {
      id: 'daily',
      label: 'Daily Bread',
      icon: Heart,
      onClick: onOpenDailyVerse,
      accent: false,
    },
    {
      id: 'ai-study',
      label: 'AI Study',
      icon: Sparkles,
      onClick: onOpenAiAssistant,
      accent: true,
    },
    {
      id: 'plans',
      label: 'Journeys',
      icon: Calendar,
      onClick: onOpenReadingPlans,
      accent: false,
    },
    {
      id: 'library',
      label: 'Library',
      icon: BookmarkIcon,
      onClick: onOpenLibrary,
      accent: false,
    },
  ];

  return (
    <nav
      id="mobile-bottom-nav"
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 border-t backdrop-blur-lg transition-colors duration-300 safe-area-pb"
      style={{
        backgroundColor:
          settings.theme === 'midnight' ? 'rgba(10, 15, 26, 0.94)' :
          settings.theme === 'dark' ? 'rgba(24, 24, 27, 0.94)' :
          settings.theme === 'sepia' ? 'rgba(246, 238, 219, 0.95)' :
          settings.theme === 'parchment' ? 'rgba(250, 247, 240, 0.95)' :
          'rgba(255, 255, 255, 0.95)',
        borderColor: isDark ? '#1e293b' : '#e5ddcb',
        color: isDark ? '#f1f5f9' : '#1e293b',
      }}
    >
      <div className="grid grid-cols-5 h-16 items-center px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              id={`mobile-nav-btn-${item.id}`}
              onClick={item.onClick}
              className="flex flex-col items-center justify-center gap-1 w-full h-full py-1 group active:scale-95 transition-transform"
            >
              {item.accent ? (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-amber-500 text-white flex items-center justify-center shadow-xs -mt-1 group-active:scale-90 transition-transform">
                  <Icon className="w-4 h-4" />
                </div>
              ) : (
                <Icon className="w-5 h-5 opacity-75 group-hover:opacity-100 group-active:text-amber-600 transition-colors" />
              )}
              <span 
                className={`text-[10px] tracking-tight leading-none ${
                  item.accent 
                    ? 'font-bold text-amber-600 dark:text-amber-400' 
                    : 'font-medium opacity-80 group-hover:opacity-100'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
