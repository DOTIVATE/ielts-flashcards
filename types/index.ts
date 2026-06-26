export interface Flashcard {
  id: string;
  word: string;
  definition: string;
  example: string;
  category: string;
}

export interface UserProgress {
  id: string;
  clerk_user_id: string;
  flashcard_id: string;
  status: 'known' | 'learning';
  last_reviewed: string;
}

export interface FlashcardWithProgress extends Flashcard {
  status?: 'known' | 'learning';
  last_reviewed?: string;
}
