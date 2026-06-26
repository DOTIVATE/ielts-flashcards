import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import StudySession from '@/components/StudySession';
import { Flashcard, UserProgress } from '@/types';

export const revalidate = 0; // Disable page caching for study page to ensure fresh queries

export default async function StudyPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/login');
  }

  // Fetch flashcards and progress in parallel
  const [cardsResult, progressResult] = await Promise.all([
    supabase.from('flashcards').select('*'),
    supabase.from('user_progress').select('*').eq('clerk_user_id', userId)
  ]);

  const cards: Flashcard[] = cardsResult.data || [];
  const progress: UserProgress[] = progressResult.data || [];

  // Filter for cards that are still 'learning' or haven't been reviewed at all
  let studyCards = cards.filter((card) => {
    const prog = progress.find((p) => p.flashcard_id === card.id);
    return !prog || prog.status === 'learning';
  });

  // If all cards are marked as known, let them review all cards
  if (studyCards.length === 0) {
    studyCards = cards;
  }

  // Shuffle and pick top 10
  const shuffledCards = [...studyCards]
    .sort(() => Math.random() - 0.5)
    .slice(0, 10);

  return (
    <div className="flex flex-col min-h-screen bg-[#1a1a2e]">
      <Header />
      <main className="flex-grow max-w-5xl w-full mx-auto px-4 py-8 flex flex-col justify-center items-center">
        <StudySession initialCards={shuffledCards} />
      </main>
    </div>
  );
}
