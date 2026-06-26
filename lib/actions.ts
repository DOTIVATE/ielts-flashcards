'use server';

import { auth } from '@clerk/nextjs/server';
import { supabase } from './supabase';
import { revalidatePath } from 'next/cache';

export async function updateUserProgress(flashcardId: string, status: 'known' | 'learning') {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const { error } = await supabase
    .from('user_progress')
    .upsert(
      {
        clerk_user_id: userId,
        flashcard_id: flashcardId,
        status,
        last_reviewed: new Date().toISOString(),
      },
      {
        onConflict: 'clerk_user_id,flashcard_id',
      }
    );

  if (error) {
    console.error('Error updating progress:', error);
    throw new Error(error.message);
  }

  revalidatePath('/dashboard');
  revalidatePath('/study');
  revalidatePath('/words');
}
