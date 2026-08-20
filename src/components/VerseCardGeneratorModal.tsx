import React, { useState, useRef } from 'react';
import { Image as ImageIcon, X, Download, Copy, Check, Sparkles, Sliders } from 'lucide-react';
import { ReaderSettings } from '../types';

interface VerseCardGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  reference: string;
  verseText: string;
  translation: string;
  settings: ReaderSettings;
}

type CardTheme = 'gold' | 'parchment' | 'midnight' | 'olive' | 'burgundy' | 'minimal';
type CardAspect = 'square' | 'story' | 'landscape';

export const VerseCardGeneratorModal: React.FC<VerseCardGeneratorModalProps> = ({
  isOpen,
  onClose,
  reference,
  verseText,
  translation,
  settings,
}) => {
  const [selectedTheme, setSelectedTheme] = useState<CardTheme>('gold');
  const [aspect, setAspect] = useState<CardAspect>('square');
  const [fontSize, setFontSize] = useState<number>(20);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  if (!isOpen) return null;

  const handleDownload = () => {
    const canvas = document.createElement('canvas');
    const width = aspect === 'square' ? 1080 : aspect === 'story' ? 1080 : 1200;
    const height = aspect === 'square' ? 1080 : aspect === 'story' ? 1920 : 630;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw background
    if (selectedTheme === 'gold') {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#fef3c7');
      grad.addColorStop(0.5, '#fde68a');
      grad.addColorStop(1, '#f59e0b');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    } else if (selectedTheme === 'parchment') {
      ctx.fillStyle = '#faf6ed';
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = '#d4c7b0';
      ctx.lineWidth = 16;
      ctx.strokeRect(30, 30, width - 60, height - 60);
    } else if (selectedTheme === 'midnight') {
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(1, '#020617');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    } else if (selectedTheme === 'olive') {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#ecfdf5');
      grad.addColorStop(1, '#065f46');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    } else if (selectedTheme === 'burgundy') {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#450a0a');
      grad.addColorStop(1, '#1c0404');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
    }

    // Text configuration
    const isDarkTheme = selectedTheme === 'midnight' || selectedTheme === 'burgundy' || selectedTheme === 'olive';
    ctx.fillStyle = isDarkTheme ? '#f8fafc' : '#1e293b';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Format text lines
    const textToDraw = `"${verseText}"`;
    const drawFontSize = (width / 40) * (fontSize / 20);
    ctx.font = `italic 600 ${drawFontSize}px Georgia, serif`;

    // Simple text wrapping
    const words = textToDraw.split(' ');
    let line = '';
    const lines: string[] = [];
    const maxWidth = width * 0.75;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        lines.push(line);
        line = words[n] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    const lineHeight = drawFontSize * 1.5;
    const startY = height / 2 - (lines.length * lineHeight) / 2;

    lines.forEach((l, i) => {
      ctx.fillText(l.trim(), width / 2, startY + i * lineHeight);
    });

    // Reference
    ctx.font = `bold ${drawFontSize * 0.65}px sans-serif`;
    ctx.fillStyle = isDarkTheme ? '#fde68a' : '#92400e';
    ctx.fillText(`${reference} (${translation.toUpperCase()})`, width / 2, startY + lines.length * lineHeight + drawFontSize * 1.2);

    // Save image
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `scripture_card_${reference.replace(/\s+/g, '_')}.png`;
    a.click();
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(`"${verseText}" — ${reference} (${translation.toUpperCase()})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isDark = settings.theme === 'dark' || settings.theme === 'midnight';

  const getThemeCardStyles = () => {
    switch (selectedTheme) {
      case 'gold':
        return 'bg-gradient-to-br from-amber-100 via-amber-200 to-amber-400 text-amber-950 border-amber-300';
      case 'parchment':
        return 'bg-[#faf6ed] text-[#3d2817] border-4 border-[#d4c7b0]';
      case 'midnight':
        return 'bg-gradient-to-b from-slate-900 to-black text-slate-100 border-slate-700';
      case 'olive':
        return 'bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-950 text-emerald-100 border-emerald-800';
      case 'burgundy':
        return 'bg-gradient-to-br from-rose-950 via-red-950 to-stone-950 text-rose-100 border-rose-900';
      case 'minimal':
      default:
        return 'bg-white text-slate-900 border-slate-200';
    }
  };

  return (
    <div 
      id="verse-card-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="verse-card-modal"
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
            <div className="w-10 h-10 rounded-xl bg-amber-700/15 text-amber-700 dark:text-amber-300 flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg sm:text-xl">Scripture Quote Card</h2>
              <p className="text-xs opacity-70">Design & Share Beautiful Scripture Artworks</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors hover:bg-black/5 dark:hover:bg-white/10"
              style={{ borderColor: isDark ? '#475569' : '#d5cbb5' }}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              id="download-card-png-btn"
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-amber-700 text-white hover:opacity-90 transition-all shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PNG</span>
            </button>

            <button
              id="close-card-modal-btn"
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card Preview (2 columns on md) */}
          <div className="md:col-span-2 flex items-center justify-center p-4 bg-black/10 dark:bg-black/40 rounded-2xl">
            <div
              ref={cardRef}
              className={`rounded-2xl p-8 shadow-xl flex flex-col justify-between text-center transition-all ${getThemeCardStyles()} ${
                aspect === 'square'
                  ? 'w-full max-w-sm aspect-square'
                  : aspect === 'story'
                  ? 'w-full max-w-xs aspect-[9/16]'
                  : 'w-full max-w-md aspect-[16/9]'
              }`}
            >
              <div className="opacity-40 text-xs font-mono tracking-widest uppercase">
                Holy Scripture
              </div>

              <div className="my-auto px-2">
                <p 
                  className="font-serif italic leading-relaxed"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  "{verseText}"
                </p>
              </div>

              <div className="pt-4 border-t border-black/10 dark:border-white/10">
                <span className="font-serif font-bold text-sm tracking-wide">
                  {reference}
                </span>
                <span className="text-[10px] ml-1.5 opacity-70 uppercase font-mono">
                  ({translation})
                </span>
              </div>
            </div>
          </div>

          {/* Style Controls (1 column) */}
          <div className="space-y-5">
            {/* Theme Presets */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider opacity-70">
                Aesthetic Theme
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'gold', label: 'Gold Sunrise' },
                  { id: 'parchment', label: 'Ancient Scroll' },
                  { id: 'midnight', label: 'Obsidian Night' },
                  { id: 'olive', label: 'Olive Grove' },
                  { id: 'burgundy', label: 'Royal Crimson' },
                  { id: 'minimal', label: 'Minimal Studio' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTheme(t.id as CardTheme)}
                    className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all ${
                      selectedTheme === t.id
                        ? 'border-amber-600 ring-2 ring-amber-500/50 bg-amber-500/10 font-bold'
                        : 'hover:border-black/20 dark:hover:border-white/20'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider opacity-70">
                Card Ratio
              </label>
              <div className="flex rounded-lg p-1 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                {(['square', 'story', 'landscape'] as CardAspect[]).map((asp) => (
                  <button
                    key={asp}
                    onClick={() => setAspect(asp)}
                    className={`flex-1 py-1.5 rounded-md text-xs font-semibold capitalize transition-all ${
                      aspect === asp ? 'bg-amber-700 text-white shadow-xs' : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    {asp}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold uppercase tracking-wider opacity-70">Text Size</span>
                <span className="font-mono">{fontSize}px</span>
              </div>
              <input
                type="range"
                min={14}
                max={28}
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full accent-amber-600"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
