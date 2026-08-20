import React, { useState } from 'react';
import { 
  Bookmark as BookmarkIcon, 
  FileText, 
  Highlighter, 
  X, 
  Trash2, 
  ArrowRight, 
  Download, 
  Search,
  BookOpen
} from 'lucide-react';
import { Highlight, Bookmark, StudyNote, HighlightColor, ReaderSettings } from '../types';

interface PersonalLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  highlights: Highlight[];
  bookmarks: Bookmark[];
  notes: StudyNote[];
  onDeleteHighlight: (id: string) => void;
  onDeleteBookmark: (id: string) => void;
  onDeleteNote: (id: string) => void;
  onEditNote: (note: StudyNote) => void;
  onNavigateToVerse: (bookId: string, chapter: number, verse: number) => void;
  settings: ReaderSettings;
}

export const PersonalLibraryModal: React.FC<PersonalLibraryModalProps> = ({
  isOpen,
  onClose,
  highlights,
  bookmarks,
  notes,
  onDeleteHighlight,
  onDeleteBookmark,
  onDeleteNote,
  onEditNote,
  onNavigateToVerse,
  settings,
}) => {
  const [activeTab, setActiveTab] = useState<'notes' | 'highlights' | 'bookmarks'>('notes');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColor, setSelectedColor] = useState<HighlightColor | 'ALL'>('ALL');

  if (!isOpen) return null;

  const handleExportData = () => {
    const exportObject = {
      exportedAt: new Date().toISOString(),
      bookmarks,
      highlights,
      notes,
    };
    const blob = new Blob([JSON.stringify(exportObject, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scripture_study_library_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredNotes = notes.filter((n) => {
    const q = searchQuery.toLowerCase();
    return (
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q) ||
      n.bookName.toLowerCase().includes(q) ||
      n.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const filteredHighlights = highlights.filter((h) => {
    const matchesColor = selectedColor === 'ALL' || h.color === selectedColor;
    const matchesSearch =
      h.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.bookName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesColor && matchesSearch;
  });

  const filteredBookmarks = bookmarks.filter((b) =>
    b.bookName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.snippet.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isDark = settings.theme === 'dark' || settings.theme === 'midnight';

  return (
    <div 
      id="personal-library-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="personal-library-modal"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl max-h-[90vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden transition-all"
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
        {/* Header */}
        <div 
          className="p-4 sm:p-5 border-b flex items-center justify-between gap-3"
          style={{ borderColor: isDark ? '#334155' : '#e8dec9' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-700/15 text-amber-700 dark:text-amber-300 flex items-center justify-center">
              <BookmarkIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg sm:text-xl">My Scripture Library</h2>
              <p className="text-xs opacity-70">Saved Notes, Highlights & Bookmarked Verses</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="export-library-btn"
              onClick={handleExportData}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors hover:bg-black/5 dark:hover:bg-white/10"
              style={{ borderColor: isDark ? '#475569' : '#d5cbb5' }}
              title="Backup & Export Library"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>

            <button
              id="close-personal-library-btn"
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab switcher & Search */}
        <div 
          className="p-3 sm:p-4 border-b space-y-3"
          style={{ borderColor: isDark ? '#1e293b' : '#f0e8d8' }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Tabs */}
            <div className="flex rounded-xl p-1 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 w-full sm:w-auto">
              <button
                id="tab-study-notes"
                onClick={() => setActiveTab('notes')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'notes'
                    ? 'bg-amber-700 text-white shadow-xs'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Notes ({notes.length})</span>
              </button>

              <button
                id="tab-highlights"
                onClick={() => setActiveTab('highlights')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'highlights'
                    ? 'bg-amber-700 text-white shadow-xs'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                <Highlighter className="w-3.5 h-3.5" />
                <span>Highlights ({highlights.length})</span>
              </button>

              <button
                id="tab-bookmarks"
                onClick={() => setActiveTab('bookmarks')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'bookmarks'
                    ? 'bg-amber-700 text-white shadow-xs'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                <BookmarkIcon className="w-3.5 h-3.5" />
                <span>Bookmarks ({bookmarks.length})</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
              <input
                type="text"
                placeholder="Filter saved items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs border outline-none"
                style={{
                  backgroundColor: isDark ? '#0f172a' : '#f5efe0',
                  borderColor: isDark ? '#334155' : '#ded4c0',
                }}
              />
            </div>
          </div>

          {/* Color Filter for Highlights */}
          {activeTab === 'highlights' && (
            <div className="flex items-center gap-2 text-xs pt-1">
              <span className="opacity-60 text-[11px] uppercase tracking-wider font-semibold">Filter Color:</span>
              <button
                onClick={() => setSelectedColor('ALL')}
                className={`px-2 py-0.5 rounded text-[11px] ${selectedColor === 'ALL' ? 'font-bold underline' : 'opacity-70'}`}
              >
                All
              </button>
              {(['gold', 'emerald', 'sky', 'rose', 'lavender'] as HighlightColor[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  className={`w-4 h-4 rounded-full border ${
                    selectedColor === c ? 'ring-2 ring-amber-600 scale-125' : 'opacity-60'
                  }`}
                  style={{
                    backgroundColor:
                      c === 'gold' ? '#fcd34d' :
                      c === 'emerald' ? '#6ee7b7' :
                      c === 'sky' ? '#7dd3fc' :
                      c === 'rose' ? '#fda4af' :
                      '#d8b4fe',
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content Lists */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {/* NOTES LIST */}
          {activeTab === 'notes' && (
            <div className="space-y-3">
              {filteredNotes.length === 0 && (
                <div className="py-16 text-center opacity-60">
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="font-serif text-sm">No study notes found.</p>
                  <p className="text-xs mt-1">Select any verse while reading and click "Note" to write reflections.</p>
                </div>
              )}

              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-4 rounded-xl border space-y-2.5 transition-all hover:border-amber-500/40"
                  style={{
                    backgroundColor: isDark ? '#0f172a' : '#fcfaf5',
                    borderColor: isDark ? '#1e293b' : '#e6decb',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-serif font-bold text-sm text-amber-700 dark:text-amber-400">
                        {note.bookName} {note.chapter}:{note.verse}
                      </span>
                      <h4 className="font-serif font-bold text-base mt-0.5">{note.title}</h4>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          onNavigateToVerse(note.bookId, note.chapter, note.verse);
                          onClose();
                        }}
                        className="p-1.5 rounded-lg text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/10 flex items-center gap-1"
                        title="Jump to verse in Bible"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Read</span>
                      </button>
                      <button
                        onClick={() => onDeleteNote(note.id)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                        title="Delete note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="font-serif text-xs opacity-75 italic line-clamp-1 border-l-2 border-amber-600/30 pl-2">
                    "{note.verseText}"
                  </p>

                  <p className="text-xs sm:text-sm whitespace-pre-line leading-relaxed opacity-90">
                    {note.content}
                  </p>

                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {note.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-amber-600/10 text-amber-700 dark:text-amber-300 font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* HIGHLIGHTS LIST */}
          {activeTab === 'highlights' && (
            <div className="space-y-3">
              {filteredHighlights.length === 0 && (
                <div className="py-16 text-center opacity-60">
                  <Highlighter className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="font-serif text-sm">No highlights saved.</p>
                  <p className="text-xs mt-1">Select verses and choose a highlight color to mark passages.</p>
                </div>
              )}

              {filteredHighlights.map((h) => (
                <div
                  key={h.id}
                  className="p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all hover:border-amber-500/40"
                  style={{
                    backgroundColor: isDark ? '#0f172a' : '#fcfaf5',
                    borderColor: isDark ? '#1e293b' : '#e6decb',
                  }}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{
                        backgroundColor:
                          h.color === 'gold' ? '#f59e0b' :
                          h.color === 'emerald' ? '#10b981' :
                          h.color === 'sky' ? '#0ea5e9' :
                          h.color === 'rose' ? '#f43f5e' :
                          '#a855f7'
                      }} />
                      <span className="font-serif font-bold text-xs sm:text-sm text-amber-700 dark:text-amber-400">
                        {h.bookName} {h.chapter}:{h.verse}
                      </span>
                    </div>
                    <p className="font-serif text-xs sm:text-sm leading-relaxed opacity-85 line-clamp-2">
                      "{h.text}"
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => {
                        onNavigateToVerse(h.bookId, h.chapter, h.verse);
                        onClose();
                      }}
                      className="p-1.5 rounded-lg text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/10 flex items-center gap-1"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteHighlight(h.id)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* BOOKMARKS LIST */}
          {activeTab === 'bookmarks' && (
            <div className="space-y-3">
              {filteredBookmarks.length === 0 && (
                <div className="py-16 text-center opacity-60">
                  <BookmarkIcon className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="font-serif text-sm">No bookmarks yet.</p>
                  <p className="text-xs mt-1">Bookmark any verse to easily return to your favorite passages.</p>
                </div>
              )}

              {filteredBookmarks.map((b) => (
                <div
                  key={b.id}
                  className="p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all hover:border-amber-500/40"
                  style={{
                    backgroundColor: isDark ? '#0f172a' : '#fcfaf5',
                    borderColor: isDark ? '#1e293b' : '#e6decb',
                  }}
                >
                  <div className="space-y-0.5">
                    <span className="font-serif font-bold text-xs sm:text-sm text-amber-700 dark:text-amber-400">
                      {b.bookName} {b.chapter}:{b.verse}
                    </span>
                    <p className="font-serif text-xs opacity-75 line-clamp-1 italic">
                      "{b.snippet}"
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => {
                        onNavigateToVerse(b.bookId, b.chapter, b.verse);
                        onClose();
                      }}
                      className="p-1.5 rounded-lg text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/10 flex items-center gap-1"
                    >
                      <span>Read</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteBookmark(b.id)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
