import React, { useState, useMemo } from 'react';
import { Search, X, BookOpen, Layers, ArrowRight, Sparkles } from 'lucide-react';
import { BibleBook, ReaderSettings, Testament } from '../types';
import { BIBLE_BOOKS } from '../data/bibleBooks';
import { FALLBACK_CHAPTERS, DAILY_VERSES } from '../data/fallbackBible';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToPassage: (bookId: string, chapter: number, verse?: number) => void;
  settings: ReaderSettings;
}

interface SearchResultItem {
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onNavigateToPassage,
  settings,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [testamentFilter, setTestamentFilter] = useState<Testament | 'ALL'>('ALL');
  const [selectedBookFilter, setSelectedBookFilter] = useState<string>('ALL');

  // Pre-index key scriptures for fast offline search
  const indexedVerses: SearchResultItem[] = useMemo(() => {
    const list: SearchResultItem[] = [];

    // From Fallback Chapters
    Object.values(FALLBACK_CHAPTERS).forEach((chap) => {
      chap.verses.forEach((v) => {
        list.push({
          bookId: v.book_id,
          bookName: v.book_name,
          chapter: v.chapter,
          verse: v.verse,
          text: v.text,
        });
      });
    });

    // From Daily Verses
    DAILY_VERSES.forEach((dv) => {
      const exists = list.some(
        (i) => i.bookId === dv.bookId && i.chapter === dv.chapter && i.verse === dv.verse
      );
      if (!exists) {
        const book = BIBLE_BOOKS.find((b) => b.id === dv.bookId);
        list.push({
          bookId: dv.bookId,
          bookName: book ? book.name : dv.bookId,
          chapter: dv.chapter,
          verse: dv.verse,
          text: dv.text,
        });
      }
    });

    return list;
  }, []);

  const results = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return [];

    return indexedVerses.filter((item) => {
      const book = BIBLE_BOOKS.find((b) => b.id === item.bookId);
      if (!book) return false;

      const matchesQuery = item.text.toLowerCase().includes(q) || `${item.bookName} ${item.chapter}:${item.verse}`.toLowerCase().includes(q);
      const matchesTestament = testamentFilter === 'ALL' || book.testament === testamentFilter;
      const matchesBook = selectedBookFilter === 'ALL' || book.id === selectedBookFilter;

      return matchesQuery && matchesTestament && matchesBook;
    });
  }, [searchTerm, testamentFilter, selectedBookFilter, indexedVerses]);

  if (!isOpen) return null;

  const handleSelectResult = (item: SearchResultItem) => {
    onNavigateToPassage(item.bookId, item.chapter, item.verse);
    onClose();
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-amber-400/50 dark:bg-amber-500/40 text-inherit font-semibold rounded px-0.5">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  const isDark = settings.theme === 'dark' || settings.theme === 'midnight';

  return (
    <div 
      id="search-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="search-modal"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl max-h-[90vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden transition-all"
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
        {/* Search Header */}
        <div 
          className="p-4 sm:p-5 border-b space-y-3"
          style={{ borderColor: isDark ? '#334155' : '#e8dec9' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-700/15 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                <Search className="w-4 h-4" />
              </div>
              <h2 className="font-serif font-bold text-lg">Search Scripture Concordance</h2>
            </div>

            <button
              id="close-search-modal-btn"
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Input Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 opacity-50" />
            <input
              id="scripture-search-query-input"
              type="text"
              placeholder="Search words, topics, or references (e.g. love, shepherd, peace, John 3:16)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border outline-none transition-all focus:ring-2 focus:ring-amber-500/50"
              style={{
                backgroundColor: isDark ? '#0f172a' : '#f5efe0',
                borderColor: isDark ? '#334155' : '#ded4c0',
              }}
              autoFocus
            />
          </div>

          {/* Filter options */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            {/* Testament Filter */}
            <div className="flex rounded-lg p-1 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
              {(['ALL', 'OT', 'NT'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTestamentFilter(t)}
                  className={`px-3 py-1 rounded-md font-semibold transition-all ${
                    testamentFilter === t
                      ? 'bg-amber-700 text-white shadow-xs'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  {t === 'ALL' ? 'All Bible' : t === 'OT' ? 'Old Testament' : 'New Testament'}
                </button>
              ))}
            </div>

            {/* Book Filter */}
            <select
              value={selectedBookFilter}
              onChange={(e) => setSelectedBookFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border text-xs outline-none"
              style={{
                backgroundColor: isDark ? '#0f172a' : '#f5efe0',
                borderColor: isDark ? '#334155' : '#ded4c0',
              }}
            >
              <option value="ALL">All Books</option>
              {BIBLE_BOOKS.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {searchTerm.trim() === '' && (
            <div className="py-12 text-center opacity-60 space-y-2">
              <Search className="w-10 h-10 mx-auto opacity-40" />
              <p className="font-serif text-sm font-medium">Type a word, phrase, or reference to search</p>
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
                {['faith', 'grace', 'light of the world', 'shepherd', 'prayer', 'creation'].map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setSearchTerm(topic)}
                    className="text-xs px-3 py-1 rounded-full border border-amber-600/30 text-amber-700 dark:text-amber-300 hover:bg-amber-600/10 transition-colors"
                  >
                    "{topic}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {searchTerm.trim() !== '' && results.length === 0 && (
            <div className="py-12 text-center opacity-60">
              <Layers className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="font-serif text-sm">No scripture verses found for "{searchTerm}"</p>
              <p className="text-xs mt-1">Try another keyword or broaden the testament filter.</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-2.5">
              <div className="text-xs font-semibold opacity-60 uppercase tracking-wider px-1">
                {results.length} Occurrences found
              </div>

              {results.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectResult(item)}
                  className="p-3.5 rounded-xl border cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] group space-y-1.5"
                  style={{
                    backgroundColor: isDark ? '#0f172a' : '#fcfaf5',
                    borderColor: isDark ? '#1e293b' : '#e6decb',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-xs sm:text-sm text-amber-700 dark:text-amber-400 group-hover:text-amber-600 transition-colors">
                      {item.bookName} {item.chapter}:{item.verse}
                    </span>
                    <span className="text-xs opacity-0 group-hover:opacity-100 flex items-center gap-1 text-amber-600 transition-opacity">
                      Read in context <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  <p className="font-serif text-xs sm:text-sm leading-relaxed opacity-85">
                    "{highlightMatch(item.text, searchTerm)}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
