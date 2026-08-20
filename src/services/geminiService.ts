import { AIStudyResult, AIDevotionalResult, ChatMessage } from '../types';

export async function fetchAIStudyInsights(
  reference: string,
  text: string,
  translation: string = 'KJV'
): Promise<AIStudyResult> {
  try {
    const res = await fetch('/api/gemini/study-verse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reference, text, translation }),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.warn('AI Study fetch failed, falling back to local commentary:', error);
    return {
      theologicalInsight: `A foundational reflection on ${reference}: This passage invites readers to meditate on God's sovereignty, enduring love, and steadfast truth.`,
      historicalContext: `Written in its historical biblical era, this text addresses the covenant community with timeless spiritual wisdom.`,
      originalLanguageNotes: `Key linguistic concepts in the original Hebrew/Greek emphasize divine faithfulness, covenantal love (Hesed/Agape), and righteous living.`,
      crossReferences: [
        { ref: 'Psalm 119:105', text: 'Your word is a lamp to my feet and a light to my path.' },
        { ref: 'Proverbs 3:5-6', text: 'Trust in the LORD with all your heart, and do not lean on your own understanding.' },
        { ref: 'Philippians 4:6-7', text: 'Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God.' }
      ],
      practicalApplication: [
        'Take a moment in silent contemplation to internalize the truth of this verse.',
        'Identify one concrete decision or challenge today where this truth can guide your response.',
        'Share or pray this scripture for a loved one or someone in need of encouragement.'
      ],
      reflectionQuestions: [
        'What does this passage reveal to you about God\'s character?',
        'How can you apply this truth in your daily routine and relationships?'
      ]
    };
  }
}

export async function askScriptureAI(
  question: string,
  currentPassage?: string,
  history: ChatMessage[] = []
): Promise<{ answer: string; suggestedVerses?: { ref: string; text: string }[]; followUpTopics?: string[] }> {
  try {
    const res = await fetch('/api/gemini/ask-scripture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, currentPassage, history }),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.warn('AI Ask Scripture failed, returning local response:', error);
    return {
      answer: `Thank you for your question on "${question}". Scripture provides enduring wisdom across both the Old and New Testaments. Take time to meditate on God's promises in prayer.`,
      suggestedVerses: [
        { ref: 'Psalm 23:1-3', text: 'The LORD is my shepherd; I shall not want.' },
        { ref: 'John 14:27', text: 'Peace I leave with you; my peace I give to you.' },
        { ref: 'Romans 8:28', text: 'And we know that all things work together for good to them that love God.' }
      ],
      followUpTopics: ['Finding peace in trials', 'What Jesus taught on faith', 'Daily prayer habits']
    };
  }
}

export async function fetchAIDevotional(
  reference: string,
  text: string,
  theme?: string
): Promise<AIDevotionalResult> {
  try {
    const res = await fetch('/api/gemini/devotional', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reference, text, theme }),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.warn('AI Devotional failed, returning default:', error);
    return {
      title: `Finding Peace in ${reference}`,
      theme: 'Faith & Trust',
      reflection: `As we meditate upon ${reference} ("${text}"), we are reminded that in every season of life, God's grace remains sufficient and His promises steadfast. Taking time to pause and align our hearts with this truth renews our spirit.`,
      guidedPrayer: `Heavenly Father, thank You for the living power of Your Word. Help me to carry the truth of ${reference} into my day. Guard my thoughts, direct my footsteps, and let Your peace dwell richly in my heart. In Jesus' name, Amen.`,
      actionStep: 'Take three deep breaths, recite this verse quietly, and choose faith over worry today.'
    };
  }
}

export const fetchDailyDevotionalReflection = fetchAIDevotional;
