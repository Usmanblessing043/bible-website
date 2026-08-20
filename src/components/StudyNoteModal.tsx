import React, { useState, useEffect } from 'react';
import { FileText, X, Save, Trash2, Tag, BookOpen } from 'lucide-react';
import { StudyNote, ReaderSettings } from '../types';

interface StudyNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  verseText: string;
  existingNote?: StudyNote;
  onSaveNote: (note: StudyNote) => void;
  onDeleteNote: (noteId: string) => void;
  settings: ReaderSettings;
}

const COMMON_TAGS = ['Devotional', 'Prayer', 'Word Study', 'Question', 'Encouragement', 'Doctrine', 'Life Application'];

export const StudyNoteModal: React.FC<StudyNoteModalProps> = ({
  isOpen,
  onClose,
  bookId,
  bookName,
  chapter,
  verse,
  verseText,
  existingNote,
  onSaveNote,
  onDeleteNote,
  settings,
}) => {
  const [title, setTitle] = useState(existingNote?.title || `Reflections on ${bookName} ${chapter}:${verse}`);
  const [content, setContent] = useState(existingNote?.content || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(existingNote?.tags || ['Devotional']);

  useEffect(() => {
    if (existingNote) {
      setTitle(existingNote.title);
      setContent(existingNote.content);
      setSelectedTags(existingNote.tags || ['Devotional']);
    } else {
      setTitle(`Reflections on ${bookName} ${chapter}:${verse}`);
      setContent('');
      setSelectedTags(['Devotional']);
    }
  }, [existingNote, bookName, chapter, verse, isOpen]);

  if (!isOpen) return null;

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSave = () => {
    const noteToSave: StudyNote = {
      id: existingNote?.id || `note_${bookId}_${chapter}_${verse}_${Date.now()}`,
      bookId,
      bookName,
      chapter,
      verse,
      verseText,
      title: title.trim() || `${bookName} ${chapter}:${verse}`,
      content: content.trim(),
      tags: selectedTags,
      updatedAt: Date.now(),
    };
    onSaveNote(noteToSave);
    onClose();
  };

  const handleDelete = () => {
    if (existingNote) {
      onDeleteNote(existingNote.id);
    }
    onClose();
  };

  const isDark = settings.theme === 'dark' || settings.theme === 'midnight';

  return (
    <div 
      id="study-note-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="study-note-modal"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-2xl border shadow-2xl flex flex-col overflow-hidden transition-all"
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
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg sm:text-xl">
                Personal Study Note
              </h2>
              <p className="text-xs opacity-70">{bookName} {chapter}:{verse}</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {existingNote && (
              <button
                id="delete-study-note-btn"
                onClick={handleDelete}
                className="p-2 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors"
                title="Delete note"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              id="close-study-note-btn"
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-4">
          {/* Verse Snippet */}
          <div 
            className="p-3 rounded-xl border text-xs sm:text-sm font-serif italic opacity-85"
            style={{
              backgroundColor: isDark ? '#0f172a' : '#f5efe0',
              borderColor: isDark ? '#1e293b' : '#ded4c0',
            }}
          >
            "{verseText}"
          </div>

          {/* Note Title */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider opacity-70">
              Note Title
            </label>
            <input
              id="study-note-title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g., Key takeaway on grace..."
              className="w-full px-3.5 py-2 rounded-xl text-sm border outline-none font-serif font-semibold"
              style={{
                backgroundColor: isDark ? '#0f172a' : '#f5efe0',
                borderColor: isDark ? '#334155' : '#ded4c0',
              }}
            />
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider opacity-70 flex items-center gap-1">
              <Tag className="w-3 h-3" />
              Tags
            </label>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => handleToggleTag(tag)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                      isSelected
                        ? 'bg-amber-700 text-white border-amber-600 font-semibold'
                        : 'border-transparent opacity-70 hover:opacity-100 hover:border-black/10'
                    }`}
                    style={{
                      backgroundColor: isSelected ? undefined : (isDark ? '#0f172a' : '#f0e8d8'),
                    }}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Textarea */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider opacity-70">
              Journal & Insights
            </label>
            <textarea
              id="study-note-content-input"
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Record your reflections, prayer requests, cross references, or personal questions here..."
              className="w-full p-3.5 rounded-xl text-sm border outline-none font-serif leading-relaxed resize-none focus:ring-2 focus:ring-amber-500/50"
              style={{
                backgroundColor: isDark ? '#0f172a' : '#f5efe0',
                borderColor: isDark ? '#334155' : '#ded4c0',
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div 
          className="p-4 sm:p-5 border-t flex items-center justify-end gap-2"
          style={{ borderColor: isDark ? '#334155' : '#e8dec9' }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold opacity-75 hover:opacity-100 transition-opacity"
          >
            Cancel
          </button>

          <button
            id="save-study-note-btn"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold bg-amber-700 text-white hover:opacity-90 active:scale-95 transition-all shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Note</span>
          </button>
        </div>
      </div>
    </div>
  );
};
