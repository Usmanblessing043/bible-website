import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!ai && process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return ai;
}

// In-memory cache for bible passages to prevent excessive network requests
const passageCache = new Map<string, any>();

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Proxy and cache API for Bible passages
app.get("/api/bible/passage", async (req, res) => {
  const { book, chapter, translation = "kjv" } = req.query;
  if (!book || !chapter) {
    return res.status(400).json({ error: "Missing book or chapter parameter" });
  }

  const cacheKey = `${String(book).toLowerCase()}_${chapter}_${String(translation).toLowerCase()}`;
  if (passageCache.has(cacheKey)) {
    return res.json(passageCache.get(cacheKey));
  }

  try {
    const formattedBook = encodeURIComponent(String(book));
    const trans = encodeURIComponent(String(translation).toLowerCase());
    const apiUrl = `https://bible-api.com/${formattedBook}+${chapter}?translation=${trans}`;
    
    const response = await fetch(apiUrl);
    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch from Bible API" });
    }

    const data = await response.json();
    passageCache.set(cacheKey, data);
    res.json(data);
  } catch (error: any) {
    console.error("Bible API fetch error:", error);
    res.status(500).json({ error: error.message || "Failed to fetch passage" });
  }
});

// AI Verse Study & Theological Deep-Dive
app.post("/api/gemini/study-verse", async (req, res) => {
  const { reference, text, translation } = req.body;
  if (!reference || !text) {
    return res.status(400).json({ error: "Reference and text are required" });
  }

  const gemini = getGeminiClient();
  if (!gemini) {
    // Return structured graceful fallback if Gemini key is not configured
    return res.json({
      theologicalInsight: `A foundational reflection on ${reference}: This passage invites readers to meditate on God's sovereignty, enduring love, and steadfast truth.`,
      historicalContext: `Written in its historical biblical era, this text addresses the covenant community with timeless spiritual wisdom.`,
      originalLanguageNotes: `Key linguistic concepts in the original Hebrew/Greek emphasize divine faithfulness, covenantal love (Hesed/Agape), and righteous living.`,
      crossReferences: [
        { ref: "Psalm 119:105", text: "Your word is a lamp to my feet and a light to my path." },
        { ref: "Proverbs 3:5-6", text: "Trust in the LORD with all your heart, and do not lean on your own understanding." },
        { ref: "Philippians 4:6-7", text: "Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God." }
      ],
      practicalApplication: [
        "Take a moment in silent contemplation to internalize the truth of this verse.",
        "Identify one concrete decision or challenge today where this truth can guide your response.",
        "Share or pray this scripture for a loved one or someone in need of encouragement."
      ],
      reflectionQuestions: [
        "What does this passage reveal to you about God's character?",
        "How can you apply this truth in your daily routine and relationships?"
      ]
    });
  }

  try {
    const prompt = `You are a scholarly and compassionate Biblical scholar and theologian.
Analyze the following scripture passage:
Reference: ${reference} (${translation || "KJV"})
Verse Text: "${text}"

Provide a structured, rich, and spiritually uplifting study guide in JSON format with these exact keys:
1. "theologicalInsight": (string) Deep theological meaning, core spiritual doctrine, and divine message.
2. "historicalContext": (string) Historical background, author, cultural setting, and original audience.
3. "originalLanguageNotes": (string) Original Hebrew/Greek word nuances, root words, or literary styling.
4. "crossReferences": (array of objects with "ref" and "text") 3-4 connected biblical cross-references with their reference and brief verse summary.
5. "practicalApplication": (array of strings) 3 practical, concrete daily life applications for modern believers and seekers.
6. "reflectionQuestions": (array of strings) 2 thoughtful personal contemplation questions.

Return ONLY valid JSON matching this schema without markdown codeblocks or extra text.`;

    const response = await gemini.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text || "{}";
    const parsed = JSON.parse(responseText);
    res.json(parsed);
  } catch (error: any) {
    console.error("Gemini study-verse error:", error);
    res.status(500).json({ error: error.message || "Failed to generate study insights" });
  }
});

