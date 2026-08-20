import React from 'react';
import { 
  X, 
  Type, 
  Sun, 
  Moon, 
  Columns, 
  Volume2, 
  Sliders, 
  Eye, 
  RotateCcw,
  Check
} from 'lucide-react';
import { ReaderSettings, ReaderTheme, FontFamily, ViewMode } from '../types';
import { BIBLE_TRANSLATIONS } from '../data/bibleBooks';

interface ReaderSettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ReaderSettings;
  onUpdateSettings: (newSettings: Partial<ReaderSettings>) => void;
  onResetSettings: () => void;
}

const THEME_OPTIONS: { id: ReaderTheme; label: string; bg: string; text: string; border: string }[] = [
  { id: 'parchment', label: 'Parchment', bg: '#faf7f0', text: '#2b231d', border: '#e4dac5' },
  { id: 'light', label: 'Daylight', bg: '#ffffff', text: '#0f172a', border: '#e2e8f0' },
  { id: 'sepia', label: 'Warm Sepia', bg: '#f6eedb', text: '#3c2817', border: '#dec9a8' },
  { id: 'dark', label: 'Dark Stone', bg: '#18181b', text: '#f4f4f5', border: '#3f3f46' },
  { id: 'midnight', label: 'Midnight', bg: '#080d1a', text: '#e2e8f0', border: '#1e293b' },
];

const FONT_OPTIONS: { id: FontFamily; label: string; preview: string; styleClass: string }[] = [
  { id: 'serif', label: 'Literary Serif', preview: 'In the beginning was the Word', styleClass: 'font-serif' },
  { id: 'garamond', label: 'Classic Garamond', preview: 'In the beginning was the Word', styleClass: 'font-serif tracking-wide' },
  { id: 'sans', label: 'Clean Modern Sans', preview: 'In the beginning was the Word', styleClass: 'font-sans' },
  { id: 'mono', label: 'Scholar Monospace', preview: 'In the beginning was the Word', styleClass: 'font-mono' },
];

