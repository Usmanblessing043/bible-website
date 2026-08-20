export type Testament = 'OT' | 'NT';

export type BookCategory = 
  | 'Law (Pentateuch)'
  | 'Historical'
  | 'Poetry & Wisdom'
  | 'Major Prophets'
  | 'Minor Prophets'
  | 'Gospels'
  | 'Church History'
  | 'Pauline Epistles'
  | 'General Epistles'
  | 'Prophecy & Apocalyptic';

export interface BibleBook {
  id: string;
  name: string;
  testament: Testament;
  category: BookCategory;
  chapters: number;
  abbrev: string;
  order: number;
  author?: string;
  theme?: string;
}

export interface BibleVerse {
  book_id: string;
  book_name: string;
  chapter: number;
  verse: number;
  text: string;
  isWordsOfJesus?: boolean;
}

export interface BibleChapter {
  book_id: string;
  book_name: string;
  chapter: number;
  verses: BibleVerse[];
  translation: string;
  translation_name?: string;
}

export interface Translation {
  id: string;
  name: string;
  shortName: string;
  language: string;
  description: string;
  isPublicDomain: boolean;
}

export type HighlightColor = 'gold' | 'emerald' | 'sky' | 'rose' | 'lavender';

export interface Highlight {
  id: string;
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  color: HighlightColor;
  text: string;
  createdAt: number;
}

export interface Bookmark {
  id: string;
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  createdAt: number;
  snippet: string;
}

export interface StudyNote {
  id: string;
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  verseText: string;
  title: string;
  content: string;
  tags: string[];
  updatedAt: number;
}

export interface ReadingPlanDay {
  day: number;
  title: string;
  reading: string;
  bookId: string;
  chapter: number;
  verseRange?: string;
  completed: boolean;
}

export interface ReadingPlan {
  id: string;
  title: string;
  description: string;
  durationDays: number;
  category: 'Gospels' | 'Wisdom' | 'Faith & Comfort' | 'Foundation' | 'Comprehensive';
  days: ReadingPlanDay[];
  currentDay: number;
  joinedAt?: number;
}

export type ReaderTheme = 'parchment' | 'light' | 'sepia' | 'dark' | 'midnight';
export type FontFamily = 'serif' | 'sans' | 'mono' | 'garamond';
export type ReaderFontFamily = FontFamily;
export type ViewMode = 'paragraph' | 'verse-by-verse';

export interface ReaderSettings {
  theme: ReaderTheme;
  fontFamily: FontFamily;
  fontSize: number; // in px e.g. 18
  lineHeight: number; // e.g. 1.8
  redLetter: boolean;
  showVerseNumbers: boolean;
  viewMode: ViewMode;
  autoScrollAudio: boolean;
  audioRate: number; // 0.75 - 1.5
  audioPitch?: number; // 0.8 - 1.2
  speechRate?: number;
  speechPitch?: number;
  speechVoiceName?: string;
  splitView: boolean;
  secondaryTranslation: string;
}

export interface DailyVerse {
  reference: string;
  bookId: string;
  bookName?: string;
  chapter: number;
  verse: number;
  text: string;
  topic?: string;
  theme?: string;
  devotionalSnippet?: string;
}

export interface CrossReference {
  ref: string;
  text: string;
}

export interface AIStudyResult {
  theologicalInsight: string;
  historicalContext: string;
  originalLanguageNotes: string;
  crossReferences: CrossReference[];
  practicalApplication: string[];
  reflectionQuestions: string[];
}

export interface AIDevotionalResult {
  title: string;
  theme: string;
  reflection: string;
  guidedPrayer: string;
  prayer?: string;
  actionStep: string;
}

export type DevotionalReflection = AIDevotionalResult;

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  suggestedVerses?: { ref: string; text: string }[];
  followUpTopics?: string[];
  timestamp: number;
}
