import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  BookOpen, 
  ArrowRight,
  Trash2
} from 'lucide-react';
import { ChatMessage, ReaderSettings } from '../types';
import { askScriptureAI } from '../services/geminiService';

interface AiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentPassage: string;
  onNavigateToRef: (bookId: string, chapter: number, verse?: number) => void;
  settings: ReaderSettings;
}

const SAMPLE_PROMPTS = [
  'What does scripture say about overcoming fear & anxiety?',
  'Explain the theological meaning of John 3:16',
  'How do the Old Testament covenants point to Jesus?',
  'What are the Beatitudes and how do we live them today?',
  'Find verses of hope and strength during difficult times',
];

export const AiAssistantDrawer: React.FC<AiAssistantDrawerProps> = ({
  isOpen,
  onClose,
  currentPassage,
  onNavigateToRef,
  settings,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Grace and peace to you! I am your AI Scripture & Theological Study Companion. You can ask me any question regarding biblical text, historical context, theological meanings, or finding scripture for life's challenges. Currently reading: **${currentPassage}**.`,
      suggestedVerses: [
        { ref: 'Psalm 119:105', text: 'Your word is a lamp to my feet and a light to my path.' },
        { ref: '2 Timothy 3:16-17', text: 'All Scripture is breathed out by God and profitable for teaching, for reproof, for correction, and for training in righteousness.' }
      ],
      timestamp: Date.now(),
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (questionText?: string) => {
    const q = (questionText || input).trim();
    if (!q || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await askScriptureAI(q, currentPassage, messages);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: res.answer,
        suggestedVerses: res.suggestedVerses,
        followUpTopics: res.followUpTopics,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: 'I apologize, but I encountered an issue connecting to the study server. Please try asking again.',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'assistant',
        text: `Conversation cleared. How can I assist your scripture study in **${currentPassage}**?`,
        timestamp: Date.now(),
      }
    ]);
  };

  const isDark = settings.theme === 'dark' || settings.theme === 'midnight';

  return (
    <div 
      id="ai-assistant-drawer-backdrop"
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="ai-assistant-drawer"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg h-full border-l shadow-2xl flex flex-col transition-all"
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
          className="p-4 border-b flex items-center justify-between gap-3"
          style={{ borderColor: isDark ? '#334155' : '#e8dec9' }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-500 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base sm:text-lg">Scripture Companion</h2>
              <p className="text-[11px] opacity-70">Theological Q&A & Spiritual Exploration</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              id="clear-ai-chat-btn"
              onClick={handleClearHistory}
              className="p-2 rounded-lg text-xs opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              title="Clear conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              id="close-ai-drawer-btn"
              onClick={onClose}
              className="p-2 rounded-lg text-sm hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 text-sm ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-amber-700/20 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 space-y-2.5 ${
                  msg.sender === 'user'
                    ? 'bg-amber-700 text-white rounded-tr-xs'
                    : 'border rounded-tl-xs'
                }`}
                style={{
                  backgroundColor: msg.sender === 'user' ? undefined : (isDark ? '#0f172a' : '#f5efe0'),
                  borderColor: msg.sender === 'user' ? undefined : (isDark ? '#1e293b' : '#ded4c0'),
                }}
              >
                <div className="whitespace-pre-line leading-relaxed text-xs sm:text-sm">
                  {msg.text}
                </div>

                {/* Suggested Verses */}
                {msg.suggestedVerses && msg.suggestedVerses.length > 0 && (
                  <div className="pt-2 border-t border-black/10 dark:border-white/10 space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      Key Scripture References
                    </span>
                    <div className="space-y-1">
                      {msg.suggestedVerses.map((v, idx) => (
                        <div
                          key={idx}
                          className="p-2 rounded-lg bg-black/5 dark:bg-white/5 text-xs space-y-0.5"
                        >
                          <span className="font-serif font-bold text-amber-700 dark:text-amber-400">
                            {v.ref}
                          </span>
                          <p className="opacity-80 italic line-clamp-2">"{v.text}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Follow up suggestions */}
                {msg.followUpTopics && msg.followUpTopics.length > 0 && (
                  <div className="pt-2 border-t border-black/10 dark:border-white/10 flex flex-wrap gap-1">
                    {msg.followUpTopics.map((topic, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(topic)}
                        className="text-[11px] px-2.5 py-1 rounded-full border border-amber-600/30 text-amber-700 dark:text-amber-300 hover:bg-amber-600/10 transition-colors"
                      >
                        {topic} →
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-full bg-amber-700 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3 text-xs opacity-70 p-2">
              <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
              <span>Consulting Scripture and theological commentaries...</span>
            </div>
          )}
        </div>

        {/* Prompt Suggestions Bar (if few messages) */}
        {messages.length < 3 && (
          <div 
            className="p-3 border-t overflow-x-auto no-scrollbar flex gap-1.5"
            style={{ borderColor: isDark ? '#1e293b' : '#f0e8d8' }}
          >
            {SAMPLE_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="text-[11px] px-3 py-1.5 rounded-full border whitespace-nowrap opacity-80 hover:opacity-100 hover:border-amber-600 transition-all"
                style={{
                  backgroundColor: isDark ? '#0f172a' : '#fbf8f2',
                  borderColor: isDark ? '#334155' : '#ded5c2',
                }}
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div 
          className="p-3 sm:p-4 border-t flex items-center gap-2"
          style={{ borderColor: isDark ? '#334155' : '#e8dec9' }}
        >
          <input
            id="ai-scripture-input"
            type="text"
            placeholder="Ask anything about scripture, themes, or life..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm border outline-none transition-all focus:ring-2 focus:ring-amber-500/50"
            style={{
              backgroundColor: isDark ? '#0f172a' : '#f5efe0',
              borderColor: isDark ? '#334155' : '#ded4c0',
            }}
          />
          <button
            id="send-ai-scripture-btn"
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl bg-amber-700 text-white hover:opacity-90 active:scale-95 disabled:opacity-40 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
