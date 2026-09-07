import { db } from '@/lib/db';
import { spylinks, logs } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export default async function TrackingPage({ params }: { params: { id: string } }) {
  const { id } = params;

  // Buscar o link correspondente no banco de dados
  const results = await db.select().from(spylinks).where(eq(spylinks.id, id));
  const link = results[0];

  if (!link) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#070b14] text-slate-100 font-sans">
        <div className="text-center">
          <h1 className="text-xl font-bold text-red-400">Link Inválido ou Expirado</h1>
          <p className="text-xs text-slate-500 mt-2">O recurso solicitado não está disponível.</p>
        </div>
      </div>
    );
  }

  // Capturar IP e User Agent reais da vítima através dos headers do Next.js
  try {
    const headersList = await headers();
    const forwardedFor = headersList.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0] : '127.0.0.1';
    const userAgent = headersList.get('user-agent') || 'Unknown Device';

    await db.insert(logs).values({
      spylinkId: id,
      ip,
      userAgent,
    });
  } catch (e) {
    console.error('Erro ao salvar log de acesso:', e);
  }

  // Redirecionamento forçado para a URL de destino cadastrada pelo operador
  redirect(link.targetUrl);
}