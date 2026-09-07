'use client';

// ============================================================
// PAINEL DE ESTATÍSTICAS GERAIS
// Resumo de todos os links do operador
// ============================================================

interface StatsPanelProps {
  totalLinks: number;
  activeLinks: number;
  totalClicks: number;
  uniqueClicks: number;
  topCategory: string;
  topTemplate: string;
}

export default function StatsPanel({
  totalLinks,
  activeLinks,
  totalClicks,
  uniqueClicks,
  topCategory,
  topTemplate,
}: StatsPanelProps) {
  const stats = [
    {
      label: 'Links Criados',
      value: totalLinks,
      color: 'text-white',
      icon: '🔗',
    },
    {
      label: 'Links Ativos',
      value: activeLinks,
      color: 'text-emerald-400',
      icon: '🟢',
    },
    {
      label: 'Total de Cliques',
      value: totalClicks,
      color: 'text-cyan-400',
      icon: '👆',
    },
    {
      label: 'Visitantes Únicos',
      value: uniqueClicks,
      color: 'text-violet-400',
      icon: '👤',
    },
    {
      label: 'Top Categoria',
      value: topCategory,
      color: 'text-amber-400',
      icon: '🏷️',
      isText: true,
    },
    {
      label: 'Top Template',
      value: topTemplate,
      color: 'text-pink-400',
      icon: '🎨',
      isText: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {stats.map(stat => (
        <div
          key={stat.label}
          className="bg-[#0d1422] border border-white/[0.06] rounded-2xl p-4 backdrop-blur-xl"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm">{stat.icon}</span>
            <span className="text-[11px] text-slate-500">{stat.label}</span>
          </div>
          <p className={`text-xl font-bold ${stat.color}`}>
            {stat.isText ? stat.value : stat.value.toLocaleString('pt-BR')}
          </p>
        </div>
      ))}
    </div>
  );
}
