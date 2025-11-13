// C:\Users\Yummie03\Desktop\datingapp\src\components\AIQuestionsModal.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Sparkles, ChevronRight } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";

export interface AIQuestionsModalProps {
  onClose: () => void;
  onAnswer: (question: string, answer: string) => void;
}

type Question = {
  id: string;
  question: string;
  options: string[];
};

type AIQuestionsTexts = {
  headerTitle: string;
  progressLabel: string; // "Question {current} of {total}"
  customAnswerLabel: string;
  customAnswerPlaceholder: string;
  skipLabel: string;
  nextLabel: string;
  finishLabel: string;
  footerHint: string;

  q1Title: string;
  q1Opt1: string;
  q1Opt2: string;
  q1Opt3: string;
  q1Opt4: string;

  q2Title: string;
  q2Opt1: string;
  q2Opt2: string;
  q2Opt3: string;
  q2Opt4: string;

  q3Title: string;
  q3Opt1: string;
  q3Opt2: string;
  q3Opt3: string;
  q3Opt4: string;

  q4Title: string;
  q4Opt1: string;
  q4Opt2: string;
  q4Opt3: string;
  q4Opt4: string;
};

// Default English texts – will be translated via useTranslation("aiQuestions")
const defaultTexts: AIQuestionsTexts = {
  headerTitle: "AI Questions",
  progressLabel: "Question {current} of {total}",
  customAnswerLabel: "Or write your own answer:",
  customAnswerPlaceholder: "Type your answer...",
  skipLabel: "Skip",
  nextLabel: "Next",
  finishLabel: "Finish",
  footerHint: "🎁 Each answer improves your match quality by 5%",

  q1Title: "What's your ideal way to spend a weekend?",
  q1Opt1: "Outdoor adventures",
  q1Opt2: "Relaxing at home",
  q1Opt3: "Socializing with friends",
  q1Opt4: "Exploring new places",

  q2Title: "How do you handle conflicts in relationships?",
  q2Opt1: "Direct communication",
  q2Opt2: "Need time to process",
  q2Opt3: "Seek compromise",
  q2Opt4: "Avoid confrontation",

  q3Title: "What's most important to you in a partner?",
  q3Opt1: "Emotional intelligence",
  q3Opt2: "Sense of humor",
  q3Opt3: "Ambition",
  q3Opt4: "Kindness",

  q4Title: "How do you prefer to show affection?",
  q4Opt1: "Words of affirmation",
  q4Opt2: "Quality time",
  q4Opt3: "Physical touch",
  q4Opt4: "Acts of service",
};

