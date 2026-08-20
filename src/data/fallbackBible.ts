import { BibleChapter, DailyVerse, ReadingPlan } from '../types';

// Pre-packaged offline chapters for instant zero-latency loading and reliable offline fallback
export const FALLBACK_CHAPTERS: Record<string, BibleChapter> = {
  'GEN_1': {
    book_id: 'GEN',
    book_name: 'Genesis',
    chapter: 1,
    translation: 'kjv',
    verses: [
      { book_id: 'GEN', book_name: 'Genesis', chapter: 1, verse: 1, text: 'In the beginning God created the heaven and the earth.' },
      { book_id: 'GEN', book_name: 'Genesis', chapter: 1, verse: 2, text: 'And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.' },
      { book_id: 'GEN', book_name: 'Genesis', chapter: 1, verse: 3, text: 'And God said, Let there be light: and there was light.' },
      { book_id: 'GEN', book_name: 'Genesis', chapter: 1, verse: 4, text: 'And God saw the light, that it was good: and God divided the light from the darkness.' },
      { book_id: 'GEN', book_name: 'Genesis', chapter: 1, verse: 5, text: 'And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day.' },
      { book_id: 'GEN', book_name: 'Genesis', chapter: 1, verse: 6, text: 'And God said, Let there be a firmament in the midst of the waters, and let it divide the waters from the waters.' },
      { book_id: 'GEN', book_name: 'Genesis', chapter: 1, verse: 7, text: 'And God made the firmament, and divided the waters which were under the firmament from the waters which were above the firmament: and it was so.' },
      { book_id: 'GEN', book_name: 'Genesis', chapter: 1, verse: 8, text: 'And God called the firmament Heaven. And the evening and the morning were the second day.' },
      { book_id: 'GEN', book_name: 'Genesis', chapter: 1, verse: 9, text: 'And God said, Let the waters under the heaven be gathered together unto one place, and let the dry land appear: and it was so.' },
      { book_id: 'GEN', book_name: 'Genesis', chapter: 1, verse: 10, text: 'And God called the dry land Earth; and the gathering together of the waters called he Seas: and God saw that it was good.' },
      { book_id: 'GEN', book_name: 'Genesis', chapter: 1, verse: 26, text: 'And God said, Let us make man in our image, after our likeness: and let them have dominion over the fish of the sea, and over the fowl of the air, and over the cattle, and over all the earth.' },
      { book_id: 'GEN', book_name: 'Genesis', chapter: 1, verse: 27, text: 'So God created man in his own image, in the image of God created he him; male and female created he them.' },
      { book_id: 'GEN', book_name: 'Genesis', chapter: 1, verse: 31, text: 'And God saw every thing that he had made, and, behold, it was very good. And the evening and the morning were the sixth day.' }
    ]
  },
  'PSA_23': {
    book_id: 'PSA',
    book_name: 'Psalms',
    chapter: 23,
    translation: 'kjv',
    verses: [
      { book_id: 'PSA', book_name: 'Psalms', chapter: 23, verse: 1, text: 'The LORD is my shepherd; I shall not want.' },
      { book_id: 'PSA', book_name: 'Psalms', chapter: 23, verse: 2, text: 'He maketh me to lie down in green pastures: he leadeth me beside the still waters.' },
      { book_id: 'PSA', book_name: 'Psalms', chapter: 23, verse: 3, text: 'He restoreth my soul: he leadeth me in the paths of righteousness for his name’s sake.' },
      { book_id: 'PSA', book_name: 'Psalms', chapter: 23, verse: 4, text: 'Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.' },
      { book_id: 'PSA', book_name: 'Psalms', chapter: 23, verse: 5, text: 'Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over.' },
      { book_id: 'PSA', book_name: 'Psalms', chapter: 23, verse: 6, text: 'Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the LORD for ever.' }
    ]
  },
  'PSA_91': {
    book_id: 'PSA',
    book_name: 'Psalms',
    chapter: 91,
    translation: 'kjv',
    verses: [
      { book_id: 'PSA', book_name: 'Psalms', chapter: 91, verse: 1, text: 'He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty.' },
      { book_id: 'PSA', book_name: 'Psalms', chapter: 91, verse: 2, text: 'I will say of the LORD, He is my refuge and my fortress: my God; in him will I trust.' },
      { book_id: 'PSA', book_name: 'Psalms', chapter: 91, verse: 3, text: 'Surely he shall deliver thee from the snare of the fowler, and from the noisome pestilence.' },
      { book_id: 'PSA', book_name: 'Psalms', chapter: 91, verse: 4, text: 'He shall cover thee with his feathers, and under his wings shalt thou trust: his truth shall be thy shield and buckler.' },
      { book_id: 'PSA', book_name: 'Psalms', chapter: 91, verse: 5, text: 'Thou shalt not be afraid for the terror by night; nor for the arrow that flieth by day;' },
      { book_id: 'PSA', book_name: 'Psalms', chapter: 91, verse: 11, text: 'For he shall give his angels charge over thee, to keep thee in all thy ways.' },
      { book_id: 'PSA', book_name: 'Psalms', chapter: 91, verse: 12, text: 'They shall bear thee up in their hands, lest thou dash thy foot against a stone.' }
    ]
  },
  'PRO_3': {
    book_id: 'PRO',
    book_name: 'Proverbs',
    chapter: 3,
    translation: 'kjv',
    verses: [
      { book_id: 'PRO', book_name: 'Proverbs', chapter: 3, verse: 1, text: 'My son, forget not my law; but let thine heart keep my commandments:' },
      { book_id: 'PRO', book_name: 'Proverbs', chapter: 3, verse: 2, text: 'For length of days, and long life, and peace, shall they add to thee.' },
      { book_id: 'PRO', book_name: 'Proverbs', chapter: 3, verse: 3, text: 'Let not mercy and truth forsake thee: bind them about thy neck; write them upon the table of thine heart:' },
      { book_id: 'PRO', book_name: 'Proverbs', chapter: 3, verse: 4, text: 'So shalt thou find favour and good understanding in the sight of God and man.' },
      { book_id: 'PRO', book_name: 'Proverbs', chapter: 3, verse: 5, text: 'Trust in the LORD with all thine heart; and lean not unto thine own understanding.' },
      { book_id: 'PRO', book_name: 'Proverbs', chapter: 3, verse: 6, text: 'In all thy ways acknowledge him, and he shall direct thy paths.' },
      { book_id: 'PRO', book_name: 'Proverbs', chapter: 3, verse: 7, text: 'Be not wise in thine own eyes: fear the LORD, and depart from evil.' },
      { book_id: 'PRO', book_name: 'Proverbs', chapter: 3, verse: 8, text: 'It shall be health to thy navel, and marrow to thy bones.' }
    ]
  },
  'MAT_5': {
    book_id: 'MAT',
    book_name: 'Matthew',
    chapter: 5,
    translation: 'kjv',
    verses: [
      { book_id: 'MAT', book_name: 'Matthew', chapter: 5, verse: 1, text: 'And seeing the multitudes, he went up into a mountain: and when he was set, his disciples came unto him:' },
      { book_id: 'MAT', book_name: 'Matthew', chapter: 5, verse: 2, text: 'And he opened his mouth, and taught them, saying,' },
      { book_id: 'MAT', book_name: 'Matthew', chapter: 5, verse: 3, text: 'Blessed are the poor in spirit: for theirs is the kingdom of heaven.', isWordsOfJesus: true },
      { book_id: 'MAT', book_name: 'Matthew', chapter: 5, verse: 4, text: 'Blessed are they that mourn: for they shall be comforted.', isWordsOfJesus: true },
      { book_id: 'MAT', book_name: 'Matthew', chapter: 5, verse: 5, text: 'Blessed are the meek: for they shall inherit the earth.', isWordsOfJesus: true },
      { book_id: 'MAT', book_name: 'Matthew', chapter: 5, verse: 6, text: 'Blessed are they which do hunger and thirst after righteousness: for they shall be filled.', isWordsOfJesus: true },
      { book_id: 'MAT', book_name: 'Matthew', chapter: 5, verse: 7, text: 'Blessed are the merciful: for they shall obtain mercy.', isWordsOfJesus: true },
      { book_id: 'MAT', book_name: 'Matthew', chapter: 5, verse: 8, text: 'Blessed are the pure in heart: for they shall see God.', isWordsOfJesus: true },
      { book_id: 'MAT', book_name: 'Matthew', chapter: 5, verse: 9, text: 'Blessed are the peacemakers: for they shall be called the children of God.', isWordsOfJesus: true },
      { book_id: 'MAT', book_name: 'Matthew', chapter: 5, verse: 14, text: 'Ye are the light of the world. A city that is set on an hill cannot be hid.', isWordsOfJesus: true },
      { book_id: 'MAT', book_name: 'Matthew', chapter: 5, verse: 16, text: 'Let your light so shine before men, that they may see your good works, and glorify your Father which is in heaven.', isWordsOfJesus: true }
    ]
  },
  'JHN_1': {
    book_id: 'JHN',
    book_name: 'John',
    chapter: 1,
    translation: 'kjv',
    verses: [
      { book_id: 'JHN', book_name: 'John', chapter: 1, verse: 1, text: 'In the beginning was the Word, and the Word was with God, and the Word was God.' },
      { book_id: 'JHN', book_name: 'John', chapter: 1, verse: 2, text: 'The same was in the beginning with God.' },
      { book_id: 'JHN', book_name: 'John', chapter: 1, verse: 3, text: 'All things were made by him; and without him was not any thing made that was made.' },
      { book_id: 'JHN', book_name: 'John', chapter: 1, verse: 4, text: 'In him was life; and the life was the light of men.' },
      { book_id: 'JHN', book_name: 'John', chapter: 1, verse: 5, text: 'And the light shineth in darkness; and the darkness comprehended it not.' },
      { book_id: 'JHN', book_name: 'John', chapter: 1, verse: 12, text: 'But as many as received him, to them gave he power to become the sons of God, even to them that believe on his name:' },
      { book_id: 'JHN', book_name: 'John', chapter: 1, verse: 14, text: 'And the Word was made flesh, and dwelt among us, (and we beheld his glory, the glory as of the only begotten of the Father,) full of grace and truth.' }
    ]
  },
  'JHN_3': {
    book_id: 'JHN',
    book_name: 'John',
    chapter: 3,
    translation: 'kjv',
    verses: [
      { book_id: 'JHN', book_name: 'John', chapter: 3, verse: 1, text: 'There was a man of the Pharisees, named Nicodemus, a ruler of the Jews:' },
      { book_id: 'JHN', book_name: 'John', chapter: 3, verse: 2, text: 'The same came to Jesus by night, and said unto him, Rabbi, we know that thou art a teacher come from God: for no man can do these miracles that thou doest, except God be with him.' },
      { book_id: 'JHN', book_name: 'John', chapter: 3, verse: 3, text: 'Jesus answered and said unto him, Verily, verily, I say unto thee, Except a man be born again, he cannot see the kingdom of God.', isWordsOfJesus: true },
      { book_id: 'JHN', book_name: 'John', chapter: 3, verse: 16, text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.', isWordsOfJesus: true },
      { book_id: 'JHN', book_name: 'John', chapter: 3, verse: 17, text: 'For God sent not his Son into the world to condemn the world; but that the world through him might be saved.', isWordsOfJesus: true }
    ]
  },
  'ROM_8': {
    book_id: 'ROM',
    book_name: 'Romans',
    chapter: 8,
    translation: 'kjv',
    verses: [
      { book_id: 'ROM', book_name: 'Romans', chapter: 8, verse: 1, text: 'There is therefore now no condemnation to them which are in Christ Jesus, who walk not after the flesh, but after the Spirit.' },
      { book_id: 'ROM', book_name: 'Romans', chapter: 8, verse: 28, text: 'And we know that all things work together for good to them that love God, to them who are the called according to his purpose.' },
      { book_id: 'ROM', book_name: 'Romans', chapter: 8, verse: 31, text: 'What shall we then say to these things? If God be for us, who can be against us?' },
      { book_id: 'ROM', book_name: 'Romans', chapter: 8, verse: 37, text: 'Nay, in all these things we are more than conquerors through him that loved us.' },
      { book_id: 'ROM', book_name: 'Romans', chapter: 8, verse: 38, text: 'For I am persuaded, that neither death, nor life, nor angels, nor principalities, nor powers, nor things present, nor things to come,' },
      { book_id: 'ROM', book_name: 'Romans', chapter: 8, verse: 39, text: 'Nor height, nor depth, nor any other creature, shall be able to separate us from the love of God, which is in Christ Jesus our Lord.' }
    ]
  },
  '1CO_13': {
    book_id: '1CO',
    book_name: '1 Corinthians',
    chapter: 13,
    translation: 'kjv',
    verses: [
      { book_id: '1CO', book_name: '1 Corinthians', chapter: 13, verse: 1, text: 'Though I speak with the tongues of men and of angels, and have not charity, I am become as sounding brass, or a tinkling cymbal.' },
      { book_id: '1CO', book_name: '1 Corinthians', chapter: 13, verse: 4, text: 'Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up,' },
      { book_id: '1CO', book_name: '1 Corinthians', chapter: 13, verse: 7, text: 'Beareth all things, believeth all things, hopeth all things, endureth all things.' },
      { book_id: '1CO', book_name: '1 Corinthians', chapter: 13, verse: 8, text: 'Charity never faileth: but whether there be prophecies, they shall fail; whether there be tongues, they shall cease; whether there be knowledge, it shall vanish away.' },
      { book_id: '1CO', book_name: '1 Corinthians', chapter: 13, verse: 13, text: 'And now abideth faith, hope, charity, these three; but the greatest of these is charity.' }
    ]
  },
  'REV_21': {
    book_id: 'REV',
    book_name: 'Revelation',
    chapter: 21,
    translation: 'kjv',
    verses: [
      { book_id: 'REV', book_name: 'Revelation', chapter: 21, verse: 1, text: 'And I saw a new heaven and a new earth: for the first heaven and the first earth were passed away; and there was no more sea.' },
      { book_id: 'REV', book_name: 'Revelation', chapter: 21, verse: 3, text: 'And I heard a great voice out of heaven saying, Behold, the tabernacle of God is with men, and he will dwell with them, and they shall be his people, and God himself shall be with them, and be their God.' },
      { book_id: 'REV', book_name: 'Revelation', chapter: 21, verse: 4, text: 'And God shall wipe away all tears from their eyes; and there shall be no more death, neither sorrow, nor crying, neither shall there be any more pain: for the former things are passed away.' },
      { book_id: 'REV', book_name: 'Revelation', chapter: 21, verse: 6, text: 'And he said unto me, It is done. I am Alpha and Omega, the beginning and the end. I will give unto him that is athirst of the fountain of the water of life freely.' }
    ]
  }
};

export const DAILY_VERSES: DailyVerse[] = [
  {
    reference: 'John 3:16',
    bookId: 'JHN',
    chapter: 3,
    verse: 16,
    text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
    topic: 'Unconditional Love & Salvation',
    devotionalSnippet: 'The greatest gift given by the greatest love. Let this infinite assurance anchor your heart in security today.'
  },
  {
    reference: 'Proverbs 3:5-6',
    bookId: 'PRO',
    chapter: 3,
    verse: 5,
    text: 'Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.',
    topic: 'Divine Guidance & Trust',
    devotionalSnippet: 'When human logic feels exhausted, divine direction opens paths through every unknown terrain.'
  },
  {
    reference: 'Philippians 4:6-7',
    bookId: 'PHP',
    chapter: 4,
    verse: 6,
    text: 'Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God. And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.',
    topic: 'Peace Over Anxiety',
    devotionalSnippet: 'Exchange the heavy burden of worry for the soothing, transcendent peace that only God provides.'
  },
  {
    reference: 'Isaiah 40:31',
    bookId: 'ISA',
    chapter: 40,
    verse: 31,
    text: 'But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.',
    topic: 'Renewed Strength & Endurance',
    devotionalSnippet: 'In quiet surrender and patient waiting, spiritual wings are forged to soar above life’s storms.'
  },
  {
    reference: 'Romans 8:28',
    bookId: 'ROM',
    chapter: 8,
    verse: 28,
    text: 'And we know that all things work together for good to them that love God, to them who are the called according to his purpose.',
    topic: 'Purpose & Providence',
    devotionalSnippet: 'No broken piece or unexpected detour is wasted; God weaves every thread into a masterpiece of grace.'
  },
  {
    reference: 'Psalm 23:1',
    bookId: 'PSA',
    chapter: 23,
    verse: 1,
    text: 'The LORD is my shepherd; I shall not want. He maketh me to lie down in green pastures: he leadeth me beside the still waters.',
    topic: 'Rest & Divine Care',
    devotionalSnippet: 'You are tenderly guarded by the Good Shepherd. You lack nothing necessary for your spiritual well-being.'
  },
  {
    reference: 'Joshua 1:9',
    bookId: 'JOS',
    chapter: 1,
    verse: 9,
    text: 'Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.',
    topic: 'Courage & Divine Presence',
    devotionalSnippet: 'Step forward boldly today. You are never walking into the future alone.'
  },
  {
    reference: 'Jeremiah 29:11',
    bookId: 'JER',
    chapter: 29,
    verse: 11,
    text: 'For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.',
    topic: 'Hope for the Future',
    devotionalSnippet: 'Your future is safely held in God’s intentional design filled with peace, blessing, and everlasting hope.'
  }
];

export const PRESET_READING_PLANS: ReadingPlan[] = [
  {
    id: 'plan_gospels_30',
    title: 'The Life of Christ: 30 Days in the Gospels',
    description: 'Walk through the life, miracles, parables, and resurrection of Jesus Christ across the four Gospels.',
    durationDays: 30,
    category: 'Gospels',
    currentDay: 1,
    days: [
      { day: 1, title: 'The Eternal Word Made Flesh', reading: 'John 1', bookId: 'JHN', chapter: 1, completed: false },
      { day: 2, title: 'The Birth of the Savior', reading: 'Luke 2', bookId: 'LUK', chapter: 2, completed: false },
      { day: 3, title: 'The Beatitudes & Kingdom Character', reading: 'Matthew 5', bookId: 'MAT', chapter: 5, completed: false },
      { day: 4, title: 'The Lord’s Prayer & Kingdom Priorities', reading: 'Matthew 6', bookId: 'MAT', chapter: 6, completed: false },
      { day: 5, title: 'Miracles of Compassion & Power', reading: 'Mark 4', bookId: 'MRK', chapter: 4, completed: false },
      { day: 6, title: 'The Good Samaritan & Love for Neighbor', reading: 'Luke 10', bookId: 'LUK', chapter: 10, completed: false },
      { day: 7, title: 'The Prodigal Son & Father’s Grace', reading: 'Luke 15', bookId: 'LUK', chapter: 15, completed: false },
      { day: 8, title: 'The Good Shepherd', reading: 'John 10', bookId: 'JHN', chapter: 10, completed: false },
      { day: 9, title: 'The True Vine & Abiding in Love', reading: 'John 15', bookId: 'JHN', chapter: 15, completed: false },
      { day: 10, title: 'The Great Commission', reading: 'Matthew 28', bookId: 'MAT', chapter: 28, completed: false },
      { day: 11, title: 'Nicodemus and New Birth', reading: 'John 3', bookId: 'JHN', chapter: 3, completed: false },
      { day: 12, title: 'The Woman at the Well', reading: 'John 4', bookId: 'JHN', chapter: 4, completed: false },
      { day: 13, title: 'Feeding the Multitudes', reading: 'John 6', bookId: 'JHN', chapter: 6, completed: false },
      { day: 14, title: 'Transfiguration of Christ', reading: 'Matthew 17', bookId: 'MAT', chapter: 17, completed: false }
    ]
  },
  {
    id: 'plan_psalms_peace_14',
    title: 'Psalms of Peace & Refuge (14 Days)',
    description: 'Find serenity, comfort, anxiety relief, and assurance in the most beloved Psalms of David.',
    durationDays: 14,
    category: 'Faith & Comfort',
    currentDay: 1,
    days: [
      { day: 1, title: 'The Blessed Tree by Living Streams', reading: 'Psalm 1', bookId: 'PSA', chapter: 1, completed: false },
      { day: 2, title: 'The Lord is My Shepherd', reading: 'Psalm 23', bookId: 'PSA', chapter: 23, completed: false },
      { day: 3, title: 'The Lord is My Light and My Salvation', reading: 'Psalm 27', bookId: 'PSA', chapter: 27, completed: false },
      { day: 4, title: 'Taste and See that the Lord is Good', reading: 'Psalm 34', bookId: 'PSA', chapter: 34, completed: false },
      { day: 5, title: 'God is Our Refuge and Strength', reading: 'Psalm 46', bookId: 'PSA', chapter: 46, completed: false },
      { day: 6, title: 'A Pure Heart Renewed', reading: 'Psalm 51', bookId: 'PSA', chapter: 51, completed: false },
      { day: 7, title: 'Under the Shadow of the Almighty', reading: 'Psalm 91', bookId: 'PSA', chapter: 91, completed: false },
      { day: 8, title: 'Make a Joyful Noise to the Lord', reading: 'Psalm 100', bookId: 'PSA', chapter: 100, completed: false },
      { day: 9, title: 'Bless the Lord, O My Soul', reading: 'Psalm 103', bookId: 'PSA', chapter: 103, completed: false },
      { day: 10, title: 'My Help Comes From the Lord', reading: 'Psalm 121', bookId: 'PSA', chapter: 121, completed: false },
      { day: 11, title: 'They That Sow in Tears Shall Reap in Joy', reading: 'Psalm 126', bookId: 'PSA', chapter: 126, completed: false },
      { day: 12, title: 'Fearfully and Wonderfully Made', reading: 'Psalm 139', bookId: 'PSA', chapter: 139, completed: false },
      { day: 13, title: 'Great is the Lord and Greatly to be Praised', reading: 'Psalm 145', bookId: 'PSA', chapter: 145, completed: false },
      { day: 14, title: 'Let Everything That Hath Breath Praise the Lord', reading: 'Psalm 150', bookId: 'PSA', chapter: 150, completed: false }
    ]
  },
  {
    id: 'plan_proverbs_wisdom_31',
    title: '31 Days of Proverbs: Daily Wisdom',
    description: 'Read one chapter of Proverbs each day to gain discernment, discipline, moral clarity, and practical guidance.',
    durationDays: 31,
    category: 'Wisdom',
    currentDay: 1,
    days: Array.from({ length: 31 }, (_, i) => ({
      day: i + 1,
      title: `Wisdom for Day ${i + 1}`,
      reading: `Proverbs ${i + 1}`,
      bookId: 'PRO',
      chapter: i + 1,
      completed: false
    }))
  },
  {
    id: 'plan_romans_foundations_16',
    title: 'Romans: Foundations of Faith (16 Days)',
    description: 'Deep dive into Paul’s theological masterwork on grace, justification, spiritual freedom, and life in the Spirit.',
    durationDays: 16,
    category: 'Foundation',
    currentDay: 1,
    days: Array.from({ length: 16 }, (_, i) => ({
      day: i + 1,
      title: `Romans Chapter ${i + 1}`,
      reading: `Romans ${i + 1}`,
      bookId: 'ROM',
      chapter: i + 1,
      completed: false
    }))
  }
];

export function getTodaysDailyVerse(): DailyVerse {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
  const index = Math.abs(dayOfYear % DAILY_VERSES.length);
  return DAILY_VERSES[index];
}
