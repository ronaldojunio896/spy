import { db } from '@/lib/db';
import { spylinks, logs } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { getClientIp, parseUserAgent, getGeoByIp, isUniqueVisitor } from '@/lib/utils';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import LinkExpiredPage from './LinkExpiredPage';
import LinkInvalidPage from './LinkInvalidPage';
import RedirectPageClient from './RedirectPageClient';

// ============================================================
// ROTA DE INTERCEPTAÇÃO: /l/[id]
// 
// FLUXO:
// 1. Busca o link pelo ID no banco
// 2. Verifica se o link está ativo e não expirou
// 3. Extrai IP e User-Agent dos headers
// 4. Parseia o User-Agent em dispositivo/browser/OS
// 5. Obtém geolocalização aproximada por IP (país/cidade)
// 6. Registra o acesso na tabela de logs
// 7. Incrementa o contador de cliques
// 8. Se template = 'none', redireciona direto
//    Se template != 'none', renderiza a página intermediária
// ============================================================

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function LinkRedirectPage({ params }: PageProps) {
  const { id } = await params;
  const headersList = await headers();

  // --- 1. Buscar o link ---
  const linkData = await db
    .select()
    .from(spylinks)
    .where(eq(spylinks.id, id))
    .limit(1);

  if (linkData.length === 0) {
    return <LinkInvalidPage />;
  }

  const link = linkData[0];

  // --- 2. Verificar status e expiração ---
  if (link.status === 'paused') {
    return <LinkInvalidPage message="Este link está temporariamente desativado." />;
  }

  if (link.status === 'expired' || (link.expiresAt && new Date(link.expiresAt) < new Date())) {
    return <LinkExpiredPage />;
  }

  // --- 3. Extrair dados do visitante ---
  const ip = getClientIp(headersList);
  const userAgent = headersList.get('user-agent') || 'Unknown';
  const parsedUA = parseUserAgent(userAgent);
  const referrer = headersList.get('referer') || 'Direto';

  // --- 4. Geolocalização por IP (apenas país/cidade) ---
  const geo = await getGeoByIp(ip);

  // --- 5. Verificar visitante único ---
  const unique = await isUniqueVisitor(id, ip);

  // --- 6. Registrar o acesso ---
  try {
    await db.insert(logs).values({
      spylinkId: id,
      ip,
      userAgent,
      device: parsedUA.device,
      browser: parsedUA.browser,
      os: parsedUA.os,
      country: geo.country,
      city: geo.city,
      referrer,
      isUnique: unique,
    });
  } catch (error) {
    console.error('[SPYLINK] Erro ao registrar log de acesso:', error);
    // Não bloqueia o redirecionamento por causa de erro no log
  }

  // --- 7. Incrementar contador de cliques ---
  try {
    await db
      .update(spylinks)
      .set({ totalClicks: (link.totalClicks || 0) + 1, updatedAt: new Date() })
      .where(eq(spylinks.id, id));
  } catch (error) {
    console.error('[SPYLINK] Erro ao incrementar cliques:', error);
  }

  // --- 8. Redirecionar ou mostrar template ---
  if (link.template === 'none' || !link.template) {
    // Redirecionamento direto — sem página intermediária
    redirect(link.targetUrl);
  }

  // Renderizar página intermediária com o template selecionado
  return (
    <RedirectPageClient
      targetUrl={link.targetUrl}
      template={link.template}
      templateConfig={link.templateConfig || {}}
      showPreview={link.showPreview}
    />
  );
}
