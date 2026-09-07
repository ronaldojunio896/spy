import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { spylinks } from '@/drizzle/schema';
import { generateUniqueId, isValidUrl, TEMPLATES, type TemplateId } from '@/lib/utils';
import { eq, desc } from 'drizzle-orm';

// ============================================================
// POST /api/spylinks — CRIAR NOVO LINK
// ============================================================
export async function POST(request: NextRequest) {
  try {
    // TODO: Validar sessão do operador (session_token)
    // const session = await validateSession(request);
    // if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const body = await request.json();
    const { targetUrl, title, category, template, templateConfig, showPreview, expiresAt } = body;

    // --- Validações ---
    if (!targetUrl || !isValidUrl(targetUrl)) {
      return NextResponse.json(
        { error: 'URL de destino inválida. Use http:// ou https://' },
        { status: 400 }
      );
    }

    // Validar template se fornecido
    const selectedTemplate: TemplateId = template || 'none';
    if (!(selectedTemplate in TEMPLATES)) {
      return NextResponse.json(
        { error: `Template inválido. Opções: ${Object.keys(TEMPLATES).join(', ')}` },
        { status: 400 }
      );
    }

    // Gerar ID único
    const id = await generateUniqueId();

    // Montar config do template (merge do default com o customizado)
    const defaultConfig = TEMPLATES[selectedTemplate].defaultConfig;
    const mergedConfig = { ...defaultConfig, ...(templateConfig || {}) };

    // Criar o link no banco
    const [newLink] = await db.insert(spylinks).values({
      id,
      investigatorId: 1, // TODO: Pegar do session
      targetUrl,
      title: title || 'Sem título',
      category: category || 'Geral',
      template: selectedTemplate,
      templateConfig: mergedConfig,
      showPreview: showPreview !== false,
      status: 'active',
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    }).returning();

    // Montar a URL curta de rastreamento
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://spy-steel.vercel.app';
    const trackingUrl = `${baseUrl}/l/${id}`;

    return NextResponse.json({
      success: true,
      link: {
        ...newLink,
        trackingUrl,
      },
      template: TEMPLATES[selectedTemplate],
    }, { status: 201 });

  } catch (error) {
    console.error('[SPYLINK] Erro ao criar link:', error);
    return NextResponse.json(
      { error: 'Erro interno ao criar o link' },
      { status: 500 }
    );
  }
}

// ============================================================
// GET /api/spylinks — LISTAR TODOS OS LINKS
// ============================================================
export async function GET(request: NextRequest) {
  try {
    // TODO: Validar sessão e filtrar por investigatorId

    const allLinks = await db
      .select()
      .from(spylinks)
      .orderBy(desc(spylinks.createdAt));

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://spy-steel.vercel.app';

    const linksWithUrl = allLinks.map(link => ({
      ...link,
      trackingUrl: `${baseUrl}/l/${link.id}`,
    }));

    return NextResponse.json({
      success: true,
      links: linksWithUrl,
      total: linksWithUrl.length,
    });

  } catch (error) {
    console.error('[SPYLINK] Erro ao listar links:', error);
    return NextResponse.json(
      { error: 'Erro interno ao buscar links' },
      { status: 500 }
    );
  }
}
