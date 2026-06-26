'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updateUserProgress } from '@/lib/actions';
import FlipCard from './FlipCard';
import ProgressBar from './ProgressBar';
import { Check, RotateCw, Award, Home, RefreshCw, HelpCircle } from 'lucide-react';
import { Flashcard } from '@/types';

interface StudySessionProps {
  initialCards: Flashcard[];
}

export default function StudySession({ initialCards }: StudySessionProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [cards, setCards] = useState<Flashcard[]>(initialCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCount, setKnownCount] = useState(0);
  const [learningCount, setLearningCount] = useState(0);
  const [sessionFinished, setSessionFinished] = useState(false);

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 bg-[#1e1e38] border border-[#2d2d54] rounded-2xl max-w-md mx-auto my-12">
        <Award className="w-12 h-12 text-[#4f8ef7] mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">All Caught Up!</h2>
        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
          You have marked all available flashcards as &quot;Known&quot;. Great job! You can reset progress or study all cards from the Word List.
        </p>
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#4f8ef7] hover:bg-[#387bf2] text-white font-bold rounded-xl transition-colors text-sm mx-auto"
        >
          <Home className="w-4 h-4" />
          <span>Go to Dashboard</span>
        </button>
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleReview = async (status: 'known' | 'learning') => {
    if (status === 'known') {
      setKnownCount((prev) => prev + 1);
    } else {
      setLearningCount((prev) => prev + 1);
    }

    startTransition(async () => {
      try {
        await updateUserProgress(currentCard.id, status);
      } catch (err) {
        console.error('Failed to update progress:', err);
      }
    });

    if (currentIndex < cards.length - 1) {
      setIsFlipped(false);
      // Wait for flip back transition before showing next card
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 250);
    } else {
      setSessionFinished(true);
    }
  };

  const handleRestart = () => {
    // Shuffled restart
    const shuffled = [...initialCards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnownCount(0);
    setLearningCount(0);
    setSessionFinished(false);
  };

  if (sessionFinished) {
    const accuracy = cards.length > 0 ? Math.round((knownCount / cards.length) * 100) : 0;
    return (
      <div className="w-full max-w-md mx-auto bg-[#1e1e38] border border-[#2d2d54] rounded-3xl p-6 shadow-xl text-center">
        <Award className="w-16 h-16 text-[#4f8ef7] mx-auto mb-4" />
        <h2 className="text-2xl font-black text-white mb-1">Session Complete!</h2>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">
          IELTS Vocabulary
        </p>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-[#1a1a2e] border border-[#2d2d54] p-3.5 rounded-2xl">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Studied
            </span>
            <span className="text-xl font-bold text-white">{cards.length}</span>
          </div>
          <div className="bg-[#1a1a2e] border border-[#2d2d54] p-3.5 rounded-2xl">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Known
            </span>
            <span className="text-xl font-bold text-emerald-450">{knownCount}</span>
          </div>
          <div className="bg-[#1a1a2e] border border-[#2d2d54] p-3.5 rounded-2xl">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Learning
            </span>
            <span className="text-xl font-bold text-amber-450">{learningCount}</span>
          </div>
        </div>

        <div className="bg-[#4f8ef7]/10 border border-[#4f8ef7]/20 p-4 rounded-2xl mb-8 flex justify-between items-center text-left">
          <div>
            <h3 className="font-bold text-white text-sm">Session Mastery</h3>
            <p className="text-xs text-slate-350 mt-0.5">Cards marked as Known</p>
          </div>
          <span className="text-2xl font-extrabold text-[#4f8ef7]">{accuracy}%</span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleRestart}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#1a1a2e] border border-[#2d2d54] hover:bg-slate-800/40 text-white font-bold rounded-xl transition-colors text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Study Again</span>
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#4f8ef7] hover:bg-[#387bf2] text-white font-bold rounded-xl transition-all shadow-md shadow-[#4f8ef7]/10 text-sm"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-6">
      <ProgressBar current={currentIndex} total={cards.length} />

      <div className="w-full py-4 flex justify-center items-center">
        <FlipCard card={currentCard} isFlipped={isFlipped} onFlip={handleFlip} />
      </div>

      <div className="w-full flex flex-col gap-3">
        {!isFlipped ? (
          <button
            onClick={handleFlip}
            className="w-full py-3.5 bg-[#4f8ef7] hover:bg-[#387bf2] active:scale-[0.98] text-white font-bold rounded-xl shadow-lg shadow-[#4f8ef7]/20 transition-all text-sm flex items-center justify-center gap-2"
          >
            <RotateCw className="w-4 h-4" />
            <span>Flip Card</span>
          </button>
        ) : (
          <div className="flex gap-3 w-full">
            <button
              onClick={() => handleReview('learning')}
              disabled={isPending}
              className="flex-1 py-3.5 bg-[#252542] border border-[#2d2d54] hover:bg-[#2d2d5c] disabled:opacity-50 text-amber-400 font-bold rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Still Learning</span>
            </button>
            <button
              onClick={() => handleReview('known')}
              disabled={isPending}
              className="flex-1 py-3.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/10 transition-all text-sm flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Know it</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
