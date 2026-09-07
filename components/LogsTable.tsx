'use client';

// ============================================================
// TABELA DE LOGS DE ACESSO
// ============================================================

interface LogEntry {
  id: number;
  ip: string;
  userAgent: string;
  device: string;
  browser: string;
  os: string;
  country: string;
  city: string;
  referrer: string;
  isUnique: boolean;
  accessedAt: string;
}

interface LogsTableProps {
  logs: LogEntry[];
  metrics?: {
    totalClicks: number;
    uniqueClicks: number;
    uniqueRate: string;
    deviceBreakdown: Record<string, number>;
    countryBreakdown: Record<string, number>;
    browserBreakdown: Record<string, number>;
  };
}

const deviceIcons: Record<string, string> = {
  Desktop: '🖥️',
  Mobile: '📱',
  Tablet: '📋',
};

const browserIcons: Record<string, string> = {
  Chrome: '🌐',
  Firefox: '🦊',
  Safari: '🧭',
  Edge: '🔷',
  Opera: '🔴',
  Other: '❓',
};

export default function LogsTable({ logs, metrics }: LogsTableProps) {
  if (!logs || logs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-slate-800/50 rounded-full flex items-center justify-center">
          <span className="text-2xl">📊</span>
        </div>
        <p className="text-slate-400 text-sm">Nenhum acesso registrado ainda</p>
        <p className="text-slate-600 text-xs mt-1">Os dados aparecerão quando alguém clicar no link</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Métricas resumidas */}
      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Total de cliques */}
          <div className="bg-[#0a101c] border border-white/[0.06] rounded-xl p-4">
            <p className="text-xs text-slate-500 mb-1">Total de Cliques</p>
            <p className="text-2xl font-bold text-white">{metrics.totalClicks}</p>
          </div>

          {/* Visitantes únicos */}
          <div className="bg-[#0a101c] border border-white/[0.06] rounded-xl p-4">
            <p className="text-xs text-slate-500 mb-1">Visitantes Únicos</p>
            <p className="text-2xl font-bold text-cyan-400">{metrics.uniqueClicks}</p>
          </div>

          {/* Taxa de unicidade */}
          <div className="bg-[#0a101c] border border-white/[0.06] rounded-xl p-4">
            <p className="text-xs text-slate-500 mb-1">Taxa Única</p>
            <p className="text-2xl font-bold text-emerald-400">{metrics.uniqueRate}%</p>
          </div>

          {/* Top dispositivo */}
          <div className="bg-[#0a101c] border border-white/[0.06] rounded-xl p-4">
            <p className="text-xs text-slate-500 mb-1">Top Dispositivo</p>
            <p className="text-lg font-bold text-white">
              {Object.entries(metrics.deviceBreakdown).sort((a, b) => b[1] - a[1])[0]?.[0] || '—'}
            </p>
          </div>
        </div>
      )}

      {/* Breakdowns visuais */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Por dispositivo */}
          <div className="bg-[#0a101c] border border-white/[0.06] rounded-xl p-4">
            <h4 className="text-xs text-slate-500 mb-3">Por Dispositivo</h4>
            <div className="space-y-2">
              {Object.entries(metrics.deviceBreakdown)
                .sort((a, b) => b[1] - a[1])
                .map(([device, count]) => (
                  <div key={device} className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">
                      {deviceIcons[device] || '❓'} {device}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cyan-400 rounded-full"
                          style={{ width: `${(count / metrics.totalClicks) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500">{count}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Por país */}
          <div className="bg-[#0a101c] border border-white/[0.06] rounded-xl p-4">
            <h4 className="text-xs text-slate-500 mb-3">Por País</h4>
            <div className="space-y-2">
              {Object.entries(metrics.countryBreakdown)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([country, count]) => (
                  <div key={country} className="flex items-center justify-between">
                    <span className="text-sm text-slate-300 truncate">🌍 {country}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-400 rounded-full"
                          style={{ width: `${(count / metrics.totalClicks) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500">{count}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Por browser */}
          <div className="bg-[#0a101c] border border-white/[0.06] rounded-xl p-4">
            <h4 className="text-xs text-slate-500 mb-3">Por Browser</h4>
            <div className="space-y-2">
              {Object.entries(metrics.browserBreakdown)
                .sort((a, b) => b[1] - a[1])
                .map(([browser, count]) => (
                  <div key={browser} className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">
                      {browserIcons[browser] || '❓'} {browser}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-violet-400 rounded-full"
                          style={{ width: `${(count / metrics.totalClicks) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500">{count}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Tabela de logs detalhados */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-xs text-slate-500 font-medium text-left py-3 px-4">IP</th>
              <th className="text-xs text-slate-500 font-medium text-left py-3 px-4">Dispositivo</th>
              <th className="text-xs text-slate-500 font-medium text-left py-3 px-4">Browser</th>
              <th className="text-xs text-slate-500 font-medium text-left py-3 px-4">OS</th>
              <th className="text-xs text-slate-500 font-medium text-left py-3 px-4">Localização</th>
              <th className="text-xs text-slate-500 font-medium text-left py-3 px-4">Referência</th>
              <th className="text-xs text-slate-500 font-medium text-left py-3 px-4">Único?</th>
              <th className="text-xs text-slate-500 font-medium text-left py-3 px-4">Data/Hora</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr
                key={log.id}
                className="border-b border-white/[0.04] hover:bg-slate-800/20 transition-colors"
              >
                <td className="py-3 px-4">
                  <span className="text-xs font-mono text-slate-300">{log.ip}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-xs text-slate-300">
                    {deviceIcons[log.device] || '❓'} {log.device}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-xs text-slate-300">
                    {browserIcons[log.browser] || '❓'} {log.browser}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-xs text-slate-300">{log.os}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-xs text-slate-300">
                    🌍 {log.country}{log.city !== 'Desconhecido' ? `, ${log.city}` : ''}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-xs text-slate-400 truncate block max-w-[120px]">
                    {log.referrer}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {log.isUnique ? (
                    <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full">Único</span>
                  ) : (
                    <span className="text-[10px] px-1.5 py-0.5 bg-slate-700/50 text-slate-500 rounded-full">Recorrente</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <span className="text-xs text-slate-400">
                    {new Date(log.accessedAt).toLocaleString('pt-BR')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
