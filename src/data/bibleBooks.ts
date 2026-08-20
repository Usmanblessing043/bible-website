import { BibleBook, Translation, BookCategory, Testament } from '../types';

export const BIBLE_BOOKS: BibleBook[] = [
  // OLD TESTAMENT (39 Books)
  // Law (Pentateuch / Torah)
  { id: 'GEN', name: 'Genesis', testament: 'OT', category: 'Law (Pentateuch)', chapters: 50, abbrev: 'Gen', order: 1, author: 'Moses', theme: 'Beginnings, Creation, Covenant' },
  { id: 'EXO', name: 'Exodus', testament: 'OT', category: 'Law (Pentateuch)', chapters: 40, abbrev: 'Exod', order: 2, author: 'Moses', theme: 'Deliverance, Law, Tabernacle' },
  { id: 'LEV', name: 'Leviticus', testament: 'OT', category: 'Law (Pentateuch)', chapters: 27, abbrev: 'Lev', order: 3, author: 'Moses', theme: 'Holiness, Sacrifices, Priesthood' },
  { id: 'NUM', name: 'Numbers', testament: 'OT', category: 'Law (Pentateuch)', chapters: 36, abbrev: 'Num', order: 4, author: 'Moses', theme: 'Wilderness Journey, Faithfulness' },
  { id: 'DEU', name: 'Deuteronomy', testament: 'OT', category: 'Law (Pentateuch)', chapters: 34, abbrev: 'Deut', order: 5, author: 'Moses', theme: 'Renewal of Covenant, Obedience' },

  // Historical Books
  { id: 'JOS', name: 'Joshua', testament: 'OT', category: 'Historical', chapters: 24, abbrev: 'Josh', order: 6, author: 'Joshua', theme: 'Conquest of Canaan, Promised Land' },
  { id: 'JDG', name: 'Judges', testament: 'OT', category: 'Historical', chapters: 21, abbrev: 'Judg', order: 7, author: 'Samuel (trad.)', theme: 'Cycles of Rebellion and Deliverance' },
  { id: 'RUT', name: 'Ruth', testament: 'OT', category: 'Historical', chapters: 4, abbrev: 'Ruth', order: 8, author: 'Unknown', theme: 'Loyalty, Redemption, Line of David' },
  { id: '1SA', name: '1 Samuel', testament: 'OT', category: 'Historical', chapters: 31, abbrev: '1Sam', order: 9, author: 'Samuel/Nathan/Gad', theme: 'Kingship, Saul and David' },
  { id: '2SA', name: '2 Samuel', testament: 'OT', category: 'Historical', chapters: 24, abbrev: '2Sam', order: 10, author: 'Nathan/Gad', theme: 'Reign of King David' },
  { id: '1KI', name: '1 Kings', testament: 'OT', category: 'Historical', chapters: 22, abbrev: '1Kgs', order: 11, author: 'Jeremiah (trad.)', theme: 'Solomon, Temple, Divided Kingdom' },
  { id: '2KI', name: '2 Kings', testament: 'OT', category: 'Historical', chapters: 25, abbrev: '2Kgs', order: 12, author: 'Jeremiah (trad.)', theme: 'Decline and Exile of Israel & Judah' },
  { id: '1CH', name: '1 Chronicles', testament: 'OT', category: 'Historical', chapters: 29, abbrev: '1Chr', order: 13, author: 'Ezra (trad.)', theme: 'Genealogies, Reign of David' },
  { id: '2CH', name: '2 Chronicles', testament: 'OT', category: 'Historical', chapters: 36, abbrev: '2Chr', order: 14, author: 'Ezra (trad.)', theme: 'Kings of Judah, Spiritual Revival' },
  { id: 'EZR', name: 'Ezra', testament: 'OT', category: 'Historical', chapters: 10, abbrev: 'Ezra', order: 15, author: 'Ezra', theme: 'Return from Exile, Rebuilding Temple' },
  { id: 'NEH', name: 'Nehemiah', testament: 'OT', category: 'Historical', chapters: 13, abbrev: 'Neh', order: 16, author: 'Nehemiah', theme: 'Rebuilding Walls of Jerusalem' },
  { id: 'EST', name: 'Esther', testament: 'OT', category: 'Historical', chapters: 10, abbrev: 'Esth', order: 17, author: 'Mordecai (trad.)', theme: 'God’s Providence and Deliverance' },

  // Poetry & Wisdom Literature
  { id: 'JOB', name: 'Job', testament: 'OT', category: 'Poetry & Wisdom', chapters: 42, abbrev: 'Job', order: 18, author: 'Unknown', theme: 'Suffering, God’s Sovereignty' },
  { id: 'PSA', name: 'Psalms', testament: 'OT', category: 'Poetry & Wisdom', chapters: 150, abbrev: 'Ps', order: 19, author: 'David, Asaph, Sons of Korah, etc.', theme: 'Worship, Lament, Praise, Prayer' },
  { id: 'PRO', name: 'Proverbs', testament: 'OT', category: 'Poetry & Wisdom', chapters: 31, abbrev: 'Prov', order: 20, author: 'Solomon, Agur, Lemuel', theme: 'Wisdom, Moral Living, Fear of the LORD' },
  { id: 'ECC', name: 'Ecclesiastes', testament: 'OT', category: 'Poetry & Wisdom', chapters: 12, abbrev: 'Eccl', order: 21, author: 'Solomon (trad.)', theme: 'Meaning of Life, Vanity of Earthly Pursuits' },
  { id: 'SNG', name: 'Song of Solomon', testament: 'OT', category: 'Poetry & Wisdom', chapters: 8, abbrev: 'Song', order: 22, author: 'Solomon', theme: 'Love, Marriage, Divine Affection' },

  // Major Prophets
  { id: 'ISA', name: 'Isaiah', testament: 'OT', category: 'Major Prophets', chapters: 66, abbrev: 'Isa', order: 23, author: 'Isaiah', theme: 'Messiah, Judgment, Comfort, Redemption' },
  { id: 'JER', name: 'Jeremiah', testament: 'OT', category: 'Major Prophets', chapters: 52, abbrev: 'Jer', order: 24, author: 'Jeremiah', theme: 'The Weeping Prophet, New Covenant' },
  { id: 'LAM', name: 'Lamentations', testament: 'OT', category: 'Major Prophets', chapters: 5, abbrev: 'Lam', order: 25, author: 'Jeremiah', theme: 'Lament over Jerusalem, God’s Compassion' },
  { id: 'EZK', name: 'Ezekiel', testament: 'OT', category: 'Major Prophets', chapters: 48, abbrev: 'Ezek', order: 26, author: 'Ezekiel', theme: 'Glory of God, Future Restoration' },
  { id: 'DAN', name: 'Daniel', testament: 'OT', category: 'Major Prophets', chapters: 12, abbrev: 'Dan', order: 27, author: 'Daniel', theme: 'God’s Dominion over Kingdoms, End Times' },

  // Minor Prophets
  { id: 'HOS', name: 'Hosea', testament: 'OT', category: 'Minor Prophets', chapters: 14, abbrev: 'Hos', order: 28, author: 'Hosea', theme: 'Unfailing Love and Faithfulness of God' },
  { id: 'JOL', name: 'Joel', testament: 'OT', category: 'Minor Prophets', chapters: 3, abbrev: 'Joel', order: 29, author: 'Joel', theme: 'Day of the LORD, Outpouring of Spirit' },
  { id: 'AMO', name: 'Amos', testament: 'OT', category: 'Minor Prophets', chapters: 9, abbrev: 'Amos', order: 30, author: 'Amos', theme: 'Social Justice, Righteousness' },
  { id: 'OBA', name: 'Obadiah', testament: 'OT', category: 'Minor Prophets', chapters: 1, abbrev: 'Obad', order: 31, author: 'Obadiah', theme: 'Judgment on Edom, Deliverance on Mount Zion' },
  { id: 'JON', name: 'Jonah', testament: 'OT', category: 'Minor Prophets', chapters: 4, abbrev: 'Jonah', order: 32, author: 'Jonah', theme: 'God’s Mercy to All Nations' },
  { id: 'MIC', name: 'Micah', testament: 'OT', category: 'Minor Prophets', chapters: 7, abbrev: 'Mic', order: 33, author: 'Micah', theme: 'Justice, Mercy, Ruler born in Bethlehem' },
  { id: 'NAM', name: 'Nahum', testament: 'OT', category: 'Minor Prophets', chapters: 3, abbrev: 'Nah', order: 34, author: 'Nahum', theme: 'Judgment on Nineveh' },
  { id: 'HAB', name: 'Habakkuk', testament: 'OT', category: 'Minor Prophets', chapters: 3, abbrev: 'Hab', order: 35, author: 'Habakkuk', theme: 'The Just Shall Live by Faith' },
  { id: 'ZEP', name: 'Zephaniah', testament: 'OT', category: 'Minor Prophets', chapters: 3, abbrev: 'Zeph', order: 36, author: 'Zephaniah', theme: 'Purification and Restoration' },
  { id: 'HAG', name: 'Haggai', testament: 'OT', category: 'Minor Prophets', chapters: 2, abbrev: 'Hag', order: 37, author: 'Haggai', theme: 'Rebuilding the House of the LORD' },
  { id: 'ZEC', name: 'Zechariah', testament: 'OT', category: 'Minor Prophets', chapters: 14, abbrev: 'Zech', order: 38, author: 'Zechariah', theme: 'Messianic Prophecies, Future Glory' },
  { id: 'MAL', name: 'Malachi', testament: 'OT', category: 'Minor Prophets', chapters: 4, abbrev: 'Mal', order: 39, author: 'Malachi', theme: 'Covenant Faithfulness, Sun of Righteousness' },

  // NEW TESTAMENT (27 Books)
  // Gospels
  { id: 'MAT', name: 'Matthew', testament: 'NT', category: 'Gospels', chapters: 28, abbrev: 'Matt', order: 40, author: 'Matthew (Levi)', theme: 'Jesus the Promised King and Messiah' },
  { id: 'MRK', name: 'Mark', testament: 'NT', category: 'Gospels', chapters: 16, abbrev: 'Mark', order: 41, author: 'John Mark', theme: 'Jesus the Servant and Miracle Worker' },
  { id: 'LUK', name: 'Luke', testament: 'NT', category: 'Gospels', chapters: 24, abbrev: 'Luke', order: 42, author: 'Luke the Physician', theme: 'Jesus the Son of Man and Savior of All' },
  { id: 'JHN', name: 'John', testament: 'NT', category: 'Gospels', chapters: 21, abbrev: 'John', order: 43, author: 'John the Apostle', theme: 'Jesus the Word Made Flesh, Eternal Life' },

  // Church History
  { id: 'ACT', name: 'Acts', testament: 'NT', category: 'Church History', chapters: 28, abbrev: 'Acts', order: 44, author: 'Luke', theme: 'Holy Spirit, Early Church, Spread of Gospel' },

  // Pauline Epistles
  { id: 'ROM', name: 'Romans', testament: 'NT', category: 'Pauline Epistles', chapters: 16, abbrev: 'Rom', order: 45, author: 'Paul', theme: 'Justification by Faith, Grace, Righteousness' },
  { id: '1CO', name: '1 Corinthians', testament: 'NT', category: 'Pauline Epistles', chapters: 16, abbrev: '1Cor', order: 46, author: 'Paul', theme: 'Church Unity, Spiritual Gifts, Love, Resurrection' },
  { id: '2CO', name: '2 Corinthians', testament: 'NT', category: 'Pauline Epistles', chapters: 13, abbrev: '2Cor', order: 47, author: 'Paul', theme: 'Ministry of Reconciliation, Strength in Weakness' },
  { id: 'GAL', name: 'Galatians', testament: 'NT', category: 'Pauline Epistles', chapters: 6, abbrev: 'Gal', order: 48, author: 'Paul', theme: 'Freedom in Christ, Fruit of the Spirit' },
  { id: 'EPH', name: 'Ephesians', testament: 'NT', category: 'Pauline Epistles', chapters: 6, abbrev: 'Eph', order: 49, author: 'Paul', theme: 'Armor of God, Unity in Body of Christ' },
  { id: 'PHP', name: 'Philippians', testament: 'NT', category: 'Pauline Epistles', chapters: 4, abbrev: 'Phil', order: 50, author: 'Paul', theme: 'Joy in the Lord, Humility of Christ' },
  { id: 'COL', name: 'Colossians', testament: 'NT', category: 'Pauline Epistles', chapters: 4, abbrev: 'Col', order: 51, author: 'Paul', theme: 'Supremacy of Christ, Fullness in Him' },
  { id: '1TH', name: '1 Thessalonians', testament: 'NT', category: 'Pauline Epistles', chapters: 5, abbrev: '1Thess', order: 52, author: 'Paul', theme: 'Hope of Christ’s Return, Holy Living' },
  { id: '2TH', name: '2 Thessalonians', testament: 'NT', category: 'Pauline Epistles', chapters: 3, abbrev: '2Thess', order: 53, author: 'Paul', theme: 'Perseverance, Day of the Lord' },
  { id: '1TI', name: '1 Timothy', testament: 'NT', category: 'Pauline Epistles', chapters: 6, abbrev: '1Tim', order: 54, author: 'Paul', theme: 'Pastoral Leadership, Sound Doctrine' },
  { id: '2TI', name: '2 Timothy', testament: 'NT', category: 'Pauline Epistles', chapters: 4, abbrev: '2Tim', order: 55, author: 'Paul', theme: 'Finishing the Race, Scripture Inspired' },
  { id: 'TIT', name: 'Titus', testament: 'NT', category: 'Pauline Epistles', chapters: 3, abbrev: 'Titus', order: 56, author: 'Paul', theme: 'Good Works, Godly Character' },
  { id: 'PHM', name: 'Philemon', testament: 'NT', category: 'Pauline Epistles', chapters: 1, abbrev: 'Phlm', order: 57, author: 'Paul', theme: 'Forgiveness and Brotherly Reconciliation' },

  // General Epistles
  { id: 'HEB', name: 'Hebrews', testament: 'NT', category: 'General Epistles', chapters: 13, abbrev: 'Heb', order: 58, author: 'Unknown / Paul', theme: 'Jesus Superior High Priest, Hall of Faith' },
  { id: 'JAS', name: 'James', testament: 'NT', category: 'General Epistles', chapters: 5, abbrev: 'Jas', order: 59, author: 'James the Brother of Jesus', theme: 'Living Faith, Wisdom in Trials, Taming Tongue' },
  { id: '1PE', name: '1 Peter', testament: 'NT', category: 'General Epistles', chapters: 5, abbrev: '1Pet', order: 60, author: 'Peter', theme: 'Living Hope in Suffering, Holy Living' },
  { id: '2PE', name: '2 Peter', testament: 'NT', category: 'General Epistles', chapters: 3, abbrev: '2Pet', order: 61, author: 'Peter', theme: 'Growing in Grace, Warning Against False Teachers' },
  { id: '1JN', name: '1 John', testament: 'NT', category: 'General Epistles', chapters: 5, abbrev: '1John', order: 62, author: 'John the Apostle', theme: 'God is Light and Love, Assurance of Salvation' },
  { id: '2JN', name: '2 John', testament: 'NT', category: 'General Epistles', chapters: 1, abbrev: '2John', order: 63, author: 'John the Apostle', theme: 'Walking in Truth and Love' },
  { id: '3JN', name: '3 John', testament: 'NT', category: 'General Epistles', chapters: 1, abbrev: '3John', order: 64, author: 'John the Apostle', theme: 'Christian Hospitality and Faithfulness' },
  { id: 'JUD', name: 'Jude', testament: 'NT', category: 'General Epistles', chapters: 1, abbrev: 'Jude', order: 65, author: 'Jude the Brother of James', theme: 'Contending for the Faith, Doxology' },

  // Prophecy & Apocalyptic
  { id: 'REV', name: 'Revelation', testament: 'NT', category: 'Prophecy & Apocalyptic', chapters: 22, abbrev: 'Rev', order: 66, author: 'John the Apostle', theme: 'Triumph of the Lamb, New Jerusalem, Christ’s Return' },
];

