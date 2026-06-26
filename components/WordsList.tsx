'use client';

import { useState, useTransition } from 'react';
import { Search, Award, Clock, HelpCircle, Check } from 'lucide-react';
import { FlashcardWithProgress } from '@/types';
import { updateUserProgress } from '@/lib/actions';

interface WordsListProps {
  initialCards: FlashcardWithProgress[];
}

export default function WordsList({ initialCards }: WordsListProps) {
  const [cards, setCards] = useState<FlashcardWithProgress[]>(initialCards);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'known' | 'learning'>('all');
  const [isPending, startTransition] = useTransition();

  const handleToggleStatus = (cardId: string, currentStatus?: 'known' | 'learning') => {
    const nextStatus = currentStatus === 'known' ? 'learning' : 'known';
    
    // Optimistic UI update
    setCards((prev) =>
      prev.map((c) =>
        c.id === cardId ? { ...c, status: nextStatus, last_reviewed: new Date().toISOString() } : c
      )
    );

    startTransition(async () => {
      try {
        await updateUserProgress(cardId, nextStatus);
      } catch (err) {
        console.error('Failed to update progress:', err);
        // Rollback optimistic update
        setCards((prev) =>
          prev.map((c) =>
            c.id === cardId ? { ...c, status: currentStatus } : c
          )
        );
      }
    });
  };

  const filteredCards = cards.filter((card) => {
    const matchesSearch = card.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          card.definition.toLowerCase().includes(searchQuery.toLowerCase());
    
    const cardStatus = card.status || 'learning'; // Default unreviewed to 'learning'
    
    if (activeTab === 'known') {
      return matchesSearch && cardStatus === 'known';
    }
    if (activeTab === 'learning') {
      return matchesSearch && cardStatus === 'learning';
    }
    return matchesSearch;
  });

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Search & Filter bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch">
        <div className="relative flex-grow">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search word or definition..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#1e1e38] border border-[#2d2d54] focus:border-[#4f8ef7]/50 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-colors"
          />
        </div>
        
        <div className="flex bg-[#1e1e38] border border-[#2d2d54] p-1 rounded-xl gap-1 justify-center">
          {(['all', 'known', 'learning'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-[#4f8ef7] text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab === 'learning' ? 'Still Learning' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Word Cards Grid */}
      {filteredCards.length === 0 ? (
        <div className="text-center py-12 text-slate-500 border border-dashed border-[#2d2d54] rounded-2xl bg-[#1e1e38]/20">
          No words found matching your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          {filteredCards.map((card) => {
            const isKnown = card.status === 'known';
            return (
              <div 
                key={card.id} 
                className="bg-[#1e1e38] border border-[#2d2d54] hover:border-[#3c3c66] transition-colors rounded-2xl p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-bold text-white tracking-wide">{card.word}</h3>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#4f8ef7] bg-[#4f8ef7]/10 px-2 py-0.5 rounded-full border border-[#4f8ef7]/20">
                      {card.category || 'Academic'}
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm mb-3 leading-relaxed">
                    {card.definition}
                  </p>
                  <p className="text-slate-400 text-xs italic border-l-2 border-[#2d2d54] pl-3 py-0.5 mb-4">
                    &ldquo;{card.example}&rdquo;
                  </p>
                </div>

                <div className="flex justify-between items-center border-t border-[#2d2d54] pt-4 mt-1">
                  <div className="flex items-center gap-1.5">
                    {isKnown ? (
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        <span>Mastered</span>
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>Learning</span>
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleToggleStatus(card.id, card.status)}
                    disabled={isPending}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isKnown
                        ? 'bg-[#252542] border border-[#2d2d54] hover:bg-[#2d2d5c] text-amber-400'
                        : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/10'
                    }`}
                  >
                    {isKnown ? (
                      <>
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Mark Learning</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark Known</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
