import { BibleChapter, BibleVerse, DailyVerse, Highlight, Bookmark, StudyNote, ReadingPlan, ReaderSettings } from '../types';
import { BIBLE_BOOKS, getBookById } from '../data/bibleBooks';
import { FALLBACK_CHAPTERS, DAILY_VERSES, PRESET_READING_PLANS } from '../data/fallbackBible';

const STORAGE_KEYS = {
  SETTINGS: 'scripture_reader_settings_v1',
  HIGHLIGHTS: 'scripture_highlights_v1',
  BOOKMARKS: 'scripture_bookmarks_v1',
  NOTES: 'scripture_notes_v1',
  READING_PLANS: 'scripture_reading_plans_v1',
  LAST_READ: 'scripture_last_read_v1',
  CHAPTER_CACHE: 'scripture_cached_chaps_v1',
  DAILY_STREAK: 'scripture_daily_streak_v1',
};

export const DEFAULT_SETTINGS: ReaderSettings = {
  theme: 'parchment',
  fontFamily: 'serif',
  fontSize: 19,
  lineHeight: 1.85,
  redLetter: true,
  showVerseNumbers: true,
  viewMode: 'paragraph',
  autoScrollAudio: true,
  audioRate: 1.0,
  audioPitch: 1.0,
  speechRate: 1.0,
  speechPitch: 1.0,
  splitView: false,
  secondaryTranslation: 'web',
};

// In-memory runtime cache
const memoryChapterCache = new Map<string, BibleChapter>();

/**
 * Fetch a chapter with multi-tier caching:
 * 1. Memory Cache
 * 2. LocalStorage Cache
 * 3. Backend Proxy (/api/bible/passage)
 * 4. Direct Public Bible API (bible-api.com)
 * 5. Pre-bundled Fallback Database
 */
export async function getChapter(
  bookIdOrName: string,
  chapterNumber: number,
  translation: string = 'kjv'
): Promise<BibleChapter> {
  const book = getBookById(bookIdOrName) || BIBLE_BOOKS[0];
  const normalizedTrans = translation.toLowerCase();
  const cacheKey = `${book.id}_${chapterNumber}_${normalizedTrans}`;

  // 1. Check memory cache
  if (memoryChapterCache.has(cacheKey)) {
    return memoryChapterCache.get(cacheKey)!;
  }

  // 2. Check localStorage cache
  try {
    const rawLocalCache = localStorage.getItem(STORAGE_KEYS.CHAPTER_CACHE);
    if (rawLocalCache) {
      const localCache = JSON.parse(rawLocalCache);
      if (localCache[cacheKey]) {
        memoryChapterCache.set(cacheKey, localCache[cacheKey]);
        return localCache[cacheKey];
      }
    }
  } catch (e) {
    console.warn('Failed reading chapter cache:', e);
  }

  // 3. Try to fetch from server proxy
  try {
    const res = await fetch(
      `/api/bible/passage?book=${encodeURIComponent(book.name)}&chapter=${chapterNumber}&translation=${normalizedTrans}`
    );
    if (res.ok) {
      const data = await res.json();
      if (data.verses && Array.isArray(data.verses) && data.verses.length > 0) {
        const chapterData: BibleChapter = {
          book_id: book.id,
          book_name: book.name,
          chapter: chapterNumber,
          translation: normalizedTrans,
          translation_name: data.translation_name || normalizedTrans.toUpperCase(),
          verses: data.verses.map((v: any, index: number) => ({
            book_id: book.id,
            book_name: book.name,
            chapter: chapterNumber,
            verse: v.verse || index + 1,
            text: (v.text || '').replace(/[\r\n]+/g, ' ').trim(),
            isWordsOfJesus: isLikelyWordsOfJesus(book.id, chapterNumber, v.verse || index + 1),
          })),
        };

        saveChapterToCache(cacheKey, chapterData);
        return chapterData;
      }
    }
  } catch (err) {
    console.warn('Server proxy failed, trying direct public bible API...', err);
  }

  // 4. Try direct public Bible API
  try {
    const directRes = await fetch(
      `https://bible-api.com/${encodeURIComponent(book.name)}+${chapterNumber}?translation=${normalizedTrans}`
    );
    if (directRes.ok) {
      const data = await directRes.json();
      if (data.verses && Array.isArray(data.verses) && data.verses.length > 0) {
        const chapterData: BibleChapter = {
          book_id: book.id,
          book_name: book.name,
          chapter: chapterNumber,
          translation: normalizedTrans,
          translation_name: data.translation_name || normalizedTrans.toUpperCase(),
          verses: data.verses.map((v: any, index: number) => ({
            book_id: book.id,
            book_name: book.name,
            chapter: chapterNumber,
            verse: v.verse || index + 1,
            text: (v.text || '').replace(/[\r\n]+/g, ' ').trim(),
            isWordsOfJesus: isLikelyWordsOfJesus(book.id, chapterNumber, v.verse || index + 1),
          })),
        };

        saveChapterToCache(cacheKey, chapterData);
        return chapterData;
      }
    }
  } catch (directErr) {
    console.warn('Direct fetch failed, falling back to local fallback data...', directErr);
  }

  // 5. Fallback pre-bundled data
  const fallbackKey = `${book.id}_${chapterNumber}`;
  if (FALLBACK_CHAPTERS[fallbackKey]) {
    const fallback = FALLBACK_CHAPTERS[fallbackKey];
    return {
      ...fallback,
      translation: normalizedTrans,
    };
  }

  // Generate dignified placeholder verses if completely offline & un-cached
  return generatePlaceholderChapter(book.id, book.name, chapterNumber, normalizedTrans);
}

