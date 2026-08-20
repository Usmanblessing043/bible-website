import React, { useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Bookmark as BookmarkIcon, 
  FileText, 
  Volume2, 
  Sparkles,
  RefreshCw,
  Eye,
  Info
} from 'lucide-react';
import { 
  BibleChapter, 
  BibleVerse, 
  BibleBook, 
  ReaderSettings, 
  Highlight, 
  Bookmark, 
  StudyNote 
} from '../types';

interface BibleReaderProps {
  primaryChapter: BibleChapter | null;
  secondaryChapter: BibleChapter | null;
  currentBook: BibleBook;
  currentChapterNum: number;
  isLoading: boolean;
  error: string | null;
  selectedVerses: BibleVerse[];
  highlights: Highlight[];
  bookmarks: Bookmark[];
  notes: StudyNote[];
  activeAudioVerse: number | null;
  settings: ReaderSettings;
  onToggleVerseSelect: (verse: BibleVerse) => void;
  onPrevChapter: () => void;
  onNextChapter: () => void;
  onOpenAiStudy: () => void;
  onOpenNoteForVerse: (verseNum: number) => void;
  onRetry: () => void;
}

export const BibleReader: React.FC<BibleReaderProps> = ({
  primaryChapter,
  secondaryChapter,
  currentBook,
  currentChapterNum,
  isLoading,
  error,
  selectedVerses,
  highlights,
  bookmarks,
  notes,
  activeAudioVerse,
  settings,
  onToggleVerseSelect,
  onPrevChapter,
  onNextChapter,
  onOpenAiStudy,
  onOpenNoteForVerse,
  onRetry,
}) => {
  const activeVerseRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to active audio verse if enabled
  useEffect(() => {
    if (settings.autoScrollAudio && activeAudioVerse && activeVerseRef.current) {
      activeVerseRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeAudioVerse, settings.autoScrollAudio]);

  const getHighlightForVerse = (verseNum: number): Highlight | undefined => {
    return highlights.find(
      (h) => h.bookId === currentBook.id && h.chapter === currentChapterNum && h.verse === verseNum
    );
  };

  const isVerseBookmarked = (verseNum: number): boolean => {
    return bookmarks.some(
      (b) => b.bookId === currentBook.id && b.chapter === currentChapterNum && b.verse === verseNum
    );
  };

  const getNoteForVerse = (verseNum: number): StudyNote | undefined => {
    return notes.find(
      (n) => n.bookId === currentBook.id && n.chapter === currentChapterNum && n.verse === verseNum
    );
  };

  const isVerseSelected = (verseNum: number): boolean => {
    return selectedVerses.some((v) => v.verse === verseNum);
  };

  // Theme styles helper
  const getThemeStyles = () => {
    switch (settings.theme) {
      case 'midnight':
        return {
          bg: '#080d1a',
          cardBg: '#0f172a',
          text: '#e2e8f0',
          mutedText: '#94a3b8',
          border: '#1e293b',
          accent: '#f59e0b',
          redLetter: '#f87171',
          highlightGold: 'rgba(245, 158, 11, 0.28)',
          highlightEmerald: 'rgba(16, 185, 129, 0.28)',
          highlightSky: 'rgba(14, 165, 233, 0.28)',
          highlightRose: 'rgba(244, 63, 94, 0.28)',
          highlightLavender: 'rgba(168, 85, 247, 0.28)',
        };
      case 'dark':
        return {
          bg: '#18181b',
          cardBg: '#27272a',
          text: '#f4f4f5',
          mutedText: '#a1a1aa',
          border: '#3f3f46',
          accent: '#fbbf24',
          redLetter: '#f87171',
          highlightGold: 'rgba(245, 158, 11, 0.25)',
          highlightEmerald: 'rgba(16, 185, 129, 0.25)',
          highlightSky: 'rgba(14, 165, 233, 0.25)',
          highlightRose: 'rgba(244, 63, 94, 0.25)',
          highlightLavender: 'rgba(168, 85, 247, 0.25)',
        };
      case 'sepia':
        return {
          bg: '#f6eedb',
          cardBg: '#ede0c8',
          text: '#3c2817',
          mutedText: '#7c654e',
          border: '#dec9a8',
          accent: '#b45309',
          redLetter: '#991b1b',
          highlightGold: 'rgba(253, 224, 71, 0.55)',
          highlightEmerald: 'rgba(110, 231, 183, 0.55)',
          highlightSky: 'rgba(125, 211, 252, 0.55)',
          highlightRose: 'rgba(253, 164, 175, 0.55)',
          highlightLavender: 'rgba(216, 180, 254, 0.55)',
        };
      case 'parchment':
        return {
          bg: '#faf7f0',
          cardBg: '#f2ecde',
          text: '#2b231d',
          mutedText: '#6e6155',
          border: '#e4dac5',
          accent: '#b45309',
          redLetter: '#991b1b',
          highlightGold: 'rgba(254, 240, 138, 0.65)',
          highlightEmerald: 'rgba(167, 243, 208, 0.65)',
          highlightSky: 'rgba(186, 230, 253, 0.65)',
          highlightRose: 'rgba(254, 205, 211, 0.65)',
          highlightLavender: 'rgba(233, 213, 255, 0.65)',
        };
      case 'light':
      default:
        return {
          bg: '#ffffff',
          cardBg: '#f8fafc',
          text: '#0f172a',
          mutedText: '#64748b',
          border: '#e2e8f0',
          accent: '#d97706',
          redLetter: '#b91c1c',
          highlightGold: 'rgba(254, 240, 138, 0.6)',
          highlightEmerald: 'rgba(167, 243, 208, 0.6)',
          highlightSky: 'rgba(186, 230, 253, 0.6)',
          highlightRose: 'rgba(254, 205, 211, 0.6)',
          highlightLavender: 'rgba(233, 213, 255, 0.6)',
        };
    }
  };

  const themeStyle = getThemeStyles();

  const getFontFamilyClass = () => {
    switch (settings.fontFamily) {
      case 'serif':
        return 'font-serif';
      case 'garamond':
        return 'font-serif tracking-wide';
      case 'sans':
        return 'font-sans';
      case 'mono':
        return 'font-mono text-sm';
      default:
        return 'font-serif';
    }
  };

  const getHighlightBg = (color?: string) => {
    if (!color) return 'transparent';
    switch (color) {
      case 'gold':
        return themeStyle.highlightGold;
      case 'emerald':
        return themeStyle.highlightEmerald;
      case 'sky':
        return themeStyle.highlightSky;
      case 'rose':
        return themeStyle.highlightRose;
      case 'lavender':
        return themeStyle.highlightLavender;
      default:
        return themeStyle.highlightGold;
    }
  };

  return (
    <main 
      id="bible-reader-canvas"
      className="flex-1 w-full min-h-[calc(100vh-4rem)] transition-colors duration-300 relative py-8 px-4 sm:px-8"
      style={{
        backgroundColor: themeStyle.bg,
        color: themeStyle.text,
      }}
    >
      {/* Floating Side Navigation Arrows (Desktop) */}
      <button
        id="desktop-prev-chapter-btn"
        onClick={onPrevChapter}
        aria-label="Previous Chapter"
        className="fixed left-4 top-1/2 -translate-y-1/2 hidden xl:flex items-center justify-center w-12 h-12 rounded-full border shadow-md transition-all hover:scale-110 active:scale-95 opacity-70 hover:opacity-100 z-20"
        style={{
          backgroundColor: themeStyle.cardBg,
          borderColor: themeStyle.border,
          color: themeStyle.text,
        }}
        title="Previous Chapter"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        id="desktop-next-chapter-btn"
        onClick={onNextChapter}
        aria-label="Next Chapter"
        className="fixed right-4 top-1/2 -translate-y-1/2 hidden xl:flex items-center justify-center w-12 h-12 rounded-full border shadow-md transition-all hover:scale-110 active:scale-95 opacity-70 hover:opacity-100 z-20"
        style={{
          backgroundColor: themeStyle.cardBg,
          borderColor: themeStyle.border,
          color: themeStyle.text,
        }}
        title="Next Chapter"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Scripture Container */}
      <div className="max-w-4xl mx-auto">
        {/* Loading State */}
        {isLoading && (
          <div className="py-24 flex flex-col items-center justify-center gap-3 animate-in fade-in duration-300">
            <div className="w-10 h-10 border-3 border-amber-600 border-t-transparent rounded-full animate-spin" />
            <p className="font-serif text-sm opacity-70">
              Opening {currentBook.name} {currentChapterNum}...
            </p>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div 
            className="p-8 rounded-2xl border text-center space-y-4 my-12"
            style={{ backgroundColor: themeStyle.cardBg, borderColor: themeStyle.border }}
          >
            <Info className="w-8 h-8 mx-auto text-amber-600 opacity-80" />
            <h3 className="font-serif font-bold text-lg">Unable to load passage</h3>
            <p className="text-sm opacity-75 max-w-md mx-auto">{error}</p>
            <button
              id="retry-fetch-chapter-btn"
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-700 text-white hover:opacity-90 transition-opacity shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Scripture</span>
            </button>
          </div>
        )}

        {/* Content View */}
        {!isLoading && primaryChapter && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Chapter Header */}
            <div className="text-center pb-6 border-b space-y-2" style={{ borderColor: themeStyle.border }}>
              <span className="text-xs uppercase font-semibold tracking-widest text-amber-600 dark:text-amber-400">
                {currentBook.testament === 'OT' ? 'Old Testament' : 'New Testament'} • {currentBook.category}
              </span>
              <h1 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight">
                {currentBook.name} {currentChapterNum}
              </h1>
              <div className="flex items-center justify-center gap-2 pt-1">
                <span className="text-xs font-mono uppercase px-2 py-0.5 rounded border" style={{ borderColor: themeStyle.border }}>
                  {primaryChapter.translation_name || primaryChapter.translation.toUpperCase()}
                </span>
                {settings.splitView && secondaryChapter && (
                  <span className="text-xs font-mono uppercase px-2 py-0.5 rounded border text-amber-600 dark:text-amber-300" style={{ borderColor: themeStyle.border }}>
                    vs. {secondaryChapter.translation_name || secondaryChapter.translation.toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            {/* Split View (Parallel Translations) or Single View */}
            {settings.splitView && secondaryChapter ? (
              /* PARALLEL VIEW */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Column 1: Primary Translation */}
                <div className="space-y-4">
                  <div className="sticky top-18 z-10 py-1 font-serif font-bold text-sm text-amber-700 dark:text-amber-400 border-b" style={{ borderColor: themeStyle.border, backgroundColor: themeStyle.bg }}>
                    {primaryChapter.translation_name || primaryChapter.translation.toUpperCase()}
                  </div>
                  <div 
                    className={`space-y-3 ${getFontFamilyClass()}`}
                    style={{ fontSize: `${settings.fontSize}px`, lineHeight: settings.lineHeight }}
                  >
                    {primaryChapter.verses.map((verse) => {
                      const highlight = getHighlightForVerse(verse.verse);
                      const isSelected = isVerseSelected(verse.verse);
                      const isBookmarked = isVerseBookmarked(verse.verse);
                      const note = getNoteForVerse(verse.verse);
                      const isAudioActive = activeAudioVerse === verse.verse;

                      return (
                        <div
                          key={`prim-${verse.verse}`}
                          id={`verse-prim-${verse.verse}`}
                          ref={isAudioActive ? activeVerseRef : null}
                          onClick={() => onToggleVerseSelect(verse)}
                          className={`group relative p-2 rounded-xl cursor-pointer transition-all ${
                            isSelected ? 'ring-2 ring-amber-600 shadow-xs' : 'hover:bg-black/5 dark:hover:bg-white/5'
                          } ${isAudioActive ? 'ring-2 ring-amber-500 bg-amber-500/15' : ''}`}
                          style={{
                            backgroundColor: highlight ? getHighlightBg(highlight.color) : undefined,
                          }}
                        >
                          {settings.showVerseNumbers && (
                            <sup className="font-sans font-bold text-xs mr-1.5 opacity-60 select-none text-amber-700 dark:text-amber-400">
                              {verse.verse}
                            </sup>
                          )}
                          <span
                            style={{
                              color:
                                settings.redLetter && verse.isWordsOfJesus
                                  ? themeStyle.redLetter
                                  : undefined,
                            }}
                          >
                            {verse.text}
                          </span>
                          {/* Note / Bookmark badges */}
                          <div className="inline-flex items-center gap-1 ml-1.5 align-middle">
                            {isBookmarked && (
                              <BookmarkIcon className="w-3.5 h-3.5 text-amber-600 fill-current inline opacity-90" />
                            )}
                            {note && (
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenNoteForVerse(verse.verse);
                                }}
                                className="inline-flex p-0.5 rounded hover:bg-amber-600/20 text-amber-700 dark:text-amber-300"
                                title={`Note: ${note.title}`}
                              >
                                <FileText className="w-3.5 h-3.5" />
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Column 2: Secondary Translation */}
                <div className="space-y-4">
                  <div className="sticky top-18 z-10 py-1 font-serif font-bold text-sm text-sky-700 dark:text-sky-400 border-b" style={{ borderColor: themeStyle.border, backgroundColor: themeStyle.bg }}>
                    {secondaryChapter.translation_name || secondaryChapter.translation.toUpperCase()}
                  </div>
                  <div 
                    className={`space-y-3 ${getFontFamilyClass()}`}
                    style={{ fontSize: `${settings.fontSize}px`, lineHeight: settings.lineHeight }}
                  >
                    {secondaryChapter.verses.map((verse) => (
                      <div
                        key={`sec-${verse.verse}`}
                        id={`verse-sec-${verse.verse}`}
                        className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                      >
                        {settings.showVerseNumbers && (
                          <sup className="font-sans font-bold text-xs mr-1.5 opacity-60 select-none text-sky-700 dark:text-sky-400">
                            {verse.verse}
                          </sup>
                        )}
                        <span>{verse.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* SINGLE VIEW (Paragraph or Verse-by-Verse) */
              <div
                id="scripture-text-body"
                className={`${getFontFamilyClass()} select-text`}
                style={{
                  fontSize: `${settings.fontSize}px`,
                  lineHeight: settings.lineHeight,
                }}
              >
                {settings.viewMode === 'verse-by-verse' ? (
                  /* Verse by Verse List */
                  <div className="space-y-3.5">
                    {primaryChapter.verses.map((verse) => {
                      const highlight = getHighlightForVerse(verse.verse);
                      const isSelected = isVerseSelected(verse.verse);
                      const isBookmarked = isVerseBookmarked(verse.verse);
                      const note = getNoteForVerse(verse.verse);
                      const isAudioActive = activeAudioVerse === verse.verse;

                      return (
                        <div
                          key={verse.verse}
                          id={`verse-item-${verse.verse}`}
                          ref={isAudioActive ? activeVerseRef : null}
                          onClick={() => onToggleVerseSelect(verse)}
                          className={`group relative p-2.5 sm:p-3 rounded-xl cursor-pointer transition-all duration-150 flex items-start gap-3 ${
                            isSelected
                              ? 'ring-2 ring-amber-600 shadow-xs'
                              : 'hover:bg-black/5 dark:hover:bg-white/5'
                          } ${isAudioActive ? 'ring-2 ring-amber-500 bg-amber-500/15' : ''}`}
                          style={{
                            backgroundColor: highlight ? getHighlightBg(highlight.color) : undefined,
                          }}
                        >
                          {settings.showVerseNumbers && (
                            <span className="font-sans font-bold text-xs pt-1 px-1.5 rounded bg-black/5 dark:bg-white/10 select-none text-amber-700 dark:text-amber-400 shrink-0">
                              {verse.verse}
                            </span>
                          )}

                          <div className="flex-1">
                            <span
                              style={{
                                color:
                                  settings.redLetter && verse.isWordsOfJesus
                                    ? themeStyle.redLetter
                                    : undefined,
                              }}
                            >
                              {verse.text}
                            </span>

                            {/* Badges */}
                            <div className="inline-flex items-center gap-1.5 ml-2 align-middle">
                              {isBookmarked && (
                                <BookmarkIcon className="w-3.5 h-3.5 text-amber-600 fill-current inline opacity-90" />
                              )}
                              {note && (
                                <button
                                  id={`open-note-btn-${verse.verse}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onOpenNoteForVerse(verse.verse);
                                  }}
                                  className="inline-flex p-0.5 rounded hover:bg-amber-600/20 text-amber-700 dark:text-amber-300"
                                  title={`Study Note: ${note.title}`}
                                >
                                  <FileText className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* Continuous Paragraph Mode */
                  <div className="space-y-4 text-justify">
                    <p className="leading-relaxed">
                      {primaryChapter.verses.map((verse) => {
                        const highlight = getHighlightForVerse(verse.verse);
                        const isSelected = isVerseSelected(verse.verse);
                        const isBookmarked = isVerseBookmarked(verse.verse);
                        const note = getNoteForVerse(verse.verse);
                        const isAudioActive = activeAudioVerse === verse.verse;

                        return (
                          <span
                            key={verse.verse}
                            id={`verse-span-${verse.verse}`}
                            ref={isAudioActive ? activeVerseRef : null}
                            onClick={() => onToggleVerseSelect(verse)}
                            className={`inline cursor-pointer px-1 py-0.5 rounded transition-all duration-150 ${
                              isSelected ? 'ring-2 ring-amber-600 bg-amber-600/20' : 'hover:bg-amber-500/15'
                            } ${isAudioActive ? 'ring-2 ring-amber-500 bg-amber-500/25' : ''}`}
                            style={{
                              backgroundColor: highlight ? getHighlightBg(highlight.color) : undefined,
                            }}
                          >
                            {settings.showVerseNumbers && (
                              <sup className="font-sans font-bold text-xs mr-1 opacity-60 select-none text-amber-700 dark:text-amber-400">
                                {verse.verse}
                              </sup>
                            )}
                            <span
                              style={{
                                color:
                                  settings.redLetter && verse.isWordsOfJesus
                                    ? themeStyle.redLetter
                                    : undefined,
                              }}
                            >
                              {verse.text}{' '}
                            </span>
                            {isBookmarked && (
                              <BookmarkIcon className="w-3 h-3 text-amber-600 fill-current inline-block mr-1 align-baseline" />
                            )}
                            {note && (
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenNoteForVerse(verse.verse);
                                }}
                                className="inline-block cursor-pointer text-amber-700 dark:text-amber-300 mr-1"
                                title={`Note: ${note.title}`}
                              >
                                <FileText className="w-3 h-3 inline" />
                              </span>
                            )}
                          </span>
                        );
                      })}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Chapter Navigation Footer */}
            <div 
              className="pt-10 pb-16 flex flex-col sm:flex-row items-center justify-between gap-4 border-t"
              style={{ borderColor: themeStyle.border }}
            >
              <button
                id="footer-prev-chapter-btn"
                onClick={onPrevChapter}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border font-serif font-semibold text-sm transition-all hover:scale-105 active:scale-95 shadow-xs"
                style={{
                  backgroundColor: themeStyle.cardBg,
                  borderColor: themeStyle.border,
                }}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Chapter</span>
              </button>

              <button
                id="footer-ai-insights-btn"
                onClick={onOpenAiStudy}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-700/15 text-amber-700 dark:text-amber-300 hover:bg-amber-700/25 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Chapter Commentary & Insights</span>
              </button>

              <button
                id="footer-next-chapter-btn"
                onClick={onNextChapter}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border font-serif font-semibold text-sm transition-all hover:scale-105 active:scale-95 shadow-xs"
                style={{
                  backgroundColor: themeStyle.cardBg,
                  borderColor: themeStyle.border,
                }}
              >
                <span>Next Chapter</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
