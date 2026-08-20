import React, { useEffect, useState } from 'react';
import { 
  Sparkles, 
  X, 
  BookOpen, 
  History, 
  Languages, 
  Link2, 
  CheckCircle2, 
  HelpCircle, 
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';
import { AIStudyResult, ReaderSettings } from '../types';
import { fetchAIStudyInsights } from '../services/geminiService';

interface AiStudyModalProps {
  isOpen: boolean;
  onClose: () => void;
  reference: string;
  verseText: string;
  translation: string;
  onNavigateToRef?: (bookId: string, chapter: number, verse?: number) => void;
  settings: ReaderSettings;
}

export const AiStudyModal: React.FC<AiStudyModalProps> = ({
  isOpen,
  onClose,
  reference,
  verseText,
  translation,
  onNavigateToRef,
  settings,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [studyData, setStudyData] = useState<AIStudyResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && reference) {
      loadInsights();
    }
  }, [isOpen, reference, verseText]);

  const loadInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAIStudyInsights(reference, verseText, translation);
      setStudyData(data);
    } catch (e: any) {
      setError('Unable to load theological insights at this moment.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyStudy = () => {
    if (!studyData) return;
    const text = `=== SCRIPTURE STUDY: ${reference} (${translation.toUpperCase()}) ===\n\n"${verseText}"\n\n[THEOLOGICAL INSIGHT]\n${studyData.theologicalInsight}\n\n[HISTORICAL CONTEXT]\n${studyData.historicalContext}\n\n[ORIGINAL LANGUAGE]\n${studyData.originalLanguageNotes}\n\n[CROSS REFERENCES]\n${studyData.crossReferences.map((c) => `• ${c.ref}: ${c.text}`).join('\n')}\n\n[PRACTICAL APPLICATION]\n${studyData.practicalApplication.map((p) => `• ${p}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  const isDark = settings.theme === 'dark' || settings.theme === 'midnight';

  return (
    <div 
      id="ai-study-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="ai-study-modal"
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
        {/* Header */}
        <div 
          className="p-4 sm:p-5 border-b flex items-center justify-between gap-3"
          style={{ borderColor: isDark ? '#334155' : '#e8dec9' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-lg sm:text-xl">{reference}</h2>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-amber-600/15 text-amber-700 dark:text-amber-300 font-semibold">
                  {translation}
                </span>
              </div>
              <p className="text-xs opacity-70">Scholarly Theological & Spiritual Commentary</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {studyData && (
              <button
                id="copy-study-guide-btn"
                onClick={handleCopyStudy}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                style={{ borderColor: isDark ? '#475569' : '#d5cbb5' }}
                title="Copy entire study guide"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
              </button>
            )}

            <button
              id="refresh-ai-study-btn"
              onClick={loadInsights}
              disabled={loading}
              className="p-2 rounded-xl text-sm transition-colors hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-50"
              title="Refresh Insights"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              id="close-ai-study-btn"
              onClick={onClose}
              className="p-2 rounded-xl text-sm transition-colors hover:bg-black/10 dark:hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Scripture Quote Box */}
          <div 
            className="p-4 rounded-xl border italic font-serif text-sm sm:text-base leading-relaxed"
            style={{
              backgroundColor: isDark ? '#0f172a' : '#f5efe0',
              borderColor: isDark ? '#1e293b' : '#ded4c0',
            }}
          >
            "{verseText}"
          </div>

          {loading && (
            <div className="py-16 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
              <p className="font-serif text-xs opacity-75">
                Analyzing original languages, historical context & cross-references...
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-300 text-sm text-center">
              {error}
            </div>
          )}

          {!loading && studyData && (
            <div className="space-y-6 text-sm">
              {/* Theological Insight */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-serif font-bold text-base text-amber-700 dark:text-amber-400">
                  <BookOpen className="w-4 h-4" />
                  <h3>Theological & Doctrinal Meaning</h3>
                </div>
                <p className="leading-relaxed opacity-90 pl-6 border-l-2 border-amber-600/30">
                  {studyData.theologicalInsight}
                </p>
              </div>

              {/* Historical Context */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-serif font-bold text-base text-sky-700 dark:text-sky-400">
                  <History className="w-4 h-4" />
                  <h3>Historical & Cultural Setting</h3>
                </div>
                <p className="leading-relaxed opacity-90 pl-6 border-l-2 border-sky-600/30">
                  {studyData.historicalContext}
                </p>
              </div>

              {/* Original Languages */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-serif font-bold text-base text-purple-700 dark:text-purple-400">
                  <Languages className="w-4 h-4" />
                  <h3>Original Hebrew / Greek Nuances</h3>
                </div>
                <p className="leading-relaxed opacity-90 pl-6 border-l-2 border-purple-600/30">
                  {studyData.originalLanguageNotes}
                </p>
              </div>

              {/* Cross References */}
              {studyData.crossReferences && studyData.crossReferences.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 font-serif font-bold text-base text-emerald-700 dark:text-emerald-400">
                    <Link2 className="w-4 h-4" />
                    <h3>Scriptural Cross-References</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pl-6">
                    {studyData.crossReferences.map((cross, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border text-xs space-y-1 transition-colors hover:border-emerald-500/50"
                        style={{
                          backgroundColor: isDark ? '#0f172a' : '#fcfaf5',
                          borderColor: isDark ? '#1e293b' : '#e6decb',
                        }}
                      >
                        <span className="font-serif font-bold text-emerald-600 dark:text-emerald-400">
                          {cross.ref}
                        </span>
                        <p className="opacity-80 italic line-clamp-2">"{cross.text}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Practical Life Application */}
              {studyData.practicalApplication && studyData.practicalApplication.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 font-serif font-bold text-base text-amber-700 dark:text-amber-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <h3>Practical Daily Application</h3>
                  </div>
                  <ul className="space-y-2 pl-6">
                    {studyData.practicalApplication.map((app, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 shrink-0" />
                        <span className="opacity-90">{app}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Reflection Questions */}
              {studyData.reflectionQuestions && studyData.reflectionQuestions.length > 0 && (
                <div 
                  className="p-4 rounded-xl border space-y-2"
                  style={{
                    backgroundColor: isDark ? 'rgba(217, 119, 6, 0.08)' : 'rgba(217, 119, 6, 0.05)',
                    borderColor: isDark ? '#334155' : '#ebdcc5',
                  }}
                >
                  <div className="flex items-center gap-2 font-serif font-bold text-sm text-amber-700 dark:text-amber-400">
                    <HelpCircle className="w-4 h-4" />
                    <span>Personal Contemplation & Meditation</span>
                  </div>
                  <ul className="space-y-1.5 pl-5 list-disc text-xs opacity-90">
                    {studyData.reflectionQuestions.map((q, idx) => (
                      <li key={idx}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
