import React, { useState, useMemo } from 'react';
import { Search, X, ChevronRight, BookOpen, Layers } from 'lucide-react';
import { BibleBook, Testament, BookCategory, ReaderSettings } from '../types';
import { BIBLE_BOOKS, BOOK_CATEGORIES } from '../data/bibleBooks';

interface BookSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBookId: string;
  currentChapter: number;
  onSelectPassage: (bookId: string, chapter: number, verse?: number) => void;
  settings: ReaderSettings;
}

export const BookSelectorModal: React.FC<BookSelectorModalProps> = ({
  isOpen,
  onClose,
  currentBookId,
  currentChapter,
  onSelectPassage,
  settings,
}) => {
  const [activeTestament, setActiveTestament] = useState<Testament | 'ALL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBook, setActiveBook] = useState<BibleBook>(
    BIBLE_BOOKS.find((b) => b.id === currentBookId) || BIBLE_BOOKS[0]
  );
  const [viewStep, setViewStep] = useState<'books' | 'chapters'>('books');

  const filteredBooks = useMemo(() => {
    return BIBLE_BOOKS.filter((book) => {
      const matchesSearch =
        book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.abbrev.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (book.theme && book.theme.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTestament =
        activeTestament === 'ALL' ? true : book.testament === activeTestament;

      const matchesCategory =
        selectedCategory === 'ALL' ? true : book.category === selectedCategory;

      return matchesSearch && matchesTestament && matchesCategory;
    });
  }, [searchQuery, activeTestament, selectedCategory]);

  if (!isOpen) return null;

  const handleBookClick = (book: BibleBook) => {
    setActiveBook(book);
    setViewStep('chapters');
  };

  const handleChapterClick = (chapterNum: number) => {
    onSelectPassage(activeBook.id, chapterNum, 1);
    onClose();
  };

  const isDark = settings.theme === 'dark' || settings.theme === 'midnight';

  return (
    <div 
      id="book-selector-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="book-selector-modal"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl h-[92vh] max-h-[92vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden transition-all"
        style={{
          backgroundColor:
            settings.theme === 'midnight' ? '#0b1120' :
            settings.theme === 'dark' ? '#18181b' :
            settings.theme === 'sepia' ? '#fbf4e6' :
            settings.theme === 'parchment' ? '#faf7f0' :
            '#ffffff',
          borderColor: isDark ? '#334155' : '#e2d9c8',
          color: isDark ? '#f8fafc' : '#1e293b',
        }}
      >
        {/* Modal Header */}
        <div 
          className="p-3.5 sm:p-5 border-b flex items-center justify-between gap-2 shrink-0"
          style={{ borderColor: isDark ? '#334155' : '#e8dec9' }}
        >
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-700/15 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="font-serif font-bold text-base sm:text-xl leading-tight truncate">
                {viewStep === 'books' ? 'Select Book & Chapter' : `${activeBook.name} — Select Chapter`}
              </h2>
              <p className="text-[11px] sm:text-xs opacity-70 truncate">
                {viewStep === 'books'
                  ? '66 Books of Holy Scripture'
                  : `${activeBook.chapters} Chapters • ${activeBook.category}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {viewStep === 'chapters' && (
              <button
                id="back-to-books-btn"
                onClick={() => setViewStep('books')}
                className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors hover:bg-black/5 dark:hover:bg-white/10 active:scale-95"
                style={{ borderColor: isDark ? '#475569' : '#d5cbb5' }}
              >
                ← All Books
              </button>
            )}
            <button
              id="close-book-selector-btn"
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl text-sm transition-colors hover:bg-black/10 dark:hover:bg-white/10 active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step 1: Books Browser */}
        {viewStep === 'books' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Search & Filters */}
            <div 
              className="p-3 sm:p-4 border-b space-y-2.5 shrink-0"
              style={{ borderColor: isDark ? '#1e293b' : '#f0e8d8' }}
            >
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
                <input
                  id="book-filter-search-input"
                  type="text"
                  placeholder="Filter books (e.g. Genesis, Romans, Psalms, John)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl text-xs sm:text-sm border outline-none transition-all focus:ring-2 focus:ring-amber-500/50"
                  style={{
                    backgroundColor: isDark ? '#0f172a' : '#f5efe3',
                    borderColor: isDark ? '#334155' : '#e0d5c1',
                  }}
                />
              </div>

              {/* Testament and Category Filters */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                {/* Testament Tabs */}
                <div className="grid grid-cols-3 sm:flex rounded-lg p-1 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 shrink-0 text-center">
                  {(['ALL', 'OT', 'NT'] as const).map((t) => (
                    <button
                      key={t}
                      id={`filter-testament-${t}`}
                      onClick={() => setActiveTestament(t)}
                      className={`px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-semibold transition-all ${
                        activeTestament === t
                          ? 'bg-amber-700 text-white shadow-xs'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      {t === 'ALL' ? 'All (66)' : t === 'OT' ? 'Old Test (39)' : 'New Test (27)'}
                    </button>
                  ))}
                </div>

                {/* Categories Horizontal Scroll */}
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 max-w-full">
                  <button
                    id="filter-category-all"
                    onClick={() => setSelectedCategory('ALL')}
                    className={`px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] whitespace-nowrap transition-colors border shrink-0 ${
                      selectedCategory === 'ALL'
                        ? 'bg-amber-600/20 text-amber-700 dark:text-amber-300 font-semibold border-amber-500/40'
                        : 'opacity-70 border-transparent hover:border-black/10 dark:hover:border-white/10'
                    }`}
                  >
                    All Genres
                  </button>
                  {BOOK_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      id={`filter-category-${cat.replace(/\s+/g, '-').toLowerCase()}`}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] whitespace-nowrap transition-colors border shrink-0 ${
                        selectedCategory === cat
                          ? 'bg-amber-600/20 text-amber-700 dark:text-amber-300 font-semibold border-amber-500/40'
                          : 'opacity-70 border-transparent hover:border-black/10 dark:hover:border-white/10'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Books Grid */}
            <div className="flex-1 overflow-y-auto p-2.5 sm:p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-2.5">
              {filteredBooks.map((book) => {
                const isCurrent = book.id === currentBookId;
                return (
                  <button
                    key={book.id}
                    id={`book-card-${book.id}`}
                    onClick={() => handleBookClick(book)}
                    className={`text-left p-2.5 sm:p-3 rounded-xl border transition-all hover:scale-[1.02] active:scale-[0.98] flex flex-col justify-between gap-1.5 group ${
                      isCurrent
                        ? 'ring-2 ring-amber-600 bg-amber-600/10'
                        : 'hover:shadow-xs'
                    }`}
                    style={{
                      backgroundColor: isCurrent 
                        ? (isDark ? 'rgba(217, 119, 6, 0.18)' : 'rgba(217, 119, 6, 0.12)')
                        : (isDark ? '#0f172a' : '#fbf8f2'),
                      borderColor: isCurrent ? '#d97706' : (isDark ? '#1e293b' : '#e6decb'),
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-serif font-bold text-xs sm:text-sm group-hover:text-amber-600 transition-colors truncate">
                          {book.name}
                        </span>
                        <span className="text-[9px] font-mono px-1 rounded bg-black/5 dark:bg-white/10 opacity-75 shrink-0">
                          {book.testament}
                        </span>
                      </div>
                      <p className="text-[10px] sm:text-[11px] opacity-65 line-clamp-1 mt-0.5">{book.category}</p>
                    </div>

                    <div className="flex items-center justify-between text-[10px] opacity-60 pt-1 border-t border-black/5 dark:border-white/5">
                      <span>{book.chapters} chaps</span>
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                );
              })}

              {filteredBooks.length === 0 && (
                <div className="col-span-full py-12 text-center opacity-60">
                  <Layers className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm font-medium">No scripture books match "{searchQuery}"</p>
                  <p className="text-xs mt-1">Try searching for a different name or clear the filter.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Chapters Grid for selected Book */}
        {viewStep === 'chapters' && (
          <div className="flex-1 flex flex-col overflow-hidden p-3 sm:p-6">
            {/* Book metadata banner */}
            <div 
              className="p-3 sm:p-4 rounded-xl border mb-3 sm:mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shrink-0"
              style={{
                backgroundColor: isDark ? '#0f172a' : '#f5efe0',
                borderColor: isDark ? '#334155' : '#ded4c0',
              }}
            >
              <div>
                <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold opacity-70">
                  {activeBook.testament === 'OT' ? 'Old Testament' : 'New Testament'} • {activeBook.category}
                </span>
                <h3 className="font-serif font-bold text-lg sm:text-2xl mt-0.5">{activeBook.name}</h3>
                {activeBook.theme && (
                  <p className="text-xs opacity-75 mt-0.5 line-clamp-1">Theme: {activeBook.theme}</p>
                )}
              </div>

              <div className="text-xs px-2.5 py-1 rounded-lg bg-amber-700/15 text-amber-700 dark:text-amber-300 font-medium shrink-0">
                {activeBook.chapters} Chapters
              </div>
            </div>

            {/* Chapters Grid (Touch friendly 44px min tap targets) */}
            <div className="flex-1 overflow-y-auto pr-1">
              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 sm:gap-2.5">
                {Array.from({ length: activeBook.chapters }, (_, i) => i + 1).map((chapNum) => {
                  const isCurrent = activeBook.id === currentBookId && chapNum === currentChapter;
                  return (
                    <button
                      key={chapNum}
                      id={`select-chapter-${activeBook.id}-${chapNum}`}
                      onClick={() => handleChapterClick(chapNum)}
                      className={`h-11 sm:h-12 rounded-xl font-serif font-bold text-sm sm:text-base border transition-all flex items-center justify-center hover:scale-105 active:scale-95 ${
                        isCurrent
                          ? 'bg-amber-700 text-white shadow-md border-amber-600'
                          : 'hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-300'
                      }`}
                      style={{
                        backgroundColor: isCurrent ? undefined : (isDark ? '#0f172a' : '#fbf8f2'),
                        borderColor: isCurrent ? undefined : (isDark ? '#1e293b' : '#e2d9c8'),
                      }}
                    >
                      {chapNum}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
