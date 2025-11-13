// C:\Users\Yummie03\Desktop\datingapp\src\components\ChatScreen.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion"; // keep consistent with DiscoverMatches
import { ArrowLeft, Send, Mic, Languages, Sparkles } from "lucide-react";
import type { Match } from "./DiscoverMatches";
import { useTranslation } from "../hooks/useTranslation";

interface ChatScreenProps {
  match: Match;
  onBack: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: "user" | "match";
  timestamp: Date;
}

type ChatScreenTexts = {
  headerActiveNow: string;

  translateOptionEn: string;
  translateOptionEs: string;
  translateOptionJa: string;
  translateOptionFr: string;

  aiSuggestionsTitle: string;
  aiSuggestionsClose: string;

  quickReply1: string;
  quickReply2: string;
  quickReply3: string;
  quickReply4: string;

  aiSuggestion1: string;
  aiSuggestion2: string;
  aiSuggestion3: string;
  aiSuggestion4: string;

  inputPlaceholder: string;
};

// Default English UI texts (not including the seeded messages)
const defaultTexts: ChatScreenTexts = {
  headerActiveNow: "Active now",

  translateOptionEn: "Translate to English",
  translateOptionEs: "Translate to Spanish",
  translateOptionJa: "Translate to Japanese",
  translateOptionFr: "Translate to French",

  aiSuggestionsTitle: "AI Suggestions",
  aiSuggestionsClose: "Close",

  quickReply1: "That sounds amazing!",
  quickReply2: "Tell me more",
  quickReply3: "I'd love to hear about it",
  quickReply4: "What else do you enjoy?",

  aiSuggestion1: "Share your favorite travel memory",
  aiSuggestion2: "Ask about their hobbies",
  aiSuggestion3: "Suggest meeting for coffee",
  aiSuggestion4: "Talk about shared interests",

  inputPlaceholder: "Type a message...",
};

