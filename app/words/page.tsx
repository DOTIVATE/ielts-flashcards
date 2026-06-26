import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import WordsList from '@/components/WordsList';
import { Flashcard, UserProgress, FlashcardWithProgress } from '@/types';

export const revalidate = 0; // Disable page caching for words page to get active progress updates

export default async function WordsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/login');
  }

  // Fetch flashcards and progress in parallel
  const [cardsResult, progressResult] = await Promise.all([
    supabase.from('flashcards').select('*').order('word', { ascending: true }),
    supabase.from('user_progress').select('*').eq('clerk_user_id', userId)
  ]);

  const cards: Flashcard[] = cardsResult.data || [];
  const progress: UserProgress[] = progressResult.data || [];

  // Map progress status to cards
  const cardsWithProgress: FlashcardWithProgress[] = cards.map((card) => {
    const prog = progress.find((p) => p.flashcard_id === card.id);
    return {
      ...card,
      status: prog?.status,
      last_reviewed: prog?.last_reviewed
    };
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#1a1a2e]">
      <Header />
      <main className="flex-grow max-w-5xl w-full mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Vocabulary Archive</h1>
          <p className="text-slate-400 text-sm mt-1">
            Browse, search, and toggle states of all IELTS Academic vocabulary cards.
          </p>
        </div>
        <WordsList initialCards={cardsWithProgress} />
      </main>
    </div>
  );
}