export const fetchChapter = getChapter;

function saveChapterToCache(key: string, chapter: BibleChapter) {
  memoryChapterCache.set(key, chapter);
  try {
    const rawLocalCache = localStorage.getItem(STORAGE_KEYS.CHAPTER_CACHE);
    const localCache = rawLocalCache ? JSON.parse(rawLocalCache) : {};
    localCache[key] = chapter;
    const keys = Object.keys(localCache);
    if (keys.length > 50) {
      delete localCache[keys[0]];
    }
    localStorage.setItem(STORAGE_KEYS.CHAPTER_CACHE, JSON.stringify(localCache));
  } catch (e) {
    console.warn('Cache store error', e);
  }
}

function isLikelyWordsOfJesus(bookId: string, chapter: number, verse: number): boolean {
  if (['MAT', 'MRK', 'LUK', 'JHN'].includes(bookId)) {
    if (bookId === 'MAT' && chapter >= 5 && chapter <= 7) return true; // Sermon on Mount
    if (bookId === 'JHN' && (chapter >= 14 && chapter <= 17)) return true; // Farewell discourse
    if (bookId === 'JHN' && chapter === 3 && (verse >= 10 && verse <= 21)) return true;
    if (bookId === 'MAT' && (chapter === 28 && verse >= 18)) return true;
  }
  if (bookId === 'REV' && (chapter === 1 || chapter === 2 || chapter === 3 || chapter === 22)) {
    return true;
  }
  return false;
}

function generatePlaceholderChapter(bookId: string, bookName: string, chapter: number, translation: string): BibleChapter {
  const verses: BibleVerse[] = [];
  const count = 12;
  for (let v = 1; v <= count; v++) {
    verses.push({
      book_id: bookId,
      book_name: bookName,
      chapter: chapter,
      verse: v,
      text: `${bookName} ${chapter}:${v} — Meditation on holy scripture, wisdom, and eternal truth.`,
    });
  }
  return {
    book_id: bookId,
    book_name: bookName,
    chapter: chapter,
    verses,
    translation,
    translation_name: translation.toUpperCase(),
  };
}

