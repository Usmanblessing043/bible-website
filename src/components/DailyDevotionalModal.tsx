import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  X, 
  Sparkles, 
  Volume2, 
  Heart, 
  ArrowRight, 
  Flame, 
  CheckCircle2, 
  RefreshCw,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DailyVerse, DevotionalReflection, ReaderSettings } from '../types';
import { fetchDailyDevotionalReflection } from '../services/geminiService';
import { speakText, stopSpeaking } from '../services/bibleService';

interface DailyDevotionalModalProps {
  isOpen: boolean;
  onClose: () => void;
  dailyVerse: DailyVerse;
  onNavigateToPassage: (bookId: string, chapter: number, verse: number) => void;
  streak: number;
  onIncrementStreak: () => void;
  settings: ReaderSettings;
}

export const DailyDevotionalModal: React.FC<DailyDevotionalModalProps> = ({
  isOpen,
  onClose,
  dailyVerse,
  onNavigateToPassage,
  streak,
  onIncrementStreak,
  settings,
}) => {
  const [reflection, setReflection] = useState<DevotionalReflection | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isCompletedToday, setIsCompletedToday] = useState(false);

  useEffect(() => {
    if (isOpen && dailyVerse) {
      loadDevotional();
    }
  }, [isOpen, dailyVerse]);

  const loadDevotional = async () => {
    setLoading(true);
    try {
      const data = await fetchDailyDevotionalReflection(
        `${dailyVerse.bookName} ${dailyVerse.chapter}:${dailyVerse.verse}`,
        dailyVerse.text,
        dailyVerse.theme
      );
      setReflection(data);
    } catch (e) {
      console.warn('Devotional load failed', e);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAudio = () => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      const textToRead = `${dailyVerse.bookName} chapter ${dailyVerse.chapter} verse ${dailyVerse.verse}. ${dailyVerse.text}. Devotional thought: ${reflection?.reflection || ''}`;
      speakText(textToRead, settings, () => {
        setIsPlayingAudio(false);
      });
    }
  };

  const handleCompleteDevotional = () => {
    if (!isCompletedToday) {
      setIsCompletedToday(true);
      onIncrementStreak();
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
  };

  if (!isOpen) return null;

  const todayDateStr = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const isDark = settings.theme === 'dark' || settings.theme === 'midnight';

  return (
    <div 
      id="daily-devotional-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="daily-devotional-modal"
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-xs">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg sm:text-xl">Daily Bread & Meditation</h2>
              <p className="text-xs opacity-70">{todayDateStr}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Streak Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-600/15 text-amber-700 dark:text-amber-300 font-bold text-xs">
              <Flame className="w-4 h-4 fill-current text-amber-600 animate-pulse" />
              <span>{streak} Day Streak</span>
            </div>

            <button
              id="close-devotional-modal-btn"
              onClick={() => {
                stopSpeaking();
                onClose();
              }}
              className="p-2 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Verse of the Day Card */}
          <div 
            className="p-5 sm:p-6 rounded-2xl border space-y-3 relative overflow-hidden"
            style={{
              backgroundColor: isDark ? '#0f172a' : '#f5efe0',
              borderColor: isDark ? '#334155' : '#ded4c0',
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-amber-700 dark:text-amber-400">
                Verse of the Day • {dailyVerse.theme}
              </span>

              <button
                id="devotional-audio-btn"
                onClick={handlePlayAudio}
                className={`p-2 rounded-xl transition-all ${
                  isPlayingAudio
                    ? 'bg-amber-600 text-white animate-pulse'
                    : 'hover:bg-black/5 dark:hover:bg-white/5'
                }`}
                title={isPlayingAudio ? 'Pause Audio' : 'Listen to Verse & Reflection'}
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <p className="font-serif italic text-lg sm:text-xl leading-relaxed">
              "{dailyVerse.text}"
            </p>

            <div className="flex items-center justify-between pt-2">
              <span className="font-serif font-bold text-sm text-amber-700 dark:text-amber-300">
                {dailyVerse.bookName} {dailyVerse.chapter}:{dailyVerse.verse}
              </span>

              <button
                onClick={() => {
                  stopSpeaking();
                  onNavigateToPassage(dailyVerse.bookId, dailyVerse.chapter, dailyVerse.verse);
                  onClose();
                }}
                className="flex items-center gap-1 text-xs font-semibold text-amber-600 hover:underline"
              >
                <span>Read in Full Context</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* AI Meditation & Reflection */}
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
              <p className="font-serif text-xs opacity-75">Preparing today's spiritual reflection...</p>
            </div>
          )}

          {!loading && reflection && (
            <div className="space-y-5 animate-in fade-in duration-300">
              {/* Daily Meditation */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-serif font-bold text-base text-amber-700 dark:text-amber-400">
                  <Sparkles className="w-4 h-4" />
                  <h3>Today's Spiritual Reflection: {reflection.title}</h3>
                </div>
                <p className="font-serif text-sm sm:text-base leading-relaxed opacity-90 pl-6 border-l-2 border-amber-600/30">
                  {reflection.reflection}
                </p>
              </div>

              {/* Guided Prayer */}
              <div 
                className="p-4 rounded-xl border space-y-2"
                style={{
                  backgroundColor: isDark ? 'rgba(14, 165, 233, 0.08)' : 'rgba(14, 165, 233, 0.05)',
                  borderColor: isDark ? '#1e293b' : '#bae6fd',
                }}
              >
                <div className="flex items-center gap-2 font-serif font-bold text-sm text-sky-700 dark:text-sky-400">
                  <Heart className="w-4 h-4 text-sky-600" />
                  <h4>Guided Prayer for Today</h4>
                </div>
                <p className="font-serif italic text-xs sm:text-sm leading-relaxed opacity-90 pl-6">
                  "{reflection.prayer}"
                </p>
              </div>

              {/* Action for the day */}
              {reflection.actionStep && (
                <div className="space-y-1.5 pl-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    Daily Walk & Action:
                  </span>
                  <p className="text-xs sm:text-sm opacity-90">
                    {reflection.actionStep}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer with Complete / Done button */}
        <div 
          className="p-4 sm:p-5 border-t flex items-center justify-between gap-3"
          style={{ borderColor: isDark ? '#334155' : '#e8dec9' }}
        >
          <span className="text-xs opacity-70">
            {isCompletedToday ? 'Devotional completed for today!' : 'Reflect on this word throughout your day.'}
          </span>

          <button
            id="mark-devotional-complete-btn"
            onClick={handleCompleteDevotional}
            disabled={isCompletedToday}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs transition-all ${
              isCompletedToday
                ? 'bg-emerald-600/20 text-emerald-700 dark:text-emerald-300'
                : 'bg-amber-700 text-white hover:opacity-90 active:scale-95 shadow-xs'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompletedToday ? 'Completed Today ✓' : 'Mark Completed (+1 Streak)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