export function AIQuestionsModal({ onClose, onAnswer }: AIQuestionsModalProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);

  // i18n
  const { texts, loading: i18nLoading } = useTranslation(
    defaultTexts,
    "aiQuestions"
  );

  const safeTexts: AIQuestionsTexts =
    !texts || Object.keys(texts).length === 0 || !("headerTitle" in texts)
      ? defaultTexts
      : (texts as AIQuestionsTexts);

  const QUESTIONS: Question[] = [
    {
      id: "1",
      question: safeTexts.q1Title,
      options: [safeTexts.q1Opt1, safeTexts.q1Opt2, safeTexts.q1Opt3, safeTexts.q1Opt4],
    },
    {
      id: "2",
      question: safeTexts.q2Title,
      options: [safeTexts.q2Opt1, safeTexts.q2Opt2, safeTexts.q2Opt3, safeTexts.q2Opt4],
    },
    {
      id: "3",
      question: safeTexts.q3Title,
      options: [safeTexts.q3Opt1, safeTexts.q3Opt2, safeTexts.q3Opt3, safeTexts.q3Opt4],
    },
    {
      id: "4",
      question: safeTexts.q4Title,
      options: [safeTexts.q4Opt1, safeTexts.q4Opt2, safeTexts.q4Opt3, safeTexts.q4Opt4],
    },
  ];

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === QUESTIONS.length - 1;

  const handleNext = () => {
    const answer = selectedAnswer.trim();
    if (!answer) return;

    onAnswer(currentQuestion.question, answer);

    const nextProgress = ((currentQuestionIndex + 1) / QUESTIONS.length) * 100;
    setProgress(nextProgress);

    if (isLastQuestion) {
      // small delay to let the progress bar animate to 100%
      setTimeout(onClose, 400);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer("");
    }
  };

  const handleSkip = () => {
    if (isLastQuestion) {
      onClose();
    } else {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setSelectedAnswer("");
      setProgress((nextIndex / QUESTIONS.length) * 100);
    }
  };

  const isCustomAnswer =
    selectedAnswer && !currentQuestion.options.includes(selectedAnswer);

  const progressLabel = safeTexts.progressLabel
    .replace("{current}", String(currentQuestionIndex + 1))
    .replace("{total}", String(QUESTIONS.length));

  // ---------- HARD SKELETON: block all interaction until translations are ready ----------
  if (i18nLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md sm:mx-4 max-h-[90vh] overflow-hidden"
          role="dialog"
          aria-modal="true"
        >
          {/* Header skeleton */}
          <div className="sticky top-0 bg-white border-b border-gray-100 p-6 rounded-t-3xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-gray-200 animate-pulse" />
                <div className="h-4 w-24 bg-gray-200 rounded-full animate-pulse" />
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            </div>

            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full w-1/2 bg-gray-200 animate-pulse" />
            </div>
            <div className="h-3 w-32 bg-gray-200 rounded-full mt-2 animate-pulse" />
          </div>

          {/* Body skeleton */}
          <div className="p-6 space-y-4">
            <div className="h-4 w-3/4 bg-gray-200 rounded-full animate-pulse" />
            <div className="space-y-3 mt-4">
              <div className="h-11 w-full bg-gray-100 rounded-2xl animate-pulse" />
              <div className="h-11 w-full bg-gray-100 rounded-2xl animate-pulse" />
              <div className="h-11 w-full bg-gray-100 rounded-2xl animate-pulse" />
              <div className="h-11 w-full bg-gray-100 rounded-2xl animate-pulse" />
            </div>
            <div className="mt-4">
              <div className="h-3 w-40 bg-gray-200 rounded-full mb-2 animate-pulse" />
              <div className="h-10 w-full bg-gray-100 rounded-xl animate-pulse" />
            </div>
            <div className="flex gap-3 mt-4">
              <div className="flex-1 h-11 bg-gray-100 rounded-2xl animate-pulse" />
              <div className="flex-1 h-11 bg-gray-100 rounded-2xl animate-pulse" />
            </div>
          </div>

          {/* Footer skeleton */}
          <div className="p-6 pt-0">
            <div className="bg-gray-100 p-4 rounded-2xl">
              <div className="h-3 w-48 bg-gray-200 rounded-full mx-auto animate-pulse" />
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ---------- REAL MODAL (translations ready) ----------
  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md sm:mx-4 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-questions-title"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#4FC3F7]" />
              <h3 id="ai-questions-title" className="text-[#4FC3F7]">
                {safeTexts.headerTitle}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-[#4FC3F7] to-[#81D4FA]"
            />
          </div>
          <p className="text-gray-500 text-xs mt-2">
            {progressLabel}
          </p>
        </div>

        {/* Question Content */}
        <div className="p-6">
          <motion.div
            key={currentQuestion.id}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
          >
            <h4 className="text-gray-900 mb-6">{currentQuestion.question}</h4>

            <div className="space-y-3 mb-6">
              {currentQuestion.options.map((option) => (
                <button
                  key={option}
                  onClick={() => setSelectedAnswer(option)}
                  className={`w-full text-left px-4 py-4 rounded-2xl border-2 transition-all ${
                    selectedAnswer === option
                      ? "border-[#4FC3F7] bg-[#4FC3F7]/10"
                      : "border-gray-200 hover:border-[#4FC3F7]/50"
                  }`}
                  aria-pressed={selectedAnswer === option}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">{option}</span>
                    {selectedAnswer === option && (
                      <div className="w-5 h-5 bg-[#4FC3F7] rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Custom Answer Input */}
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm mb-2"
                htmlFor="custom-answer"
              >
                {safeTexts.customAnswerLabel}
              </label>
              <input
                id="custom-answer"
                type="text"
                value={isCustomAnswer ? selectedAnswer : ""}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                placeholder={safeTexts.customAnswerPlaceholder}
                className="w-full px-4 py-3 bg-[#F2F4F8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4FC3F7] text-sm"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleSkip}
                className="flex-1 py-3 border-2 border-gray-200 text-gray-600 rounded-2xl hover:bg-gray-50 transition-colors"
              >
                {safeTexts.skipLabel}
              </button>
              <button
                onClick={handleNext}
                disabled={!selectedAnswer.trim()}
                className="flex-1 py-3 bg-gradient-to-r from-[#4FC3F7] to-[#81D4FA] text-white rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-lg transition-shadow"
              >
                {isLastQuestion ? safeTexts.finishLabel : safeTexts.nextLabel}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0">
          <div className="bg-[#4FC3F7]/10 p-4 rounded-2xl">
            <p className="text-[#4FC3F7] text-xs text-center">
              {safeTexts.footerHint}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
