import React from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  X,
} from 'lucide-react';
import { ReaderSettings } from '../types';

interface AudioPlayerBarProps {
  isPlaying: boolean;
  activeVerse: number | null;
  bookName: string;
  chapter: number;
  totalVerses: number;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onNextVerse: () => void;
  onPrevVerse: () => void;
  settings: ReaderSettings;
  onUpdateRate: (rate: number) => void;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  isPlaying,
  activeVerse,
  bookName,
  chapter,
  totalVerses,
  onPlay,
  onPause,
  onStop,
  onNextVerse,
  onPrevVerse,
  settings,
  onUpdateRate,
}) => {
  if (!isPlaying && activeVerse === null) return null;

  const isDark = settings.theme === 'dark' || settings.theme === 'midnight';

  const cycleSpeed = () => {
    const speeds = [0.8, 1.0, 1.2, 1.5];
    const currentIdx = speeds.indexOf(settings.audioRate);
    const nextRate = speeds[(currentIdx + 1) % speeds.length] || 1.0;
    onUpdateRate(nextRate);
  };

  return (
    <div
      id="audio-player-bar"
      aria-label="Scripture Audio Player"
      className="fixed bottom-16 md:bottom-0 left-0 right-0 z-35 border-t shadow-2xl backdrop-blur-md px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-4 animate-in slide-in-from-bottom duration-200"
      style={{
        backgroundColor:
          settings.theme === 'midnight' ? 'rgba(11, 17, 32, 0.96)' :
          settings.theme === 'dark' ? 'rgba(24, 24, 27, 0.96)' :
          settings.theme === 'sepia' ? 'rgba(246, 238, 219, 0.97)' :
          settings.theme === 'parchment' ? 'rgba(250, 247, 240, 0.97)' :
          'rgba(255, 255, 255, 0.97)',
        borderColor: isDark ? '#334155' : '#e2d9c8',
        color: isDark ? '#f8fafc' : '#1e293b',
      }}
    >
      {/* Left: Current Verse & Audio Visualizer */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 sm:flex-initial">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-700/15 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
          <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
        </div>

        <div className="truncate">
          <div className="font-serif font-bold text-xs sm:text-sm truncate">
            {bookName} {chapter}:{activeVerse || 1}
          </div>
          <div className="text-[10px] sm:text-[11px] opacity-70 flex items-center gap-1.5 truncate">
            <span className="hidden sm:inline">Audio Narration</span>
            {isPlaying && (
              <span className="flex items-center gap-0.5 shrink-0">
                <span className="w-1 h-2 bg-amber-600 animate-pulse rounded-full" />
                <span className="w-1 h-3.5 bg-amber-500 animate-pulse rounded-full delay-75" />
                <span className="w-1 h-2.5 bg-amber-600 animate-pulse rounded-full delay-150" />
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Center: Playback Controls */}
      <div className="flex items-center gap-1 sm:gap-3 shrink-0">
        <button
          id="audio-prev-verse-btn"
          onClick={onPrevVerse}
          disabled={!activeVerse || activeVerse <= 1}
          className="p-1.5 sm:p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-30 transition-all active:scale-90"
          title="Previous Verse"
        >
          <SkipBack className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
        </button>

        <button
          id="audio-play-pause-btn"
          onClick={isPlaying ? onPause : onPlay}
          className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-amber-700 text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
          ) : (
            <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-0.5" />
          )}
        </button>

        <button
          id="audio-next-verse-btn"
          onClick={onNextVerse}
          disabled={!activeVerse || activeVerse >= totalVerses}
          className="p-1.5 sm:p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-30 transition-all active:scale-90"
          title="Next Verse"
        >
          <SkipForward className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
        </button>

        <button
          id="audio-speed-cycle-btn"
          onClick={cycleSpeed}
          className="px-2 sm:px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-mono font-bold border hover:bg-black/5 dark:hover:bg-white/10 transition-colors active:scale-95"
          style={{ borderColor: isDark ? '#475569' : '#d5cbb5' }}
          title="Change playback speed"
        >
          {settings.audioRate}x
        </button>
      </div>

      {/* Right: Close/Stop Button */}
      <div className="flex items-center shrink-0">
        <button
          id="audio-stop-btn"
          onClick={onStop}
          className="p-1.5 sm:p-2 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 opacity-70 hover:opacity-100 transition-colors active:scale-90"
          title="Stop and dismiss audio player"
        >
          <X className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
        </button>
      </div>
    </div>
  );
};
