import React, { useState } from 'react';
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
  isAudioBarActive?: boolean;
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
  isAudioBarActive = false,
}) => {
  const [copied, setCopied] = useState(false);

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

  // Compute bottom positioning for mobile so it never collides with BottomNav or AudioPlayerBar
  const bottomClasses = isAudioBarActive 
    ? 'bottom-32 md:bottom-20' 
    : 'bottom-20 md:bottom-6';

  return (
    <div 
      id="verse-action-toolbar-container"
      className={`fixed ${bottomClasses} left-1/2 -translate-x-1/2 z-40 w-full max-w-xl px-3 sm:px-4 animate-in slide-in-from-bottom-4 duration-200 transition-all`}
    >
      <div
        id="verse-action-toolbar"
        className="rounded-2xl border shadow-2xl p-2.5 sm:p-3 flex flex-col gap-2 backdrop-blur-lg transition-all"
        style={{
          backgroundColor:
            settings.theme === 'midnight' ? 'rgba(15, 23, 42, 0.96)' :
            settings.theme === 'dark' ? 'rgba(24, 24, 27, 0.96)' :
            settings.theme === 'sepia' ? 'rgba(250, 243, 230, 0.97)' :
            settings.theme === 'parchment' ? 'rgba(252, 249, 242, 0.97)' :
            'rgba(255, 255, 255, 0.97)',
          borderColor: isDark ? '#334155' : '#ded3bd',
          color: isDark ? '#f8fafc' : '#1e293b',
        }}
      >
        {/* Top row: Reference indicator & Highlight Color Palette & Deselect */}
        <div className="flex items-center justify-between gap-2 border-b pb-2" style={{ borderColor: isDark ? '#1e293b' : '#eae1cd' }}>
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-serif font-bold text-xs sm:text-sm text-amber-700 dark:text-amber-400 truncate">
              {verseRef}
            </span>
            <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 opacity-70 shrink-0">
              {currentTranslation}
            </span>
          </div>

          {/* Color Highlighting Palette */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {HIGHLIGHT_PALETTE.map((item) => (
              <button
                key={item.color}
                id={`highlight-btn-${item.color}`}
                onClick={() => onHighlight(item.color)}
                title={`Highlight in ${item.label}`}
                className={`w-7 h-7 sm:w-6 sm:h-6 rounded-full transition-transform hover:scale-115 active:scale-95 border ${item.bgClass} flex items-center justify-center ${
                  activeHighlightColor === item.color ? 'ring-2 ring-amber-600 scale-110 shadow-xs' : 'opacity-85 hover:opacity-100'
                }`}
                style={{ borderColor: 'rgba(0,0,0,0.18)' }}
              >
                {activeHighlightColor === item.color && (
                  <Check className="w-3 h-3 text-black/75 stroke-[3]" />
                )}
              </button>
            ))}

            {activeHighlightColor && (
              <button
                id="remove-highlight-btn"
                onClick={onRemoveHighlight}
                className="text-[10px] underline ml-0.5 opacity-70 hover:opacity-100 px-1 py-0.5"
              >
                Clear
              </button>
            )}

            <button
              id="clear-verse-selection-btn"
              onClick={onClearSelection}
              className="p-1 sm:p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 ml-1 opacity-75 hover:opacity-100"
              title="Deselect verse"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Actions Row (Smooth horizontal scrolling on small mobile screens) */}
        <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar py-0.5 px-0.5">
          {/* AI Theological Study */}
          <button
            id="verse-ai-study-btn"
            onClick={onOpenAiStudy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-xs hover:opacity-90 active:scale-95 transition-all shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Study</span>
          </button>

          {/* Bookmark */}
          <button
            id="verse-bookmark-btn"
            onClick={onToggleBookmark}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all shrink-0 ${
              isBookmarked
                ? 'bg-amber-600/20 text-amber-700 dark:text-amber-300 border-amber-500/40'
                : 'hover:bg-black/5 dark:hover:bg-white/5 border-transparent'
            }`}
            title="Bookmark verse"
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
            <span>{isBookmarked ? 'Saved' : 'Save'}</span>
          </button>

          {/* Add Study Note */}
          <button
            id="verse-note-btn"
            onClick={onOpenNoteModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-all shrink-0"
            title="Write a personal study note"
          >
            <FileText className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Note</span>
          </button>

          {/* Compare Translations */}
          <button
            id="verse-compare-btn"
            onClick={onOpenCompareModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-all shrink-0"
            title="Compare across Bible versions"
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Compare</span>
          </button>

          {/* Create Verse Quote Card */}
          <button
            id="verse-card-btn"
            onClick={onOpenCardGenerator}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-all shrink-0"
            title="Create shareable scripture card"
          >
            <ImageIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Card</span>
          </button>

          {/* Audio Read From Here */}
          <button
            id="verse-listen-btn"
            onClick={onListenFromVerse}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-all shrink-0"
            title="Listen to audio starting from this verse"
          >
            <Volume2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>Listen</span>
          </button>

          {/* Copy Verse */}
          <button
            id="verse-copy-btn"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-all shrink-0"
            title="Copy verse with citation"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
