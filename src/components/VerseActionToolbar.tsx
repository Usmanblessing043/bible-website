import React from 'react';
import { 
  Sparkles, 
  Bookmark, 
  FileText, 
  Copy, 
  Image as ImageIcon, 
  Columns, 
  Volume2, 
  X, 
  Check 
} from 'lucide-react';
import { BibleVerse, HighlightColor, ReaderSettings } from '../types';

interface VerseActionToolbarProps {
  selectedVerses: BibleVerse[];
  currentBookName: string;
  currentChapter: number;
  currentTranslation: string;
  isBookmarked: boolean;
  activeHighlightColor?: HighlightColor;
  onHighlight: (color: HighlightColor) => void;
  onRemoveHighlight: () => void;
  onToggleBookmark: () => void;
  onOpenNoteModal: () => void;
  onOpenCompareModal: () => void;
  onOpenAiStudy: () => void;
  onOpenCardGenerator: () => void;
  onListenFromVerse: () => void;
  onClearSelection: () => void;
  settings: ReaderSettings;
}

const HIGHLIGHT_PALETTE: { color: HighlightColor; label: string; bgClass: string; hex: string }[] = [
  { color: 'gold', label: 'Gold / Wisdom', bgClass: 'bg-amber-300 dark:bg-amber-500', hex: '#fcd34d' },
  { color: 'emerald', label: 'Emerald / Life', bgClass: 'bg-emerald-300 dark:bg-emerald-500', hex: '#6ee7b7' },
  { color: 'sky', label: 'Sky / Peace', bgClass: 'bg-sky-300 dark:bg-sky-500', hex: '#7dd3fc' },
  { color: 'rose', label: 'Rose / Love', bgClass: 'bg-rose-300 dark:bg-rose-500', hex: '#fda4af' },
  { color: 'lavender', label: 'Lavender / Prayer', bgClass: 'bg-purple-300 dark:bg-purple-500', hex: '#d8b4fe' },
];

