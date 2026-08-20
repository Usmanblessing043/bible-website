import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { BibleReader } from './components/BibleReader';
import { BookSelectorModal } from './components/BookSelectorModal';
import { SearchModal } from './components/SearchModal';
import { ReadingPlansModal } from './components/ReadingPlansModal';
import { PersonalLibraryModal } from './components/PersonalLibraryModal';
import { StudyNoteModal } from './components/StudyNoteModal';
import { AiStudyModal } from './components/AiStudyModal';
import { AiAssistantDrawer } from './components/AiAssistantDrawer';
import { VerseCardGeneratorModal } from './components/VerseCardGeneratorModal';
import { CompareTranslationsModal } from './components/CompareTranslationsModal';
import { DailyDevotionalModal } from './components/DailyDevotionalModal';
import { ReaderSettingsDrawer } from './components/ReaderSettingsDrawer';
import { VerseActionToolbar } from './components/VerseActionToolbar';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { BottomNav } from './components/BottomNav';

import { 
  BibleBook, 
  BibleChapter, 
  BibleVerse, 
  ReaderSettings, 
  Highlight, 
  Bookmark, 
  StudyNote, 
  ReadingPlan, 
  HighlightColor 
} from './types';
import { BIBLE_BOOKS, getBookById, getNextChapter, getPrevChapter } from './data/bibleBooks';
import { getTodaysDailyVerse } from './data/fallbackBible';
import { 
  fetchChapter, 
  loadSettings, 
  saveSettings, 
  loadBookmarks, 
  saveBookmarks, 
  loadHighlights, 
  saveHighlights, 
  loadNotes, 
  saveNotes, 
  loadReadingPlans, 
  saveReadingPlans, 
  loadDailyStreak, 
  saveDailyStreak,
  speakText,
  stopSpeaking
} from './services/bibleService';

