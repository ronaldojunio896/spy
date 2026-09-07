import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { logs, spylinks } from '@/drizzle/schema';
import { eq, desc, sql } from 'drizzle-orm';

// ============================================================
// GET /api/spylinks/[id]/logs — LOGS DE ACESSO DE UM LINK
// ============================================================
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verificar se o link existe
    const linkExists = await db
      .select({ id: spylinks.id })
      .from(spylinks)
      .where(eq(spylinks.id, id))
      .limit(1);

    if (linkExists.length === 0) {
      return NextResponse.json(
        { error: 'Link não encontrado' },
        { status: 404 }
      );
    }

    // Buscar todos os logs do link
    const accessLogs = await db
      .select()
      .from(logs)
      .where(eq(logs.spylinkId, id))
      .orderBy(desc(logs.accessedAt));

    // Calcular métricas agregadas
    const totalClicks = accessLogs.length;
    const uniqueClicks = accessLogs.filter(l => l.isUnique).length;

    // Breakdown por dispositivo
    const deviceBreakdown = accessLogs.reduce((acc, log) => {
      acc[log.device] = (acc[log.device] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Breakdown por país
    const countryBreakdown = accessLogs.reduce((acc, log) => {
      acc[log.country || 'Desconhecido'] = (acc[log.country || 'Desconhecido'] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Breakdown por browser
    const browserBreakdown = accessLogs.reduce((acc, log) => {
      acc[log.browser] = (acc[log.browser] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      success: true,
      logs: accessLogs,
      metrics: {
        totalClicks,
        uniqueClicks,
        uniqueRate: totalClicks > 0 ? ((uniqueClicks / totalClicks) * 100).toFixed(1) : '0',
        deviceBreakdown,
        countryBreakdown,
        browserBreakdown,
      },
    });

  } catch (error) {
    console.error('[SPYLINK] Erro ao buscar logs:', error);
    return NextResponse.json(
      { error: 'Erro interno ao buscar logs' },
      { status: 500 }
    );
  }
}