// AI Conversational Bible Companion / Ask Scripture
app.post("/api/gemini/ask-scripture", async (req, res) => {
  const { question, history = [], currentPassage } = req.body;
  if (!question) {
    return res.status(400).json({ error: "Question is required" });
  }

  const gemini = getGeminiClient();
  if (!gemini) {
    return res.json({
      answer: `Thank you for your question: "${question}". When studying scripture, comparing passages across the Old and New Testaments and meditating on God's promises provides profound clarity, comfort, and direction.`,
      suggestedVerses: [
        { ref: "Psalm 23:1-3", text: "The LORD is my shepherd; I shall not want. He makes me lie down in green pastures." },
        { ref: "John 14:27", text: "Peace I leave with you; my peace I give to you. Not as the world gives do I give to you." },
        { ref: "Romans 8:28", text: "And we know that for those who love God all things work together for good." }
      ]
    });
  }

  try {
    const contextInfo = currentPassage ? `Current reading passage context: ${currentPassage}\n` : "";
    const prompt = `You are a wise, gracious, knowledgeable Biblical Study Assistant.
${contextInfo}
User Question: "${question}"

Provide a warm, well-referenced, and accurate biblical response. Ground your answers in Holy Scripture, quote relevant chapter and verses, explain historical and spiritual context, and maintain a respectful, inspiring tone suitable for personal study and reflection.

Format your response as a JSON object with:
{
  "answer": (string with rich markdown formatting, headings, bullet points, and verse quotations),
  "suggestedVerses": (array of { "ref": string, "text": string }) 3 relevant verses for further study,
  "followUpTopics": (array of string) 3 related questions or biblical topics the user might explore next.
}
Return ONLY valid JSON.`;

    const response = await gemini.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text || "{}";
    const parsed = JSON.parse(responseText);
    res.json(parsed);
  } catch (error: any) {
    console.error("Gemini ask-scripture error:", error);
    res.status(500).json({ error: error.message || "Failed to answer question" });
  }
});

// AI Devotional & Prayer Generator
app.post("/api/gemini/devotional", async (req, res) => {
  const { reference, text } = req.body;
  if (!reference || !text) {
    return res.status(400).json({ error: "Reference and text required" });
  }

  const gemini = getGeminiClient();
  if (!gemini) {
    return res.json({
      title: `Finding Peace in ${reference}`,
      theme: "Faith & Trust",
      reflection: `As we meditate upon ${reference} ("${text}"), we are reminded that in every season of life, God's grace remains sufficient and His promises steadfast. Taking time to pause and align our hearts with this truth renews our spirit.`,
      guidedPrayer: `Heavenly Father, thank You for the living power of Your Word. Help me to carry the truth of ${reference} into my day. Guard my thoughts, direct my footsteps, and let Your peace dwell richly in my heart. In Jesus' name, Amen.`,
      actionStep: "Take three deep breaths, recite this verse quietly, and choose faith over worry today."
    });
  }

  try {
    const prompt = `Create a heart-touching daily devotional and guided prayer based on this scripture:
Reference: ${reference}
Verse Text: "${text}"

Provide a JSON object with:
{
  "title": (string) inspiring devotional title,
  "theme": (string) core spiritual theme (e.g., Peace, Courage, Grace, Hope),
  "reflection": (string) 2-3 paragraph devotional reflection,
  "guidedPrayer": (string) warm, heartfelt guided prayer,
  "actionStep": (string) a practical daily faith challenge.
}
Return ONLY valid JSON.`;

    const response = await gemini.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Gemini devotional error:", error);
    res.status(500).json({ error: error.message || "Failed to generate devotional" });
  }
});

// Vite & Static serving setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Scripture Bible Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