export default function App() {
  // Navigation & Scripture State
  const [currentBookId, setCurrentBookId] = useState<string>('JHN'); // Default to Gospel of John
  const [currentChapterNum, setCurrentChapterNum] = useState<number>(1);
  const [currentTranslation, setCurrentTranslation] = useState<string>('kjv');

  const [primaryChapter, setPrimaryChapter] = useState<BibleChapter | null>(null);
  const [secondaryChapter, setSecondaryChapter] = useState<BibleChapter | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Reader Settings
  const [settings, setSettings] = useState<ReaderSettings>(loadSettings);

  // User Library State
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(loadBookmarks);
  const [highlights, setHighlights] = useState<Highlight[]>(loadHighlights);
  const [notes, setNotes] = useState<StudyNote[]>(loadNotes);
  const [readingPlans, setReadingPlans] = useState<ReadingPlan[]>(loadReadingPlans);
  const [streak, setStreak] = useState<number>(loadDailyStreak);

  // Interactive Selection State
  const [selectedVerses, setSelectedVerses] = useState<BibleVerse[]>([]);
  const [activeNoteVerse, setActiveNoteVerse] = useState<number | null>(null);

  // Audio Narration State
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [activeAudioVerse, setActiveAudioVerse] = useState<number | null>(null);
  const audioIndexRef = useRef<number>(0);
  const isAudioCanceledRef = useRef<boolean>(false);

  // Modal Visibility State
  const [bookSelectorOpen, setBookSelectorOpen] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [libraryOpen, setLibraryOpen] = useState<boolean>(false);
  const [plansOpen, setPlansOpen] = useState<boolean>(false);
  const [devotionalOpen, setDevotionalOpen] = useState<boolean>(false);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [aiStudyOpen, setAiStudyOpen] = useState<boolean>(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState<boolean>(false);
  const [cardGeneratorOpen, setCardGeneratorOpen] = useState<boolean>(false);
  const [compareModalOpen, setCompareModalOpen] = useState<boolean>(false);
  const [noteModalOpen, setNoteModalOpen] = useState<boolean>(false);

  // Current Book Object
  const currentBook: BibleBook = getBookById(currentBookId) || BIBLE_BOOKS[0];

  // Fetch Scripture Chapter
  const loadScripture = useCallback(async (bookId: string, chapterNum: number, translation: string, split: boolean, secTranslation: string) => {
    setIsLoading(true);
    setError(null);
    setSelectedVerses([]);

    try {
      const pChap = await fetchChapter(bookId, chapterNum, translation);
      setPrimaryChapter(pChap);

      if (split) {
        const sChap = await fetchChapter(bookId, chapterNum, secTranslation);
        setSecondaryChapter(sChap);
      } else {
        setSecondaryChapter(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve scripture passage.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadScripture(
      currentBookId, 
      currentChapterNum, 
      currentTranslation, 
      settings.splitView, 
      settings.secondaryTranslation
    );
  }, [currentBookId, currentChapterNum, currentTranslation, settings.splitView, settings.secondaryTranslation, loadScripture]);

  // Audio Playback Pipeline
  const readVerseSequence = useCallback((verses: BibleVerse[], startIndex: number) => {
    if (startIndex >= verses.length || isAudioCanceledRef.current) {
      setIsPlayingAudio(false);
      setActiveAudioVerse(null);
      return;
    }

    const verse = verses[startIndex];
    audioIndexRef.current = startIndex;
    setActiveAudioVerse(verse.verse);

    const spokenText = `${verse.verse}. ${verse.text}`;
    speakText(spokenText, settings, () => {
      if (!isAudioCanceledRef.current) {
        readVerseSequence(verses, startIndex + 1);
      }
    });
  }, [settings]);

  const handleStartAudio = (startVerseNum?: number) => {
    if (!primaryChapter || primaryChapter.verses.length === 0) return;
    isAudioCanceledRef.current = false;
    setIsPlayingAudio(true);

    const verses = primaryChapter.verses;
    let startIndex = 0;
    if (startVerseNum) {
      const idx = verses.findIndex((v) => v.verse === startVerseNum);
      if (idx !== -1) startIndex = idx;
    }

    readVerseSequence(verses, startIndex);
  };

  const handlePauseAudio = () => {
    stopSpeaking();
    setIsPlayingAudio(false);
  };

  const handleResumeAudio = () => {
    if (!primaryChapter) return;
    isAudioCanceledRef.current = false;
    setIsPlayingAudio(true);
    readVerseSequence(primaryChapter.verses, audioIndexRef.current);
  };

  const handleStopAudio = () => {
    isAudioCanceledRef.current = true;
    stopSpeaking();
    setIsPlayingAudio(false);
    setActiveAudioVerse(null);
    audioIndexRef.current = 0;
  };

  const handleNextAudioVerse = () => {
    if (!primaryChapter) return;
    const nextIdx = Math.min(audioIndexRef.current + 1, primaryChapter.verses.length - 1);
    stopSpeaking();
    readVerseSequence(primaryChapter.verses, nextIdx);
  };

  const handlePrevAudioVerse = () => {
    if (!primaryChapter) return;
    const prevIdx = Math.max(audioIndexRef.current - 1, 0);
    stopSpeaking();
    readVerseSequence(primaryChapter.verses, prevIdx);
  };

  // Chapter Navigation Handlers
  const handlePrevChapter = () => {
    handleStopAudio();
    const prev = getPrevChapter(currentBookId, currentChapterNum);
    setCurrentBookId(prev.bookId);
    setCurrentChapterNum(prev.chapter);
  };

  const handleNextChapter = () => {
    handleStopAudio();
    const next = getNextChapter(currentBookId, currentChapterNum);
    setCurrentBookId(next.bookId);
    setCurrentChapterNum(next.chapter);
  };

  const handleSelectPassage = (bookId: string, chapter: number, verse?: number) => {
    handleStopAudio();
    setCurrentBookId(bookId);
    setCurrentChapterNum(chapter);
    if (verse && primaryChapter) {
      setTimeout(() => {
        const el = document.getElementById(`verse-item-${verse}`) || document.getElementById(`verse-span-${verse}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  };

  // Verse Selection Handlers
  const handleToggleVerseSelect = (verse: BibleVerse) => {
    setSelectedVerses((prev) => {
      const exists = prev.some((v) => v.verse === verse.verse);
      if (exists) {
        return prev.filter((v) => v.verse !== verse.verse);
      } else {
        return [...prev, verse].sort((a, b) => a.verse - b.verse);
      }
    });
  };

  const handleClearSelection = () => {
    setSelectedVerses([]);
  };

  // Highlighting & Bookmarks
  const handleHighlight = (color: HighlightColor) => {
    if (selectedVerses.length === 0) return;

    let updatedHighlights = [...highlights];
    selectedVerses.forEach((verse) => {
      updatedHighlights = updatedHighlights.filter(
        (h) => !(h.bookId === currentBookId && h.chapter === currentChapterNum && h.verse === verse.verse)
      );
      updatedHighlights.push({
        id: `hl_${currentBookId}_${currentChapterNum}_${verse.verse}`,
        bookId: currentBookId,
        bookName: currentBook.name,
        chapter: currentChapterNum,
        verse: verse.verse,
        text: verse.text,
        color,
        createdAt: Date.now(),
      });
    });

    setHighlights(updatedHighlights);
    saveHighlights(updatedHighlights);
    handleClearSelection();
  };

  const handleRemoveHighlight = () => {
    if (selectedVerses.length === 0) return;

    const verseNumbers = selectedVerses.map((v) => v.verse);
    const updatedHighlights = highlights.filter(
      (h) => !(h.bookId === currentBookId && h.chapter === currentChapterNum && verseNumbers.includes(h.verse))
    );

    setHighlights(updatedHighlights);
    saveHighlights(updatedHighlights);
    handleClearSelection();
  };

  const handleToggleBookmark = () => {
    if (selectedVerses.length === 0) return;

    const targetVerse = selectedVerses[0];
    const exists = bookmarks.some(
      (b) => b.bookId === currentBookId && b.chapter === currentChapterNum && b.verse === targetVerse.verse
    );

    let updatedBookmarks: Bookmark[];
    if (exists) {
      updatedBookmarks = bookmarks.filter(
        (b) => !(b.bookId === currentBookId && b.chapter === currentChapterNum && b.verse === targetVerse.verse)
      );
    } else {
      const newBookmark: Bookmark = {
        id: `bm_${currentBookId}_${currentChapterNum}_${targetVerse.verse}`,
        bookId: currentBookId,
        bookName: currentBook.name,
        chapter: currentChapterNum,
        verse: targetVerse.verse,
        snippet: targetVerse.text,
        createdAt: Date.now(),
      };
      updatedBookmarks = [newBookmark, ...bookmarks];
    }

    setBookmarks(updatedBookmarks);
    saveBookmarks(updatedBookmarks);
  };

  // Study Notes Handlers
  const handleSaveNote = (noteToSave: StudyNote) => {
    const exists = notes.some((n) => n.id === noteToSave.id);
    let updatedNotes: StudyNote[];
    if (exists) {
      updatedNotes = notes.map((n) => (n.id === noteToSave.id ? noteToSave : n));
    } else {
      updatedNotes = [noteToSave, ...notes];
    }
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
  };

  const handleDeleteNote = (noteId: string) => {
    const updatedNotes = notes.filter((n) => n.id !== noteId);
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
  };

  const handleOpenNoteForVerse = (verseNum: number) => {
    setActiveNoteVerse(verseNum);
    setNoteModalOpen(true);
  };

  // Reader Settings Updates
  const handleUpdateSettings = (newProps: Partial<ReaderSettings>) => {
    const updated = { ...settings, ...newProps };
    setSettings(updated);
    saveSettings(updated);
  };

  const handleResetSettings = () => {
    const defaults: ReaderSettings = {
      theme: 'parchment',
      fontSize: 18,
      fontFamily: 'serif',
      lineHeight: 1.8,
      showVerseNumbers: true,
      redLetter: true,
      splitView: false,
      secondaryTranslation: 'web',
      audioRate: 1.0,
      audioPitch: 1.0,
      autoScrollAudio: true,
      viewMode: 'paragraph',
    };
    setSettings(defaults);
    saveSettings(defaults);
  };

  // Streak incrementer
  const handleIncrementStreak = () => {
    const newStreak = streak + 1;
    setStreak(newStreak);
    saveDailyStreak(newStreak);
  };

  // Keyboard Shortcuts (Arrow keys for navigation, Esc to clear)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea', 'select'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) {
        return;
      }
      if (e.key === 'ArrowLeft' && (e.metaKey || e.ctrlKey || e.altKey)) {
        handlePrevChapter();
      } else if (e.key === 'ArrowRight' && (e.metaKey || e.ctrlKey || e.altKey)) {
        handleNextChapter();
      } else if (e.key === 'Escape') {
        handleClearSelection();
      } else if (e.key === '/' && !e.metaKey) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentBookId, currentChapterNum]);

  // Derived selected verses reference strings
  const selectedVerseNums = selectedVerses.map((v) => v.verse);
  const selectionRefStr =
    selectedVerses.length > 0
      ? `${currentBook.name} ${currentChapterNum}:${selectedVerseNums.join('-')}`
      : `${currentBook.name} ${currentChapterNum}:1`;

  const selectionTextStr =
    selectedVerses.length > 0
      ? selectedVerses.map((v) => v.text).join(' ')
      : primaryChapter?.verses[0]?.text || '';

  const isSelectedBookmarked =
    selectedVerses.length > 0 &&
    bookmarks.some(
      (b) => b.bookId === currentBookId && b.chapter === currentChapterNum && b.verse === selectedVerses[0].verse
    );

  const activeHighlightColor =
    selectedVerses.length > 0
      ? highlights.find(
          (h) => h.bookId === currentBookId && h.chapter === currentChapterNum && h.verse === selectedVerses[0].verse
        )?.color
      : undefined;

  const currentVerseForNote = activeNoteVerse || (selectedVerses[0]?.verse || 1);
  const noteVerseObj = primaryChapter?.verses.find((v) => v.verse === currentVerseForNote);
  const existingNoteForVerse = notes.find(
    (n) => n.bookId === currentBookId && n.chapter === currentChapterNum && n.verse === currentVerseForNote
  );

  return (
    <div 
      id="app-root-container"
      className="min-h-screen flex flex-col transition-colors duration-300 font-sans selection:bg-amber-500/30"
    >
      {/* Top Main Navigation Bar */}
      <Navbar
        currentBook={currentBook}
        currentChapter={currentChapterNum}
        currentTranslation={currentTranslation}
        onSelectTranslation={setCurrentTranslation}
        onOpenBookSelector={() => setBookSelectorOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenLibrary={() => setLibraryOpen(true)}
        onOpenReadingPlans={() => setPlansOpen(true)}
        onOpenDailyVerse={() => setDevotionalOpen(true)}
        onOpenAiAssistant={() => setAiAssistantOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
        onToggleSplitView={() => handleUpdateSettings({ splitView: !settings.splitView })}
        onToggleAudio={() => {
          if (isPlayingAudio) {
            handlePauseAudio();
          } else {
            handleStartAudio(1);
          }
        }}
        isPlayingAudio={isPlayingAudio}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />

      {/* Main Scripture Reader Area */}
      <BibleReader
        primaryChapter={primaryChapter}
        secondaryChapter={secondaryChapter}
        currentBook={currentBook}
        currentChapterNum={currentChapterNum}
        isLoading={isLoading}
        error={error}
        selectedVerses={selectedVerses}
        highlights={highlights}
        bookmarks={bookmarks}
        notes={notes}
        activeAudioVerse={activeAudioVerse}
        settings={settings}
        onToggleVerseSelect={handleToggleVerseSelect}
        onPrevChapter={handlePrevChapter}
        onNextChapter={handleNextChapter}
        onOpenAiStudy={() => {
          if (selectedVerses.length === 0 && primaryChapter && primaryChapter.verses.length > 0) {
            setSelectedVerses([primaryChapter.verses[0]]);
          }
          setAiStudyOpen(true);
        }}
        onOpenNoteForVerse={handleOpenNoteForVerse}
        onRetry={() => loadScripture(currentBookId, currentChapterNum, currentTranslation, settings.splitView, settings.secondaryTranslation)}
      />

      {/* Contextual Floating Verse Toolbar (Appears on verse selection) */}
      <VerseActionToolbar
        selectedVerses={selectedVerses}
        currentBookName={currentBook.name}
        currentChapter={currentChapterNum}
        currentTranslation={currentTranslation}
        isBookmarked={isSelectedBookmarked}
        activeHighlightColor={activeHighlightColor}
        onHighlight={handleHighlight}
        onRemoveHighlight={handleRemoveHighlight}
        onToggleBookmark={handleToggleBookmark}
        onOpenNoteModal={() => {
          setActiveNoteVerse(selectedVerses[0]?.verse || 1);
          setNoteModalOpen(true);
        }}
        onOpenCompareModal={() => setCompareModalOpen(true)}
        onOpenAiStudy={() => setAiStudyOpen(true)}
        onOpenCardGenerator={() => setCardGeneratorOpen(true)}
        onListenFromVerse={() => {
          if (selectedVerses.length > 0) {
            handleStartAudio(selectedVerses[0].verse);
          }
        }}
        onClearSelection={handleClearSelection}
        settings={settings}
        isAudioBarActive={isPlayingAudio || activeAudioVerse !== null}
      />

      {/* Fixed Audio Player Bar (Appears during spoken recitation) */}
      <AudioPlayerBar
        isPlaying={isPlayingAudio}
        activeVerse={activeAudioVerse}
        bookName={currentBook.name}
        chapter={currentChapterNum}
        totalVerses={primaryChapter?.verses.length || 0}
        onPlay={handleResumeAudio}
        onPause={handlePauseAudio}
        onStop={handleStopAudio}
        onNextVerse={handleNextAudioVerse}
        onPrevVerse={handlePrevAudioVerse}
        settings={settings}
        onUpdateRate={(rate) => handleUpdateSettings({ audioRate: rate })}
      />

      {/* Mobile Bottom Navigation Bar (md:hidden) */}
      <BottomNav
        onOpenBooks={() => setBookSelectorOpen(true)}
        onOpenDailyVerse={() => setDevotionalOpen(true)}
        onOpenAiAssistant={() => setAiAssistantOpen(true)}
        onOpenReadingPlans={() => setPlansOpen(true)}
        onOpenLibrary={() => setLibraryOpen(true)}
        settings={settings}
      />

      {/* Modals and Side Drawers */}
      <BookSelectorModal
        isOpen={bookSelectorOpen}
        onClose={() => setBookSelectorOpen(false)}
        currentBookId={currentBookId}
        currentChapter={currentChapterNum}
        onSelectPassage={handleSelectPassage}
        settings={settings}
      />

      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigateToPassage={handleSelectPassage}
        settings={settings}
      />

      <PersonalLibraryModal
        isOpen={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        highlights={highlights}
        bookmarks={bookmarks}
        notes={notes}
        onDeleteHighlight={(id) => {
          const up = highlights.filter((h) => h.id !== id);
          setHighlights(up);
          saveHighlights(up);
        }}
        onDeleteBookmark={(id) => {
          const up = bookmarks.filter((b) => b.id !== id);
          setBookmarks(up);
          saveBookmarks(up);
        }}
        onDeleteNote={handleDeleteNote}
        onEditNote={(note) => {
          setActiveNoteVerse(note.verse);
          setNoteModalOpen(true);
        }}
        onNavigateToVerse={handleSelectPassage}
        settings={settings}
      />

      <ReadingPlansModal
        isOpen={plansOpen}
        onClose={() => setPlansOpen(false)}
        plans={readingPlans}
        onUpdatePlans={setReadingPlans}
        onNavigateToPassage={(bId, ch) => handleSelectPassage(bId, ch)}
        settings={settings}
      />

      <DailyDevotionalModal
        isOpen={devotionalOpen}
        onClose={() => setDevotionalOpen(false)}
        dailyVerse={getTodaysDailyVerse()}
        onNavigateToPassage={handleSelectPassage}
        streak={streak}
        onIncrementStreak={handleIncrementStreak}
        settings={settings}
      />

      <ReaderSettingsDrawer
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onResetSettings={handleResetSettings}
      />

      <AiStudyModal
        isOpen={aiStudyOpen}
        onClose={() => setAiStudyOpen(false)}
        reference={selectionRefStr}
        verseText={selectionTextStr}
        translation={currentTranslation}
        onNavigateToRef={handleSelectPassage}
        settings={settings}
      />

      <AiAssistantDrawer
        isOpen={aiAssistantOpen}
        onClose={() => setAiAssistantOpen(false)}
        currentPassage={`${currentBook.name} ${currentChapterNum}`}
        onNavigateToRef={handleSelectPassage}
        settings={settings}
      />

      <CompareTranslationsModal
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        bookName={currentBook.name}
        chapter={currentChapterNum}
        verse={selectedVerses[0]?.verse || 1}
        settings={settings}
      />

      <VerseCardGeneratorModal
        isOpen={cardGeneratorOpen}
        onClose={() => setCardGeneratorOpen(false)}
        reference={selectionRefStr}
        verseText={selectionTextStr}
        translation={currentTranslation}
        settings={settings}
      />

      <StudyNoteModal
        isOpen={noteModalOpen}
        onClose={() => setNoteModalOpen(false)}
        bookId={currentBookId}
        bookName={currentBook.name}
        chapter={currentChapterNum}
        verse={currentVerseForNote}
        verseText={noteVerseObj?.text || ''}
        existingNote={existingNoteForVerse}
        onSaveNote={handleSaveNote}
        onDeleteNote={handleDeleteNote}
        settings={settings}
      />
    </div>
  );
}
