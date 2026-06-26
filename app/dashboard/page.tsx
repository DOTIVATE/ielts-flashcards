import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import StatsCard from '@/components/StatsCard';
import Link from 'next/link';
import { GraduationCap, Award, BookOpen, Clock, ChevronRight, AlertCircle, RefreshCw } from 'lucide-react';
import { Flashcard, UserProgress } from '@/types';

export const revalidate = 0; // Disable caching for dashboard to ensure real-time progress updates

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/login');
  }

  // Fetch flashcards and user progress in parallel
  const [cardsResult, progressResult] = await Promise.all([
    supabase.from('flashcards').select('*'),
    supabase.from('user_progress').select('*').eq('clerk_user_id', userId)
  ]);

  const cards: Flashcard[] = cardsResult.data || [];
  const progress: UserProgress[] = progressResult.data || [];

  const totalCards = cards.length;
  const knownCards = progress.filter((p) => p.status === 'known').length;
  const learningCards = totalCards - knownCards;
  const percentComplete = totalCards > 0 ? Math.round((knownCards / totalCards) * 100) : 0;

  // Get last 5 reviewed cards
  const lastReviewedProgress = [...progress]
    .sort((a, b) => new Date(b.last_reviewed).getTime() - new Date(a.last_reviewed).getTime())
    .slice(0, 5);

  const lastReviewedCards = lastReviewedProgress
    .map((p) => {
      const card = cards.find((c) => c.id === p.flashcard_id);
      return card ? { ...card, status: p.status, last_reviewed: p.last_reviewed } : null;
    })
    .filter((c): c is NonNullable<typeof c> => c !== null);

  return (
    <div className="flex flex-col min-h-screen bg-[#1a1a2e]">
      <Header />
      
      <main className="flex-grow max-w-5xl w-full mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Your Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Track your learning progress and master your IELTS vocabulary.
            </p>
          </div>
          
          {totalCards > 0 && (
            <Link 
              href="/study" 
              className="flex items-center gap-2 px-6 py-3 bg-[#4f8ef7] hover:bg-[#387bf2] active:scale-95 text-white font-bold rounded-xl shadow-lg shadow-[#4f8ef7]/20 transition-all text-sm w-full md:w-auto justify-center"
            >
              <GraduationCap className="w-5 h-5" />
              <span>Start Study Session</span>
            </Link>
          )}
        </div>

        {totalCards === 0 ? (
          /* Empty State / Seed CTA */
          <div className="border border-dashed border-[#2d2d54] rounded-3xl p-10 text-center max-w-lg mx-auto bg-[#1e1e38]/50 my-12">
            <AlertCircle className="w-12 h-12 text-[#4f8ef7] mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">No Flashcards Found</h2>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              It looks like your database does not have any flashcards loaded yet. Click the button below to seed the database with 30 high-yield IELTS Academic cards.
            </p>
            <a 
              href="/api/seed"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#4f8ef7]/15 hover:bg-[#4f8ef7]/25 text-[#4f8ef7] font-bold rounded-xl border border-[#4f8ef7]/30 transition-colors text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Seed 30 IELTS Words</span>
            </a>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatsCard 
                label="Total Cards" 
                value={totalCards} 
                icon={<BookOpen className="w-5 h-5" />} 
              />
              <StatsCard 
                label="Known" 
                value={knownCards} 
                icon={<Award className="w-5 h-5 text-emerald-400" />} 
                subtext={`${percentComplete}% mastered`}
              />
              <StatsCard 
                label="Still Learning" 
                value={learningCards} 
                icon={<Clock className="w-5 h-5 text-amber-400" />} 
                subtext={`${Math.round(100 - percentComplete)}% remaining`}
              />
              <StatsCard 
                label="Progress" 
                value={`${percentComplete}%`} 
                icon={<GraduationCap className="w-5 h-5 text-[#4f8ef7]" />} 
                highlight={true}
              />
            </div>

            {/* Last Reviewed Section */}
            <div className="bg-[#1e1e38] border border-[#2d2d54] rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#4f8ef7]" />
                  <span>Recently Reviewed</span>
                </h2>
                <Link 
                  href="/words" 
                  className="text-xs font-semibold text-[#4f8ef7] hover:underline flex items-center gap-0.5"
                >
                  <span>View All Words</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {lastReviewedCards.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-sm">
                  No words reviewed yet. Start a study session to see your recent cards here!
                </div>
              ) : (
                <div className="divide-y divide-[#2d2d54]">
                  {lastReviewedCards.map((card) => (
                    <div key={card.id} className="py-3 flex justify-between items-center first:pt-0 last:pb-0">
                      <div>
                        <h3 className="font-bold text-white text-base">{card.word}</h3>
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5 max-w-md">
                          {card.definition}
                        </p>
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        card.status === 'known'
                          ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
                          : 'text-amber-400 bg-amber-400/10 border-amber-400/20'
                      }`}>
                        {card.status === 'known' ? 'Known' : 'Learning'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
