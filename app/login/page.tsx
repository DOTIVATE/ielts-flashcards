import { SignIn } from '@clerk/nextjs';
import { BookOpen } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-[#1a1a2e]">
      <div className="w-full max-w-md flex flex-col items-center mb-8 text-center">
        <div className="flex items-center gap-3 mb-3 bg-[#4f8ef7]/10 px-4 py-2 rounded-2xl border border-[#4f8ef7]/20">
          <BookOpen className="w-8 h-8 text-[#4f8ef7]" />
          <span className="text-2xl font-black text-white tracking-wide">IELTS Flashcards</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white sm:text-3xl mb-1">
          Master Vocabulary.
        </h1>
        <p className="text-sm font-semibold text-[#4f8ef7] tracking-wider uppercase">
          Ace the test
        </p>
      </div>

      <div className="w-full flex justify-center">
        <SignIn />
      </div>
    </div>
  );
}
