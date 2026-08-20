import React, { useState } from 'react';
import { 
  Calendar, 
  X, 
  CheckCircle2, 
  Circle, 
  Flame, 
  Trophy, 
  ArrowRight,
  BookOpen,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ReadingPlan, ReaderSettings } from '../types';
import { saveReadingPlans } from '../services/bibleService';

interface ReadingPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  plans: ReadingPlan[];
  onUpdatePlans: (updatedPlans: ReadingPlan[]) => void;
  onNavigateToPassage: (bookId: string, chapter: number) => void;
  settings: ReaderSettings;
}

export const ReadingPlansModal: React.FC<ReadingPlansModalProps> = ({
  isOpen,
  onClose,
  plans,
  onUpdatePlans,
  onNavigateToPassage,
  settings,
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>(plans[0]?.id || '');

  if (!isOpen) return null;

  const currentPlan = plans.find((p) => p.id === selectedPlanId) || plans[0];

  const handleToggleDay = (dayIndex: number) => {
    if (!currentPlan) return;

    const updatedDays = [...currentPlan.days];
    const willBeCompleted = !updatedDays[dayIndex].completed;
    updatedDays[dayIndex] = {
      ...updatedDays[dayIndex],
      completed: willBeCompleted,
    };

    const completedCount = updatedDays.filter((d) => d.completed).length;

    // Trigger celebration confetti if completed all days
    if (willBeCompleted && completedCount === updatedDays.length) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }

    const updatedPlans = plans.map((p) =>
      p.id === currentPlan.id
        ? {
            ...p,
            days: updatedDays,
            currentDay: Math.min(dayIndex + 2, p.durationDays),
          }
        : p
    );

    onUpdatePlans(updatedPlans);
    saveReadingPlans(updatedPlans);
  };

  const handleStartReading = (bookId: string, chapter: number) => {
    onNavigateToPassage(bookId, chapter);
    onClose();
  };

  const completedDaysCount = currentPlan?.days.filter((d) => d.completed).length || 0;
  const progressPercent = currentPlan ? Math.round((completedDaysCount / currentPlan.days.length) * 100) : 0;

  const isDark = settings.theme === 'dark' || settings.theme === 'midnight';

  return (
    <div 
      id="reading-plans-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="reading-plans-modal"
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
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg sm:text-xl">Scripture Reading Journeys</h2>
              <p className="text-xs opacity-70">Daily Structured Scripture Meditations & Plans</p>
            </div>
          </div>

          <button
            id="close-reading-plans-btn"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Plan Selection Tabs */}
        <div 
          className="p-3 border-b flex items-center gap-2 overflow-x-auto no-scrollbar"
          style={{ borderColor: isDark ? '#1e293b' : '#f0e8d8' }}
        >
          {plans.map((plan) => {
            const isSelected = plan.id === selectedPlanId;
            const comp = plan.days.filter((d) => d.completed).length;
            const pct = Math.round((comp / plan.days.length) * 100);

            return (
              <button
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-2 ${
                  isSelected
                    ? 'bg-amber-700 text-white border-amber-600 shadow-xs'
                    : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-80'
                }`}
                style={{
                  borderColor: isSelected ? undefined : (isDark ? '#334155' : '#ded5c2'),
                }}
              >
                <span>{plan.title}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${isSelected ? 'bg-white/20' : 'bg-black/10 dark:bg-white/10'}`}>
                  {pct}%
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Plan Content */}
        {currentPlan && (
          <div className="flex-1 flex flex-col overflow-hidden p-4 sm:p-6 space-y-6">
            {/* Overview Banner */}
            <div 
              className="p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              style={{
                backgroundColor: isDark ? '#0f172a' : '#f5efe0',
                borderColor: isDark ? '#334155' : '#ded4c0',
              }}
            >
              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-amber-600 dark:text-amber-400">
                  {currentPlan.category} • {currentPlan.durationDays} Days Plan
                </span>
                <h3 className="font-serif font-bold text-xl sm:text-2xl">{currentPlan.title}</h3>
                <p className="text-xs sm:text-sm opacity-80 max-w-xl">{currentPlan.description}</p>
              </div>

              {/* Progress Ring / Bar */}
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <div className="text-2xl font-bold font-mono text-amber-700 dark:text-amber-400">
                    {progressPercent}%
                  </div>
                  <div className="text-[11px] opacity-70">
                    {completedDaysCount} of {currentPlan.days.length} Days Done
                  </div>
                </div>
                {progressPercent === 100 && (
                  <div className="w-12 h-12 rounded-full bg-emerald-600/20 text-emerald-600 flex items-center justify-center animate-bounce">
                    <Trophy className="w-6 h-6" />
                  </div>
                )}
              </div>
            </div>

            {/* Progress Track Bar */}
            <div className="w-full bg-black/5 dark:bg-white/10 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-600 to-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Day by Day List */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {currentPlan.days.map((dayItem, index) => {
                return (
                  <div
                    key={dayItem.day}
                    className={`p-3 sm:p-4 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                      dayItem.completed
                        ? 'opacity-75 bg-black/5 dark:bg-white/5'
                        : 'hover:border-amber-500/50'
                    }`}
                    style={{
                      backgroundColor: dayItem.completed ? undefined : (isDark ? '#0f172a' : '#fcfaf5'),
                      borderColor: isDark ? '#1e293b' : '#e6decb',
                    }}
                  >
                    {/* Checkbox toggle & info */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleDay(index)}
                        className="transition-transform hover:scale-110 active:scale-90"
                        title={dayItem.completed ? 'Mark as incomplete' : 'Mark as complete'}
                      >
                        {dayItem.completed ? (
                          <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-600/20" />
                        ) : (
                          <Circle className="w-6 h-6 opacity-40 hover:opacity-100 hover:text-amber-600" />
                        )}
                      </button>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-400">
                            Day {dayItem.day}
                          </span>
                          <span className={`font-serif font-bold text-sm ${dayItem.completed ? 'line-through opacity-70' : ''}`}>
                            {dayItem.title}
                          </span>
                        </div>
                        <p className="text-xs opacity-75 font-serif">{dayItem.reading}</p>
                      </div>
                    </div>

                    {/* Open in Reader Button */}
                    <button
                      onClick={() => handleStartReading(dayItem.bookId, dayItem.chapter)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all hover:bg-amber-700 hover:text-white"
                      style={{
                        borderColor: isDark ? '#334155' : '#ded4c0',
                      }}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Read</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
