'use client';

import { TEMPLATES } from '@/lib/utils';

// ============================================================
// CARD DO LINK NA DASHBOARD
// ============================================================

interface LinkCardProps {
  id: string;
  trackingUrl: string;
  targetUrl: string;
  title: string;
  category: string;
  template: string;
  totalClicks: number;
  status: string;
  createdAt: string;
  onClick?: () => void;
  onDelete?: () => void;
}

export default function LinkCard({
  id,
  trackingUrl,
  targetUrl,
  title,
  category,
  template,
  totalClicks,
  status,
  createdAt,
  onClick,
  onDelete,
}: LinkCardProps) {
  const templateData = TEMPLATES[template as keyof typeof TEMPLATES];
  const isActive = status === 'active';
  const isExpired = status === 'expired';

  const copyToClipboard = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(trackingUrl);
  };

  return (
    <div
      onClick={onClick}
      className="group bg-[#0d1422] border border-white/[0.06] rounded-2xl p-5 cursor-pointer hover:border-white/20 transition-all backdrop-blur-xl"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-white truncate group-hover:text-cyan-400 transition-colors">
            {title}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {category} • {new Date(createdAt).toLocaleDateString('pt-BR')}
          </p>
        </div>

        {/* Status badge */}
        <span
          className={`text-[10px] px-2 py-1 rounded-full font-medium ${
            isActive
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
              : isExpired
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20'
              : 'bg-slate-500/20 text-slate-400 border border-slate-500/20'
          }`}
        >
          {isActive ? '● Ativo' : isExpired ? '● Expirado' : '● Pausado'}
        </span>
      </div>

      {/* URL encurtada */}
      <div className="flex items-center gap-2 bg-slate-800/30 border border-white/[0.04] rounded-lg p-2.5 mb-3">
        <span className="text-cyan-400 text-xs font-mono flex-1 truncate">{trackingUrl}</span>
        <button
          onClick={copyToClipboard}
          className="p-1.5 text-slate-500 hover:text-cyan-400 transition-colors"
          title="Copiar link"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
      </div>

      {/* Destino (com preview do hostname) */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] px-1.5 py-0.5 bg-slate-700/50 text-slate-500 rounded">Destino</span>
        <span className="text-xs text-slate-400 truncate">{new URL(targetUrl).hostname}</span>
      </div>

      {/* Footer com métricas */}
      <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
        {/* Template */}
        {templateData && template !== 'none' && (
          <div className="flex items-center gap-1.5">
            <span className="text-sm">{templateData.icon}</span>
            <span className="text-xs text-slate-500">{templateData.name}</span>
          </div>
        )}

        {/* Cliques */}
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.378M5.136 7.965l-2.378-.777M7.965 5.136l.777-2.378M5.965 9.135l-2.378.777" />
          </svg>
          <span className="text-sm font-semibold text-white">{totalClicks}</span>
          <span className="text-xs text-slate-500">cliques</span>
        </div>

        {/* Delete button */}
        {onDelete && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-1.5 text-slate-600 hover:text-red-400 transition-colors"
            title="Remover link"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