export const AVAILABLE_TRANSLATIONS: Translation[] = [
  {
    id: 'kjv',
    name: 'King James Version',
    shortName: 'KJV',
    language: 'English',
    description: 'Classic 1611 English translation renowned for its literary majesty, poetical cadence, and reverent beauty.',
    isPublicDomain: true,
  },
  {
    id: 'web',
    name: 'World English Bible',
    shortName: 'WEB',
    language: 'English',
    description: 'A clear, highly readable modern English public domain translation accurate to the original texts.',
    isPublicDomain: true,
  },
  {
    id: 'bbe',
    name: 'Bible in Basic English',
    shortName: 'BBE',
    language: 'English',
    description: 'Uses a simplified vocabulary of 1,000 words, wonderful for quick clarity and accessible reading.',
    isPublicDomain: true,
  },
  {
    id: 'asv',
    name: 'American Standard Version',
    shortName: 'ASV',
    language: 'English',
    description: 'Celebrated for its strict literal fidelity and scholarly word-for-word precision.',
    isPublicDomain: true,
  },
  {
    id: 'ylt',
    name: 'Young’s Literal Translation',
    shortName: 'YLT',
    language: 'English',
    description: 'Strictly literal translation reflecting the exact Hebrew and Greek verb tenses and idioms.',
    isPublicDomain: true,
  },
];

