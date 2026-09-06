import { db } from '@/lib/db';
import { logs } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { logId, photoBase64, gpsLocation } = await req.json();

    await db.update(logs)
      .set({
        photoBase64: photoBase64 || null,
        gpsLocation: gpsLocation || null,
      })
      .where(eq(logs.id, logId));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}