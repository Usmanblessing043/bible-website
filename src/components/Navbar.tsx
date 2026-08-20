import React from 'react';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  Bookmark as BookmarkIcon, 
  Calendar, 
  Volume2, 
  Settings, 
  Sun, 
  Moon, 
  Columns, 
  ChevronDown,
  Compass,
  Heart
} from 'lucide-react';
import { BibleBook, Translation, ReaderSettings, ReaderTheme } from '../types';
import { AVAILABLE_TRANSLATIONS } from '../data/bibleBooks';

interface NavbarProps {
  currentBook: BibleBook;
  currentChapter: number;
  currentTranslation: string;
  settings: ReaderSettings;
  onOpenBookSelector: () => void;
  onOpenSearch: () => void;
  onOpenAiAssistant: () => void;
  onOpenLibrary: () => void;
  onOpenReadingPlans: () => void;
  onOpenDailyVerse: () => void;
  onOpenSettings: () => void;
  onSelectTranslation: (transId: string) => void;
  onToggleSplitView: () => void;
  onToggleAudio: () => void;
  isPlayingAudio: boolean;
  onUpdateSettings: (newSettings: Partial<ReaderSettings>) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentBook,
  currentChapter,
  currentTranslation,
  settings,
  onOpenBookSelector,
  onOpenSearch,
  onOpenAiAssistant,
  onOpenLibrary,
  onOpenReadingPlans,
  onOpenDailyVerse,
  onOpenSettings,
  onSelectTranslation,
  onToggleSplitView,
  onToggleAudio,
  isPlayingAudio,
  onUpdateSettings,
}) => {
  const currentTransObj = AVAILABLE_TRANSLATIONS.find((t) => t.id === currentTranslation) || AVAILABLE_TRANSLATIONS[0];

  const cycleTheme = () => {
    const themeCycle: ReaderTheme[] = ['parchment', 'light', 'sepia', 'dark', 'midnight'];
    const currentIndex = themeCycle.indexOf(settings.theme);
    const nextTheme = themeCycle[(currentIndex + 1) % themeCycle.length];
    onUpdateSettings({ theme: nextTheme });
  };

  return (
    <header 
      id="app-header" 
      className="sticky top-0 z-30 border-b backdrop-blur-md transition-colors duration-300"
      style={{
        backgroundColor: 
          settings.theme === 'midnight' ? 'rgba(10, 15, 26, 0.92)' :
          settings.theme === 'dark' ? 'rgba(24, 24, 27, 0.92)' :
          settings.theme === 'sepia' ? 'rgba(244, 235, 219, 0.92)' :
          settings.theme === 'parchment' ? 'rgba(250, 248, 243, 0.94)' :
          'rgba(255, 255, 255, 0.92)',
        borderColor:
          settings.theme === 'midnight' ? '#1e293b' :
          settings.theme === 'dark' ? '#27272a' :
          settings.theme === 'sepia' ? '#e2d3b8' :
          settings.theme === 'parchment' ? '#e8e2d2' :
          '#e2e8f0',
        color:
          settings.theme === 'midnight' || settings.theme === 'dark' ? '#f1f5f9' : '#1e293b'
      }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Left: Brand & Book/Chapter Trigger */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            id="brand-logo-btn"
            onClick={onOpenBookSelector}
            className="flex items-center gap-2 font-serif font-bold text-lg sm:text-xl tracking-tight hover:opacity-85 transition-opacity"
            title="Choose Book & Chapter"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-700 text-amber-50 flex items-center justify-center shadow-xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="hidden md:inline font-serif font-bold">Scripture</span>
          </button>

          {/* Quick Book & Chapter Selector Button */}
          <button
            id="book-chapter-picker-btn"
            onClick={onOpenBookSelector}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-serif font-semibold text-sm sm:text-base border transition-all hover:shadow-xs"
            style={{
              borderColor: settings.theme === 'midnight' || settings.theme === 'dark' ? '#334155' : '#d6cdb7',
              backgroundColor: settings.theme === 'midnight' || settings.theme === 'dark' ? '#1e293b' : '#f5efe0',
            }}
          >
            <span>{currentBook.name} {currentChapter}</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-70" />
          </button>

          {/* Translation Picker Dropdown */}
          <div className="relative group">
            <button
              id="translation-picker-btn"
              className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider border transition-colors opacity-90 hover:opacity-100"
              style={{
                borderColor: settings.theme === 'midnight' || settings.theme === 'dark' ? '#334155' : '#dcd5c4',
                backgroundColor: settings.theme === 'midnight' || settings.theme === 'dark' ? '#0f172a' : '#fbf8f0',
              }}
            >
              <span>{currentTransObj.shortName}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>
            
            {/* Translation Popup Menu */}
            <div 
              className="absolute left-0 mt-1 w-56 rounded-xl border shadow-xl p-1.5 hidden group-hover:block z-50 transition-all"
              style={{
                backgroundColor: settings.theme === 'midnight' ? '#0f172a' : settings.theme === 'dark' ? '#18181b' : '#ffffff',
                borderColor: settings.theme === 'midnight' || settings.theme === 'dark' ? '#334155' : '#e2e8f0',
              }}
            >
              <div className="px-2 py-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Bible Versions
              </div>
              {AVAILABLE_TRANSLATIONS.map((trans) => (
                <button
                  key={trans.id}
                  id={`select-translation-${trans.id}`}
                  onClick={() => onSelectTranslation(trans.id)}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex flex-col gap-0.5 transition-colors ${
                    currentTranslation === trans.id 
                      ? 'bg-amber-600/15 text-amber-800 dark:text-amber-300 font-semibold' 
                      : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{trans.name}</span>
                    <span className="text-[10px] font-mono uppercase bg-black/5 dark:bg-white/10 px-1 rounded">{trans.shortName}</span>
                  </div>
                  <span className="text-[11px] opacity-70 line-clamp-1">{trans.description}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Daily Bread / Verse of the Day */}
          <button
            id="daily-verse-nav-btn"
            onClick={onOpenDailyVerse}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all hover:scale-105 active:scale-95"
            style={{
              borderColor: settings.theme === 'midnight' || settings.theme === 'dark' ? '#334155' : '#e2d7be',
              backgroundColor: settings.theme === 'midnight' || settings.theme === 'dark' ? 'rgba(217, 119, 6, 0.15)' : 'rgba(217, 119, 6, 0.08)',
              color: '#d97706',
            }}
            title="Verse of the Day & Devotional"
          >
            <Heart className="w-3.5 h-3.5 fill-amber-500/20" />
            <span className="hidden lg:inline">Daily Bread</span>
          </button>

          {/* Search Trigger */}
          <button
            id="search-nav-btn"
            onClick={onOpenSearch}
            className="p-2 rounded-lg text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/10"
            title="Search Scripture (Cmd+K / Ctrl+K)"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Audio Listen Trigger */}
          <button
            id="audio-nav-btn"
            onClick={onToggleAudio}
            className={`p-2 rounded-lg text-sm transition-all ${
              isPlayingAudio ? 'bg-amber-600 text-white shadow-xs animate-pulse' : 'hover:bg-black/5 dark:hover:bg-white/10'
            }`}
            title={isPlayingAudio ? 'Pause Audio Reading' : 'Listen to Chapter'}
          >
            <Volume2 className="w-4 h-4" />
          </button>

          {/* Parallel / Split View Toggle */}
          <button
            id="split-view-nav-btn"
            onClick={onToggleSplitView}
            className={`p-2 rounded-lg text-sm transition-colors hidden sm:inline-flex ${
              settings.splitView ? 'bg-amber-700/20 text-amber-700 dark:text-amber-300' : 'hover:bg-black/5 dark:hover:bg-white/10'
            }`}
            title="Toggle Parallel Translation View"
          >
            <Columns className="w-4 h-4" />
          </button>

          {/* Reading Plans */}
          <button
            id="reading-plans-nav-btn"
            onClick={onOpenReadingPlans}
            className="p-2 rounded-lg text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/10"
            title="Reading Journeys & Plans"
          >
            <Calendar className="w-4 h-4" />
          </button>

          {/* Personal Library (Notes, Highlights, Bookmarks) */}
          <button
            id="personal-library-nav-btn"
            onClick={onOpenLibrary}
            className="p-2 rounded-lg text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/10"
            title="Notes, Highlights & Bookmarks"
          >
            <BookmarkIcon className="w-4 h-4" />
          </button>

          {/* AI Study Assistant */}
          <button
            id="ai-assistant-nav-btn"
            onClick={onOpenAiAssistant}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-xs hover:opacity-95 transition-all hover:scale-105 active:scale-95"
            title="AI Scripture Companion"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI Study</span>
          </button>

          {/* Theme Quick Cycle */}
          <button
            id="theme-quick-toggle-btn"
            onClick={cycleTheme}
            className="p-2 rounded-lg text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/10"
            title={`Current Theme: ${settings.theme}. Click to change.`}
          >
            {settings.theme === 'midnight' || settings.theme === 'dark' ? (
              <Moon className="w-4 h-4 text-amber-300" />
            ) : (
              <Sun className="w-4 h-4 text-amber-600" />
            )}
          </button>

          {/* Reader Settings Drawer Trigger */}
          <button
            id="reader-settings-nav-btn"
            onClick={onOpenSettings}
            className="p-2 rounded-lg text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/10"
            title="Reader Display Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