export const BIBLE_TRANSLATIONS = AVAILABLE_TRANSLATIONS;

export const BOOK_CATEGORIES: BookCategory[] = [
  'Law (Pentateuch)',
  'Historical',
  'Poetry & Wisdom',
  'Major Prophets',
  'Minor Prophets',
  'Gospels',
  'Church History',
  'Pauline Epistles',
  'General Epistles',
  'Prophecy & Apocalyptic',
];

export function getBookById(idOrName: string): BibleBook | undefined {
  const query = idOrName.toLowerCase().trim();
  return BIBLE_BOOKS.find(
    (b) =>
      b.id.toLowerCase() === query ||
      b.name.toLowerCase() === query ||
      b.abbrev.toLowerCase() === query
  );
}

export function getNextChapter(bookId: string, currentChapter: number): { bookId: string; chapter: number } {
  return getAdjacentChapter(bookId, currentChapter, 'next');
}

export function getPrevChapter(bookId: string, currentChapter: number): { bookId: string; chapter: number } {
  return getAdjacentChapter(bookId, currentChapter, 'prev');
}

export function getAdjacentChapter(
  currentBookId: string,
  currentChapter: number,
  direction: 'next' | 'prev'
): { bookId: string; chapter: number } {
  const currentBook = getBookById(currentBookId) || BIBLE_BOOKS[0];

  if (direction === 'next') {
    if (currentChapter < currentBook.chapters) {
      return { bookId: currentBook.id, chapter: currentChapter + 1 };
    }
    const nextBookIndex = BIBLE_BOOKS.findIndex((b) => b.id === currentBook.id) + 1;
    if (nextBookIndex < BIBLE_BOOKS.length) {
      return { bookId: BIBLE_BOOKS[nextBookIndex].id, chapter: 1 };
    }
    // Loop around to first book
    return { bookId: BIBLE_BOOKS[0].id, chapter: 1 };
  } else {
    if (currentChapter > 1) {
      return { bookId: currentBook.id, chapter: currentChapter - 1 };
    }
    const prevBookIndex = BIBLE_BOOKS.findIndex((b) => b.id === currentBook.id) - 1;
    if (prevBookIndex >= 0) {
      const prevBook = BIBLE_BOOKS[prevBookIndex];
      return { bookId: prevBook.id, chapter: prevBook.chapters };
    }
    // Loop to last book
    const lastBook = BIBLE_BOOKS[BIBLE_BOOKS.length - 1];
    return { bookId: lastBook.id, chapter: lastBook.chapters };
  }
}
