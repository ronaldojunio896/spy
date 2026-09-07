import { NextResponse } from 'next/server';
import { db } from '@/db/schema'; // ou '@/lib/db' conforme sua estrutura
import { spylinks } from '@/db/schema';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const investigatorId = cookieStore.get('session_token')?.value;

    if (!investigatorId) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const { targetUrl, category, template, maxClicks } = await request.json();

    if (!targetUrl) {
      return NextResponse.json({ message: 'URL de destino obrigatória' }, { status: 400 });
    }

    const id = Math.random().toString(36).substring(2, 8);

    await db.insert(spylinks).values({
      id,
      investigatorId: parseInt(investigatorId) || 1,
      targetUrl,
      category: category || 'Geral',
      template: template || 'none',
      maxClicks: maxClicks ? parseInt(maxClicks) : null,
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://spy-steel.vercel.app';
    const trackingUrl = baseUrl + '/l/' + id;

    return NextResponse.json({ success: true, trackingUrl, id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Erro no servidor' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const allLinks = await db.select().from(spylinks);
    return NextResponse.json(allLinks);
  } catch (error) {
    return NextResponse.json({ message: 'Erro ao buscar links' }, { status: 500 });
  }
}