export function ChatScreen({ match, onBack }: ChatScreenProps) {
  // Seeded demo messages (left in English so they don't reset when translation finishes)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hey! I saw we both love travel. What's your favorite place you've visited?",
      sender: "user",
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: "2",
      text: "Hi! That's awesome! I absolutely loved Japan — the culture and food were incredible. How about you?",
      sender: "match",
      timestamp: new Date(Date.now() - 3000000),
    },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [showAIHelp, setShowAIHelp] = useState(false);
  const [showTranslate, setShowTranslate] = useState(false);

  const listRef = useRef<HTMLDivElement | null>(null);

  // i18n
  const { texts, loading: i18nLoading } = useTranslation(
    defaultTexts,
    "chatScreen"
  );
  const safeTexts: ChatScreenTexts =
    !texts || Object.keys(texts).length === 0 || !("headerActiveNow" in texts)
      ? defaultTexts
      : (texts as ChatScreenTexts);

  const quickReplies = [
    safeTexts.quickReply1,
    safeTexts.quickReply2,
    safeTexts.quickReply3,
    safeTexts.quickReply4,
  ];

  const aiSuggestions = [
    safeTexts.aiSuggestion1,
    safeTexts.aiSuggestion2,
    safeTexts.aiSuggestion3,
    safeTexts.aiSuggestion4,
  ];

  const handleSend = () => {
    const trimmed = newMessage.trim();
    if (!trimmed) return;

    const message: Message = {
      id: crypto.randomUUID(),
      text: trimmed,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");

    // Simulated reply
    setTimeout(() => {
      const response: Message = {
        id: crypto.randomUUID(),
        text: "That's so cool! I'd love to hear more about that. 😊",
        sender: "match",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, response]);
    }, 1200);
  };

  // Auto-scroll on new messages
  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length]);

  // ---------- HARD SKELETON WHILE LOADING TRANSLATIONS ----------
  if (i18nLoading) {
    return (
      <div className="min-h-screen bg-[#F2F4F8] flex flex-col">
        {/* Header skeleton */}
        <div className="bg-white shadow-sm p-4">
          <div className="flex items-center gap-4 max-w-md mx-auto">
            <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />
            <div className="flex-1 min-w-0">
              <div className="h-4 w-24 bg-gray-200 rounded-full animate-pulse mb-2" />
              <div className="h-3 w-20 bg-gray-200 rounded-full animate-pulse" />
            </div>
            <div className="w-8 h-8 rounded-xl bg-gray-200 animate-pulse" />
          </div>
        </div>

        {/* Translate bar skeleton */}
        <div className="bg-gray-50 border-b border-gray-100 p-4">
          <div className="max-w-md mx-auto flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-gray-200 animate-pulse" />
            <div className="flex-1 h-9 bg-gray-200 rounded-xl animate-pulse" />
          </div>
        </div>

        {/* Messages skeleton */}
        <div className="flex-1 overflow-y-auto p-4 pb-32">
          <div className="max-w-md mx-auto space-y-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`flex ${
                  i % 2 === 0 ? "justify-end" : "justify-start"
                }`}
              >
                <div className="max-w-[75%] px-4 py-3 rounded-2xl bg-gray-200/80">
                  <div className="h-3 w-32 bg-gray-300 rounded-full animate-pulse mb-2" />
                  <div className="h-3 w-24 bg-gray-300 rounded-full animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick replies skeleton */}
        <div className="fixed bottom-20 left-0 right-0 px-4 pb-2">
          <div className="max-w-md mx-auto flex gap-2 overflow-x-auto pb-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="bg-gray-200 h-8 w-28 rounded-full animate-pulse"
              />
            ))}
          </div>
        </div>

        {/* Input bar skeleton */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="max-w-md mx-auto flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gray-200 animate-pulse" />
            <div className="flex-1 h-10 bg-gray-200 rounded-2xl animate-pulse" />
            <div className="w-8 h-8 rounded-xl bg-gray-200 animate-pulse" />
            <div className="w-10 h-10 rounded-xl bg-gray-200 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // ---------- REAL UI (translations ready) ----------
  return (
    <div className="min-h-screen bg-[#F2F4F8] flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center gap-4 max-w-md mx-auto">
          <button
            onClick={onBack}
            className="text-[#4FC3F7]"
            aria-label="Back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1 min-w-0">
            <h3 className="text-gray-900 truncate">{match.name}</h3>
            <p className="text-gray-500 text-sm">{safeTexts.headerActiveNow}</p>
          </div>
          <button
            onClick={() => setShowTranslate((s) => !s)}
            className="text-[#4FC3F7] p-2 hover:bg-[#4FC3F7]/10 rounded-xl"
            aria-label="Translate"
          >
            <Languages className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Translate Bar */}
      {showTranslate && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="bg-[#4FC3F7]/10 border-b border-[#4FC3F7]/20 p-4"
        >
          <div className="max-w-md mx-auto flex items-center gap-3">
            <Languages className="w-5 h-5 text-[#4FC3F7]" />
            <select
              className="flex-1 px-3 py-2 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4FC3F7]"
              defaultValue="en"
            >
              <option value="en">{safeTexts.translateOptionEn}</option>
              <option value="es">{safeTexts.translateOptionEs}</option>
              <option value="ja">{safeTexts.translateOptionJa}</option>
              <option value="fr">{safeTexts.translateOptionFr}</option>
            </select>
          </div>
        </motion.div>
      )}

      {/* Messages */}
      <div ref={listRef} className="flex-1 overflow-y-auto p-4 pb-32">
        <div className="max-w-md mx-auto space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                  message.sender === "user"
                    ? "bg-gradient-to-r from-[#4FC3F7] to-[#81D4FA] text-white"
                    : "bg-white text-gray-900"
                }`}
              >
                <p className="text-sm break-words">{message.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender === "user"
                      ? "text-white/70"
                      : "text-gray-500"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Help Overlay */}
      {showAIHelp && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          className="fixed inset-x-0 bottom-24 bg-white rounded-t-3xl shadow-2xl p-6 max-h-[50vh] overflow-y-auto z-50"
        >
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#4FC3F7] flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                {safeTexts.aiSuggestionsTitle}
              </h3>
              <button
                onClick={() => setShowAIHelp(false)}
                className="text-gray-400 text-sm"
              >
                {safeTexts.aiSuggestionsClose}
              </button>
            </div>
            <div className="space-y-2">
              {aiSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setNewMessage(suggestion);
                    setShowAIHelp(false);
                  }}
                  className="w-full text-left px-4 py-3 bg-[#F2F4F8] rounded-xl text-gray-700 text-sm hover:bg-[#4FC3F7]/10 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Replies */}
      <div className="fixed bottom-20 left-0 right-0 px-4 pb-2">
        <div className="max-w-md mx-auto flex gap-2 overflow-x-auto pb-2">
          {quickReplies.map((reply, index) => (
            <button
              key={index}
              onClick={() => setNewMessage(reply)}
              className="bg-white text-gray-700 px-4 py-2 rounded-full text-sm whitespace-nowrap border border-gray-200 hover:border-[#4FC3F7] hover:text-[#4FC3F7] transition-colors"
            >
              {reply}
            </button>
          ))}
        </div>
      </div>

      {/* Input Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <button
            onClick={() => setShowAIHelp((s) => !s)}
            className="text-[#4FC3F7] p-2 hover:bg-[#4FC3F7]/10 rounded-xl"
            aria-label="AI suggestions"
          >
            <Sparkles className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={safeTexts.inputPlaceholder}
            className="flex-1 px-4 py-3 bg-[#F2F4F8] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#4FC3F7] text-sm"
          />
          <button
            className="text-[#4FC3F7] p-2 hover:bg-[#4FC3F7]/10 rounded-xl"
            aria-label="Voice"
          >
            <Mic className="w-5 h-5" />
          </button>
          <button
            onClick={handleSend}
            className="bg-gradient-to-r from-[#4FC3F7] to-[#81D4FA] text-white p-3 rounded-xl hover:shadow-lg transition-shadow"
            aria-label="Send"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
