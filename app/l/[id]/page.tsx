import { db } from '@/lib/db';
import { spylinks, logs } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export default async function TrackingPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const [link] = await db.select().from(spylinks).where(eq(spylinks.id, id));

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

  try {
    await db.insert(logs).values({
      spylinkId: id,
      ip: '127.0.0.1',
      userAgent: 'Browser Client',
    });
  } catch (e) {
    console.error('Erro ao salvar log:', e);
  }

  redirect(link.targetUrl);
}