export const ReaderSettingsDrawer: React.FC<ReaderSettingsDrawerProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetSettings,
}) => {
  if (!isOpen) return null;

  const isDark = settings.theme === 'dark' || settings.theme === 'midnight';

  return (
    <div 
      id="settings-drawer-backdrop"
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="settings-drawer"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md h-full border-l shadow-2xl flex flex-col transition-all overflow-hidden"
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
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-700/15 text-amber-700 dark:text-amber-300 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base sm:text-lg">Display & Audio Settings</h2>
              <p className="text-[11px] opacity-70">Customize Typography, Theme & Layout</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              id="reset-settings-btn"
              onClick={onResetSettings}
              className="p-2 rounded-lg text-xs opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              title="Reset to defaults"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              id="close-settings-drawer-btn"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Settings Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
          {/* Theme Palette */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider opacity-70 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5" />
              Reading Themes
            </label>
            <div className="grid grid-cols-5 gap-2">
              {THEME_OPTIONS.map((t) => {
                const isSelected = settings.theme === t.id;
                return (
                  <button
                    key={t.id}
                    id={`setting-theme-${t.id}`}
                    onClick={() => onUpdateSettings({ theme: t.id })}
                    className={`h-16 rounded-xl border flex flex-col items-center justify-between p-2 text-center transition-all ${
                      isSelected ? 'ring-2 ring-amber-600 scale-105 shadow-sm' : 'hover:scale-102 opacity-85 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor: t.bg,
                      color: t.text,
                      borderColor: isSelected ? '#d97706' : t.border,
                    }}
                  >
                    <span className="text-[10px] font-semibold">{t.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Font Family */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider opacity-70 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5" />
              Typography Style
            </label>
            <div className="grid grid-cols-2 gap-2">
              {FONT_OPTIONS.map((f) => {
                const isSelected = settings.fontFamily === f.id;
                return (
                  <button
                    key={f.id}
                    id={`setting-font-${f.id}`}
                    onClick={() => onUpdateSettings({ fontFamily: f.id })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-amber-600 ring-2 ring-amber-500/30 bg-amber-600/10 font-bold'
                        : 'hover:border-black/20 dark:hover:border-white/20 opacity-80'
                    }`}
                  >
                    <div className="text-xs font-semibold">{f.label}</div>
                    <div className={`text-[11px] opacity-70 mt-1 truncate ${f.styleClass}`}>
                      {f.preview}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Font Size & Line Height */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-bold uppercase tracking-wider opacity-70">Font Size</span>
                <span className="font-mono font-bold text-amber-700 dark:text-amber-400">
                  {settings.fontSize}px
                </span>
              </div>
              <input
                id="font-size-slider"
                type="range"
                min={14}
                max={30}
                step={1}
                value={settings.fontSize}
                onChange={(e) => onUpdateSettings({ fontSize: Number(e.target.value) })}
                className="w-full accent-amber-600"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-bold uppercase tracking-wider opacity-70">Line Spacing</span>
                <span className="font-mono font-bold text-amber-700 dark:text-amber-400">
                  {settings.lineHeight}
                </span>
              </div>
              <input
                id="line-height-slider"
                type="range"
                min={1.4}
                max={2.4}
                step={0.1}
                value={settings.lineHeight}
                onChange={(e) => onUpdateSettings({ lineHeight: Number(e.target.value) })}
                className="w-full accent-amber-600"
              />
            </div>
          </div>

          {/* Reading Layout & Verses */}
          <div className="space-y-3 pt-3 border-t" style={{ borderColor: isDark ? '#1e293b' : '#f0e8d8' }}>
            <label className="text-xs font-bold uppercase tracking-wider opacity-70 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              Reading Layout
            </label>

            {/* Paragraph vs Verse-by-Verse */}
            <div className="flex rounded-xl p-1 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
              <button
                id="viewmode-paragraph-btn"
                onClick={() => onUpdateSettings({ viewMode: 'paragraph' })}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  settings.viewMode === 'paragraph'
                    ? 'bg-amber-700 text-white shadow-xs'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                Paragraph Mode
              </button>
              <button
                id="viewmode-verse-btn"
                onClick={() => onUpdateSettings({ viewMode: 'verse-by-verse' })}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  settings.viewMode === 'verse-by-verse'
                    ? 'bg-amber-700 text-white shadow-xs'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                Verse by Verse
              </button>
            </div>

            {/* Red Letter Mode */}
            <div className="flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: isDark ? '#1e293b' : '#e6decb' }}>
              <div>
                <div className="text-xs font-semibold">Words of Jesus in Red</div>
                <div className="text-[10px] opacity-70">Highlight Christ's spoken words in traditional crimson</div>
              </div>
              <input
                id="red-letter-toggle"
                type="checkbox"
                checked={settings.redLetter}
                onChange={(e) => onUpdateSettings({ redLetter: e.target.checked })}
                className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
              />
            </div>

            {/* Show Verse Numbers */}
            <div className="flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: isDark ? '#1e293b' : '#e6decb' }}>
              <div>
                <div className="text-xs font-semibold">Show Verse Numbers</div>
                <div className="text-[10px] opacity-70">Display superscripts for each verse index</div>
              </div>
              <input
                id="verse-numbers-toggle"
                type="checkbox"
                checked={settings.showVerseNumbers}
                onChange={(e) => onUpdateSettings({ showVerseNumbers: e.target.checked })}
                className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
              />
            </div>

            {/* Parallel / Split View Toggle */}
            <div className="p-3 rounded-xl border space-y-2" style={{ borderColor: isDark ? '#1e293b' : '#e6decb' }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold flex items-center gap-1.5">
                    <Columns className="w-3.5 h-3.5" />
                    Parallel Translation Mode
                  </div>
                  <div className="text-[10px] opacity-70">Read 2 Bible translations side by side</div>
                </div>
                <input
                  id="split-view-toggle"
                  type="checkbox"
                  checked={settings.splitView}
                  onChange={(e) => onUpdateSettings({ splitView: e.target.checked })}
                  className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
                />
              </div>

              {settings.splitView && (
                <div className="pt-2 border-t border-black/5 dark:border-white/5 space-y-1">
                  <label className="text-[11px] font-semibold opacity-80">Secondary Translation:</label>
                  <select
                    id="secondary-translation-select"
                    value={settings.secondaryTranslation}
                    onChange={(e) => onUpdateSettings({ secondaryTranslation: e.target.value })}
                    className="w-full p-2 rounded-lg border text-xs outline-none"
                    style={{
                      backgroundColor: isDark ? '#0f172a' : '#f5efe0',
                      borderColor: isDark ? '#334155' : '#ded4c0',
                    }}
                  >
                    {BIBLE_TRANSLATIONS.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.id.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Audio Speech Settings */}
          <div className="space-y-3 pt-3 border-t" style={{ borderColor: isDark ? '#1e293b' : '#f0e8d8' }}>
            <label className="text-xs font-bold uppercase tracking-wider opacity-70 flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5" />
              Audio Narration
            </label>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold opacity-80">Narration Speed</span>
                <span className="font-mono font-bold">{settings.audioRate}x</span>
              </div>
              <input
                id="audio-speed-slider"
                type="range"
                min={0.75}
                max={1.5}
                step={0.05}
                value={settings.audioRate}
                onChange={(e) => onUpdateSettings({ audioRate: Number(e.target.value) })}
                className="w-full accent-amber-600"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: isDark ? '#1e293b' : '#e6decb' }}>
              <div>
                <div className="text-xs font-semibold">Auto-Scroll with Audio</div>
                <div className="text-[10px] opacity-70">Follow along smoothly as verses are spoken</div>
              </div>
              <input
                id="audio-autoscroll-toggle"
                type="checkbox"
                checked={settings.autoScrollAudio}
                onChange={(e) => onUpdateSettings({ autoScrollAudio: e.target.checked })}
                className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