// Local Storage Helper Utilities
export function getSavedSettings(): ReaderSettings {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
  } catch (e) {
    console.error(e);
  }
  return DEFAULT_SETTINGS;
}
export const loadSettings = getSavedSettings;

export function saveSettings(settings: ReaderSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error(e);
  }
}

export function getSavedHighlights(): Highlight[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.HIGHLIGHTS);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(e);
  }
  return [];
}
export const loadHighlights = getSavedHighlights;

export function saveHighlights(highlights: Highlight[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.HIGHLIGHTS, JSON.stringify(highlights));
  } catch (e) {
    console.error(e);
  }
}

export function getSavedBookmarks(): Bookmark[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(e);
  }
  return [];
}
export const loadBookmarks = getSavedBookmarks;

export function saveBookmarks(bookmarks: Bookmark[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
  } catch (e) {
    console.error(e);
  }
}

export function getSavedNotes(): StudyNote[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTES);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(e);
  }
  return [];
}
export const loadNotes = getSavedNotes;

export function saveNotes(notes: StudyNote[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  } catch (e) {
    console.error(e);
  }
}

export function getSavedReadingPlans(): ReadingPlan[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.READING_PLANS);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(e);
  }
  return PRESET_READING_PLANS;
}
export const loadReadingPlans = getSavedReadingPlans;

export function saveReadingPlans(plans: ReadingPlan[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.READING_PLANS, JSON.stringify(plans));
  } catch (e) {
    console.error(e);
  }
}

export function loadDailyStreak(): number {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.DAILY_STREAK);
    if (saved) return parseInt(saved, 10) || 1;
  } catch (e) {}
  return 1;
}

export function saveDailyStreak(streak: number): void {
  try {
    localStorage.setItem(STORAGE_KEYS.DAILY_STREAK, streak.toString());
  } catch (e) {}
}

export function getLastRead(): { bookId: string; chapter: number; verse?: number; translation: string } {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.LAST_READ);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return { bookId: 'JHN', chapter: 1, verse: 1, translation: 'kjv' };
}

export function saveLastRead(bookId: string, chapter: number, translation: string, verse?: number): void {
  try {
    localStorage.setItem(
      STORAGE_KEYS.LAST_READ,
      JSON.stringify({ bookId, chapter, translation, verse: verse || 1, timestamp: Date.now() })
    );
  } catch (e) {}
}

export function getTodaysVerse(): DailyVerse {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
  const index = Math.abs(dayOfYear % DAILY_VERSES.length);
  return DAILY_VERSES[index];
}

// Audio Speech Utility
export function speakText(
  text: string, 
  settings?: ReaderSettings, 
  onEnd?: () => void
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  window.speechSynthesis.cancel();

  const cleanText = text.replace(/<[^>]*>/g, '').trim();
  if (!cleanText) {
    if (onEnd) onEnd();
    return;
  }

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.rate = settings?.audioRate || settings?.speechRate || 1.0;
  utterance.pitch = settings?.audioPitch || settings?.speechPitch || 1.0;

  if (onEnd) {
    utterance.onend = () => {
      onEnd();
    };
    utterance.onerror = (e) => {
      console.warn('Speech synthesis utterance error:', e);
      onEnd();
    };
  }

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// Compare verse across multiple translations
export async function compareVerseTranslations(
  bookName: string,
  chapter: number,
  verse: number,
  translations: string[] = ['kjv', 'web', 'bbe', 'asv']
): Promise<{ translation: string; name: string; text: string }[]> {
  const results: { translation: string; name: string; text: string }[] = [];

  for (const t of translations) {
    try {
      const chap = await getChapter(bookName, chapter, t);
      const matched = chap.verses.find((v) => v.verse === verse);
      if (matched) {
        results.push({
          translation: t.toUpperCase(),
          name: chap.translation_name || t.toUpperCase(),
          text: matched.text,
        });
      }
    } catch (e) {
      console.warn(`Compare failed for ${t}:`, e);
    }
  }

  return results;
}
