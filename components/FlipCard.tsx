'use client';

import { Sparkles } from 'lucide-react';
import { Flashcard } from '@/types';

interface FlipCardProps {
  card: Flashcard;
  isFlipped: boolean;
  onFlip: () => void;
}

export default function FlipCard({ card, isFlipped, onFlip }: FlipCardProps) {
  return (
    <div 
      onClick={onFlip}
      className="w-full max-w-sm h-80 cursor-pointer perspective-1000 select-none group mx-auto"
    >
      <div 
        className={`w-full h-full duration-500 preserve-3d relative rounded-3xl transition-transform ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front of Card */}
        <div className="absolute inset-0 backface-hidden w-full h-full bg-gradient-to-br from-[#232344] to-[#1d1d3a] border border-[#3c3c66] hover:border-[#4f8ef7]/50 rounded-3xl p-6 flex flex-col justify-between shadow-xl transition-all duration-300">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#4f8ef7] bg-[#4f8ef7]/10 px-3 py-1 rounded-full border border-[#4f8ef7]/20">
              {card.category || 'Academic'}
            </span>
            <Sparkles className="w-4 h-4 text-slate-500 group-hover:text-[#4f8ef7] transition-colors" />
          </div>

          <div className="flex flex-col items-center justify-center flex-grow py-4 text-center">
            <h2 className="text-3xl font-extrabold text-white tracking-wide leading-tight select-text">
              {card.word}
            </h2>
            <p className="text-xs text-slate-400 mt-4 animate-pulse">
              Tap to reveal definition
            </p>
          </div>

          <div className="text-center text-[10px] text-slate-500 uppercase tracking-widest font-mono">
            IELTS Flashcards
          </div>
        </div>

        {/* Back of Card */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 w-full h-full bg-gradient-to-br from-[#1d1d3a] to-[#232344] border border-[#4f8ef7]/35 rounded-3xl p-6 flex flex-col justify-between shadow-xl">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#4f8ef7] bg-[#4f8ef7]/10 px-3 py-1 rounded-full border border-[#4f8ef7]/20">
              Definition & Example
            </span>
            <span className="text-xs text-slate-500 font-mono">Back</span>
          </div>

          <div className="flex flex-col justify-center flex-grow py-2">
            <div className="mb-4">
              <span className="text-[10px] uppercase font-bold text-[#4f8ef7] tracking-wider block mb-1">
                Definition
              </span>
              <p className="text-slate-200 text-sm leading-relaxed font-medium select-text">
                {card.definition}
              </p>
            </div>
            
            <div className="border-t border-[#2d2d54] pt-3">
              <span className="text-[10px] uppercase font-bold text-[#4f8ef7] tracking-wider block mb-1">
                Example Sentence
              </span>
              <p className="text-slate-300 text-xs italic leading-relaxed select-text">
                &ldquo;{card.example}&rdquo;
              </p>
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-500 uppercase tracking-widest font-mono">
            Tap to flip back
          </div>
        </div>
      </div>
    </div>
  );
}
