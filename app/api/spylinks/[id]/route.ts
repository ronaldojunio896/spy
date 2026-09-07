import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { spylinks } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

// ============================================================
// GET /api/spylinks/[id] — DETALHES DE UM LINK
// ============================================================
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const link = await db
      .select()
      .from(spylinks)
      .where(eq(spylinks.id, id))
      .limit(1);

    if (link.length === 0) {
      return NextResponse.json(
        { error: 'Link não encontrado' },
        { status: 404 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://spy-steel.vercel.app';

    return NextResponse.json({
      success: true,
      link: {
        ...link[0],
        trackingUrl: `${baseUrl}/l/${id}`,
      },
    });

  } catch (error) {
    console.error('[SPYLINK] Erro ao buscar link:', error);
    return NextResponse.json(
      { error: 'Erro interno' },
      { status: 500 }
    );
  }
}

// ============================================================
// DELETE /api/spylinks/[id] — REMOVER UM LINK
// ============================================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const deleted = await db
      .delete(spylinks)
      .where(eq(spylinks.id, id))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json(
        { error: 'Link não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Link removido com sucesso',
    });

  } catch (error) {
    console.error('[SPYLINK] Erro ao remover link:', error);
    return NextResponse.json(
      { error: 'Erro interno' },
      { status: 500 }
    );
  }
}