export const VerseActionToolbar: React.FC<VerseActionToolbarProps> = ({
  selectedVerses,
  currentBookName,
  currentChapter,
  currentTranslation,
  isBookmarked,
  activeHighlightColor,
  onHighlight,
  onRemoveHighlight,
  onToggleBookmark,
  onOpenNoteModal,
  onOpenCompareModal,
  onOpenAiStudy,
  onOpenCardGenerator,
  onListenFromVerse,
  onClearSelection,
  settings,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (selectedVerses.length === 0) return null;

  const verseNumbers = selectedVerses.map((v) => v.verse).sort((a, b) => a - b);
  const verseRef =
    verseNumbers.length === 1
      ? `${currentBookName} ${currentChapter}:${verseNumbers[0]}`
      : `${currentBookName} ${currentChapter}:${verseNumbers[0]}-${verseNumbers[verseNumbers.length - 1]}`;

  const handleCopy = () => {
    const combinedText = selectedVerses
      .map((v) => `[${v.verse}] ${v.text}`)
      .join(' ');
    const formatted = `"${combinedText}" — ${verseRef} (${currentTranslation.toUpperCase()})`;
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isDark = settings.theme === 'dark' || settings.theme === 'midnight';

  return (
    <div 
      id="verse-action-toolbar-container"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4 animate-in slide-in-from-bottom-4 duration-200"
    >
      <div
        id="verse-action-toolbar"
        className="rounded-2xl border shadow-2xl p-2.5 sm:p-3 flex flex-col gap-2.5 backdrop-blur-md transition-all"
        style={{
          backgroundColor:
            settings.theme === 'midnight' ? 'rgba(15, 23, 42, 0.95)' :
            settings.theme === 'dark' ? 'rgba(24, 24, 27, 0.95)' :
            settings.theme === 'sepia' ? 'rgba(250, 243, 230, 0.96)' :
            settings.theme === 'parchment' ? 'rgba(252, 249, 242, 0.96)' :
            'rgba(255, 255, 255, 0.96)',
          borderColor: isDark ? '#334155' : '#e0d5be',
          color: isDark ? '#f8fafc' : '#1e293b',
        }}
      >
        {/* Top bar: Reference label + Highlights palette + Close */}
        <div className="flex items-center justify-between gap-2 border-b pb-2" style={{ borderColor: isDark ? '#1e293b' : '#eae1cd' }}>
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-xs sm:text-sm text-amber-700 dark:text-amber-400">
              {verseRef}
            </span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 opacity-70">
              {currentTranslation}
            </span>
          </div>

          {/* Color Highlighting Palette */}
          <div className="flex items-center gap-1.5">
            {HIGHLIGHT_PALETTE.map((item) => (
              <button
                key={item.color}
                id={`highlight-btn-${item.color}`}
                onClick={() => onHighlight(item.color)}
                title={`Highlight in ${item.label}`}
                className={`w-6 h-6 rounded-full transition-transform hover:scale-125 border ${item.bgClass} flex items-center justify-center ${
                  activeHighlightColor === item.color ? 'ring-2 ring-amber-600 scale-110' : 'opacity-80 hover:opacity-100'
                }`}
                style={{ borderColor: 'rgba(0,0,0,0.15)' }}
              >
                {activeHighlightColor === item.color && (
                  <Check className="w-3 h-3 text-black/70" />
                )}
              </button>
            ))}

            {activeHighlightColor && (
              <button
                id="remove-highlight-btn"
                onClick={onRemoveHighlight}
                className="text-[10px] underline ml-1 opacity-70 hover:opacity-100"
              >
                Clear
              </button>
            )}

            <button
              id="clear-verse-selection-btn"
              onClick={onClearSelection}
              className="p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 ml-2"
              title="Deselect"
            >
              <X className="w-4 h-4 opacity-70" />
            </button>
          </div>
        </div>

        {/* Bottom Actions Row */}
        <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar py-0.5">
          {/* AI Theological Study */}
          <button
            id="verse-ai-study-btn"
            onClick={onOpenAiStudy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-xs hover:opacity-90 active:scale-95 transition-all whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Study</span>
          </button>

          {/* Bookmark */}
          <button
            id="verse-bookmark-btn"
            onClick={onToggleBookmark}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all whitespace-nowrap ${
              isBookmarked
                ? 'bg-amber-600/20 text-amber-700 dark:text-amber-300 border-amber-500/40'
                : 'hover:bg-black/5 dark:hover:bg-white/5 border-transparent'
            }`}
            title="Bookmark verse"
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
            <span className="hidden sm:inline">{isBookmarked ? 'Saved' : 'Bookmark'}</span>
          </button>

          {/* Add Study Note */}
          <button
            id="verse-note-btn"
            onClick={onOpenNoteModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-all whitespace-nowrap"
            title="Write a personal study note"
          >
            <FileText className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span className="hidden sm:inline">Note</span>
          </button>

          {/* Compare Translations */}
          <button
            id="verse-compare-btn"
            onClick={onOpenCompareModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-all whitespace-nowrap"
            title="Compare across Bible versions"
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Compare</span>
          </button>

          {/* Create Verse Quote Card */}
          <button
            id="verse-card-btn"
            onClick={onOpenCardGenerator}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-all whitespace-nowrap"
            title="Create shareable scripture card"
          >
            <ImageIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">Card</span>
          </button>

          {/* Audio Read From Here */}
          <button
            id="verse-listen-btn"
            onClick={onListenFromVerse}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-all whitespace-nowrap"
            title="Listen to audio starting from this verse"
          >
            <Volume2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span className="hidden sm:inline">Listen</span>
          </button>

          {/* Copy Verse */}
          <button
            id="verse-copy-btn"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-all whitespace-nowrap"
            title="Copy verse with citation"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
