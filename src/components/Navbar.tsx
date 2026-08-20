import React, { useState, useRef, useEffect } from 'react';
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
  Heart,
  Sliders
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
  const [transDropdownOpen, setTransDropdownOpen] = useState(false);
  const transDropdownRef = useRef<HTMLDivElement>(null);

  const currentTransObj = AVAILABLE_TRANSLATIONS.find((t) => t.id === currentTranslation) || AVAILABLE_TRANSLATIONS[0];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (transDropdownRef.current && !transDropdownRef.current.contains(event.target as Node)) {
        setTransDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const cycleTheme = () => {
    const themeCycle: ReaderTheme[] = ['parchment', 'light', 'sepia', 'dark', 'midnight'];
    const currentIndex = themeCycle.indexOf(settings.theme);
    const nextTheme = themeCycle[(currentIndex + 1) % themeCycle.length];
    onUpdateSettings({ theme: nextTheme });
  };

  const isDark = settings.theme === 'midnight' || settings.theme === 'dark';

  return (
    <header 
      id="app-header" 
      className="sticky top-0 z-30 border-b backdrop-blur-md transition-colors duration-300 safe-area-pt"
      style={{
        backgroundColor: 
          settings.theme === 'midnight' ? 'rgba(10, 15, 26, 0.94)' :
          settings.theme === 'dark' ? 'rgba(24, 24, 27, 0.94)' :
          settings.theme === 'sepia' ? 'rgba(244, 235, 219, 0.94)' :
          settings.theme === 'parchment' ? 'rgba(250, 248, 243, 0.96)' :
          'rgba(255, 255, 255, 0.94)',
        borderColor:
          settings.theme === 'midnight' ? '#1e293b' :
          settings.theme === 'dark' ? '#27272a' :
          settings.theme === 'sepia' ? '#e2d3b8' :
          settings.theme === 'parchment' ? '#e8e2d2' :
          '#e2e8f0',
        color: isDark ? '#f1f5f9' : '#1e293b'
      }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Left: Book & Chapter Picker & Version Badge */}
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
          {/* Logo / Brand Icon */}
          <button
            id="brand-logo-btn"
            onClick={onOpenBookSelector}
            className="flex items-center gap-2 font-serif font-bold text-base sm:text-lg tracking-tight hover:opacity-85 transition-opacity shrink-0"
            title="Choose Book & Chapter"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-700 text-amber-50 flex items-center justify-center shadow-xs">
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <span className="hidden xl:inline font-serif font-bold">Scripture</span>
          </button>

          {/* Quick Book & Chapter Selector Button (Touch friendly) */}
          <button
            id="book-chapter-picker-btn"
            onClick={onOpenBookSelector}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl font-serif font-semibold text-xs sm:text-sm md:text-base border transition-all hover:shadow-xs active:scale-95 shrink-0"
            style={{
              borderColor: isDark ? '#334155' : '#d6cdb7',
              backgroundColor: isDark ? '#1e293b' : '#f5efe0',
            }}
          >
            <span className="truncate max-w-[120px] sm:max-w-none">{currentBook.name} {currentChapter}</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-70 shrink-0" />
          </button>

          {/* Translation Picker Dropdown (Works for touch & mouse) */}
          <div className="relative shrink-0" ref={transDropdownRef}>
            <button
              id="translation-picker-btn"
              onClick={() => setTransDropdownOpen(!transDropdownOpen)}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold uppercase tracking-wider border transition-colors opacity-90 hover:opacity-100 active:scale-95"
              style={{
                borderColor: isDark ? '#334155' : '#dcd5c4',
                backgroundColor: isDark ? '#0f172a' : '#fbf8f0',
              }}
              title="Change Bible Translation"
            >
              <span>{currentTransObj.shortName}</span>
              <ChevronDown className={`w-3 h-3 opacity-60 transition-transform ${transDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Translation Popup Menu */}
            {transDropdownOpen && (
              <div 
                className="absolute left-0 mt-2 w-60 sm:w-64 rounded-2xl border shadow-2xl p-2 z-50 transition-all animate-in fade-in duration-150"
                style={{
                  backgroundColor: settings.theme === 'midnight' ? '#0f172a' : settings.theme === 'dark' ? '#18181b' : '#ffffff',
                  borderColor: isDark ? '#334155' : '#e2e8f0',
                }}
              >
                <div className="px-2.5 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center justify-between border-b pb-1.5 mb-1" style={{ borderColor: isDark ? '#1e293b' : '#f1f5f9' }}>
                  <span>Bible Versions</span>
                  <span className="text-[10px] lowercase opacity-60">select to read</span>
                </div>
                <div className="space-y-1 max-h-72 overflow-y-auto">
                  {AVAILABLE_TRANSLATIONS.map((trans) => (
                    <button
                      key={trans.id}
                      id={`select-translation-${trans.id}`}
                      onClick={() => {
                        onSelectTranslation(trans.id);
                        setTransDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex flex-col gap-0.5 transition-colors ${
                        currentTranslation === trans.id 
                          ? 'bg-amber-600/15 text-amber-800 dark:text-amber-300 font-semibold' 
                          : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-xs sm:text-sm">{trans.name}</span>
                        <span className="text-[10px] font-mono uppercase bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded">{trans.shortName}</span>
                      </div>
                      <span className="text-[11px] opacity-70 line-clamp-1">{trans.description}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Audio Recitation Trigger */}
          <button
            id="audio-nav-btn"
            onClick={onToggleAudio}
            className={`p-2 rounded-xl text-sm transition-all flex items-center justify-center ${
              isPlayingAudio 
                ? 'bg-amber-600 text-white shadow-xs animate-pulse' 
                : 'hover:bg-black/5 dark:hover:bg-white/10 opacity-80 hover:opacity-100 active:scale-95'
            }`}
            title={isPlayingAudio ? 'Pause Audio Reading' : 'Listen to Chapter'}
          >
            <Volume2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>

          {/* Search Trigger */}
          <button
            id="search-nav-btn"
            onClick={onOpenSearch}
            className="p-2 rounded-xl text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/10 opacity-80 hover:opacity-100 active:scale-95 flex items-center justify-center"
            title="Search Scripture (Cmd+K / Ctrl+K)"
          >
            <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>

          {/* Daily Bread / Verse of the Day (Desktop & Tablet) */}
          <button
            id="daily-verse-nav-btn"
            onClick={onOpenDailyVerse}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all hover:scale-105 active:scale-95"
            style={{
              borderColor: isDark ? '#334155' : '#e2d7be',
              backgroundColor: isDark ? 'rgba(217, 119, 6, 0.15)' : 'rgba(217, 119, 6, 0.08)',
              color: '#d97706',
            }}
            title="Verse of the Day & Devotional"
          >
            <Heart className="w-3.5 h-3.5 fill-amber-500/20" />
            <span>Daily Bread</span>
          </button>

          {/* Parallel / Split View Toggle (Desktop & Tablet) */}
          <button
            id="split-view-nav-btn"
            onClick={onToggleSplitView}
            className={`p-2 rounded-xl text-sm transition-colors hidden md:inline-flex ${
              settings.splitView ? 'bg-amber-700/20 text-amber-700 dark:text-amber-300' : 'hover:bg-black/5 dark:hover:bg-white/10 opacity-80 hover:opacity-100'
            }`}
            title="Toggle Parallel Translation View"
          >
            <Columns className="w-4 h-4" />
          </button>

          {/* Reading Plans (Desktop & Tablet) */}
          <button
            id="reading-plans-nav-btn"
            onClick={onOpenReadingPlans}
            className="p-2 rounded-xl text-sm transition-colors hidden md:inline-flex hover:bg-black/5 dark:hover:bg-white/10 opacity-80 hover:opacity-100"
            title="Reading Journeys & Plans"
          >
            <Calendar className="w-4 h-4" />
          </button>

          {/* Personal Library (Desktop & Tablet) */}
          <button
            id="personal-library-nav-btn"
            onClick={onOpenLibrary}
            className="p-2 rounded-xl text-sm transition-colors hidden md:inline-flex hover:bg-black/5 dark:hover:bg-white/10 opacity-80 hover:opacity-100"
            title="Notes, Highlights & Bookmarks"
          >
            <BookmarkIcon className="w-4 h-4" />
          </button>

          {/* AI Study Assistant (Desktop & Tablet) */}
          <button
            id="ai-assistant-nav-btn"
            onClick={onOpenAiAssistant}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-xs hover:opacity-95 transition-all hover:scale-105 active:scale-95"
            title="AI Scripture Companion"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Study</span>
          </button>

          {/* Theme Quick Cycle (Desktop & Tablet) */}
          <button
            id="theme-quick-toggle-btn"
            onClick={cycleTheme}
            className="p-2 rounded-xl text-sm transition-colors hidden sm:inline-flex hover:bg-black/5 dark:hover:bg-white/10 opacity-80 hover:opacity-100"
            title={`Current Theme: ${settings.theme}. Click to change.`}
          >
            {isDark ? (
              <Moon className="w-4 h-4 text-amber-300" />
            ) : (
              <Sun className="w-4 h-4 text-amber-600" />
            )}
          </button>

          {/* Reader Settings Drawer Trigger (Aa / Font / Theme) */}
          <button
            id="reader-settings-nav-btn"
            onClick={onOpenSettings}
            className="p-2 rounded-xl text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/10 opacity-90 hover:opacity-100 active:scale-95 flex items-center justify-center"
            title="Reader Display Settings (Aa)"
          >
            <Sliders className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
