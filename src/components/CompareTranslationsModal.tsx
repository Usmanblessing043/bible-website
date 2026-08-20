import React, { useEffect, useState } from 'react';
import { Columns, X, Copy, Check, RefreshCw } from 'lucide-react';
import { ReaderSettings } from '../types';
import { compareVerseTranslations } from '../services/bibleService';

interface CompareTranslationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookName: string;
  chapter: number;
  verse: number;
  settings: ReaderSettings;
}

export const CompareTranslationsModal: React.FC<CompareTranslationsModalProps> = ({
  isOpen,
  onClose,
  bookName,
  chapter,
  verse,
  settings,
}) => {
  const [loading, setLoading] = useState(true);
  const [translationsData, setTranslationsData] = useState<{ translation: string; name: string; text: string }[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && bookName) {
      loadTranslations();
    }
  }, [isOpen, bookName, chapter, verse]);

  const loadTranslations = async () => {
    setLoading(true);
    try {
      const data = await compareVerseTranslations(bookName, chapter, verse, ['kjv', 'web', 'bbe', 'asv', 'ylt']);
      setTranslationsData(data);
    } catch (e) {
      console.warn('Compare translations error', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (transName: string, text: string) => {
    const formatted = `"${text}" — ${bookName} ${chapter}:${verse} (${transName})`;
    navigator.clipboard.writeText(formatted);
    setCopiedId(transName);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  const isDark = settings.theme === 'dark' || settings.theme === 'midnight';

  return (
    <div 
      id="compare-translations-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="compare-translations-modal"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl max-h-[85vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden transition-all"
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
              <Columns className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg sm:text-xl">
                {bookName} {chapter}:{verse}
              </h2>
              <p className="text-xs opacity-70">Compare Verse Across Multiple Bible Translations</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="refresh-compare-translations-btn"
              onClick={loadTranslations}
              disabled={loading}
              className="p-2 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              id="close-compare-translations-btn"
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Translation Cards List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {loading && (
            <div className="py-16 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
              <p className="font-serif text-xs opacity-70">Retrieving Bible translations...</p>
            </div>
          )}

          {!loading && translationsData.map((item) => (
            <div
              key={item.translation}
              className="p-4 rounded-xl border space-y-2 transition-all hover:border-amber-500/40"
              style={{
                backgroundColor: isDark ? '#0f172a' : '#fcfaf5',
                borderColor: isDark ? '#1e293b' : '#e6decb',
              }}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-700/15 text-amber-700 dark:text-amber-300">
                  {item.translation} ({item.name})
                </span>
                <button
                  onClick={() => handleCopy(item.translation, item.text)}
                  className="flex items-center gap-1 text-xs opacity-70 hover:opacity-100 transition-opacity"
                  title="Copy this translation"
                >
                  {copiedId === item.translation ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedId === item.translation ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <p className="font-serif text-base leading-relaxed pl-1">
                "{item.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
