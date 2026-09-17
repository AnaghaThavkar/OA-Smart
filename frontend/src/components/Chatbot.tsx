import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { ApiClient } from '../services/api/client';
import { translations, Language } from '../i18n/translations';

interface ChatbotProps {
  language: Language;
  isOpen: boolean;
  onToggle: () => void;
}

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
}

export function Chatbot({ language, isOpen, onToggle }: ChatbotProps) {
  const t = translations[language].chat;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial',
      sender: 'bot',
      text: language === 'hi'
        ? "नमस्ते! मैं आपका OA-SMART स्वास्थ्य सहायक हूँ। मैं डुअल MPU6050 सेंसर लगाने, सिट-टू-स्टैंड टेस्ट और 15 ML फीचर्स को समझने में आपकी सहायता कर सकता हूँ।"
        : language === 'mr'
        ? "नमस्कार! मी आपला OA-SMART आरोग्य सहाय्यक आहे. मी सेन्सर जोडणी, उठणे-बसणे चाचणी आणि 15 एआय वैशिष्ट्ये समजून सांगण्यास मदत करू शकतो."
        : "Hello! I am your OA-SMART Healthcare Assistant. Ask me about Dual MPU6050 sensor placement, the 30-sec Sit-to-Stand protocol, the 15 ML features, or interpreting risk scores.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quickPrompts, setQuickPrompts] = useState<string[]>([
    language === 'hi' ? "सेंसर कैसे लगाएं?" : language === 'mr' ? "सेन्सर कसा लावावा?" : "How to place MPU6050 sensors?",
    language === 'hi' ? "सिट-टू-स्टैंड निर्देश" : language === 'mr' ? "उठण्या-बसण्याची चाचणी" : "Sit-to-stand instructions",
    language === 'hi' ? "15 फीचर्स स्पष्ट करें" : language === 'mr' ? "15 वैशिष्ट्ये सांगा" : "Explain 15 features",
    language === 'hi' ? "उच्च जोखिम का अर्थ" : language === 'mr' ? "उच्च धोका म्हणजे काय?" : "What does High Risk mean?",
    language === 'hi' ? "पॉजिटिव स्क्रीनिंग के बाद क्या करें?" : language === 'mr' ? "पॉझिटिव्ह आल्यावर काय करावे?" : "Next steps after positive screening"
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const message = (textToSend || inputMessage).trim();
    if (!message || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const res = await ApiClient.sendChatMessage(message, language);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
      if (res.suggested_actions && res.suggested_actions.length > 0) {
        setQuickPrompts(res.suggested_actions);
      }
    } catch (err) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: "Error communicating with the assistant. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={onToggle}
        className={`fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-lg transition-all duration-200 active:scale-95 ${
          isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'
        }`}
        title={t.openAssistant}
      >
        <Bot className="w-5 h-5" />
        <span className="hidden sm:inline">{t.openAssistant}</span>
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
      </button>

      {/* Chat Window Panel - Responsive Bottom Sheet on Mobile, Floating Card on Desktop */}
      {isOpen && (
        <div className="fixed bottom-0 sm:bottom-6 right-0 sm:right-6 z-50 w-full sm:max-w-md h-[90vh] sm:h-[560px] bg-white dark:bg-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl border-t sm:border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="px-4 py-3.5 bg-teal-600 text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-700 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight">{t.title}</h3>
                <p className="text-[11px] text-teal-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                  {t.subtitle}
                </p>
              </div>
            </div>
            <button
              onClick={onToggle}
              className="p-1 rounded-lg hover:bg-teal-700/80 text-teal-100 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Medical Notice Banner */}
          <div className="px-3.5 py-1.5 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800/50 flex items-center gap-2 text-[10px] text-amber-800 dark:text-amber-300 leading-tight">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
            <span>{t.disclaimer}</span>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 dark:bg-slate-900/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-teal-600 text-white rounded-br-xs shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-xs shadow-2xs'
                  }`}
                >
                  {msg.text}
                  <div
                    className={`text-[9px] mt-1 text-right ${
                      msg.sender === 'user' ? 'text-teal-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 italic p-1">
                <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
                <span>Assistant is analyzing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips */}
          <div className="p-2 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-x-auto flex items-center gap-1.5 no-scrollbar">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider shrink-0 ml-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
            </span>
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="shrink-0 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-teal-50 dark:hover:bg-teal-900/40 hover:text-teal-700 dark:hover:text-teal-300 border border-slate-200 dark:border-slate-600 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={t.inputPlaceholder}
              className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-40 transition-colors shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
