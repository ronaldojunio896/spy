'use client';

import { useState } from 'react';
import { TEMPLATES, type TemplateId } from '@/lib/utils';

// ============================================================
// SELETOR DE MODELOS PRÉ-PRONTOS
// Exibe todos os templates disponíveis com preview e configs
// ============================================================

interface TemplateSelectorProps {
  selected: TemplateId;
  onSelect: (templateId: TemplateId, config: Record<string, unknown>) => void;
}

const categoryLabels: Record<string, string> = {
  basic: '⚡ Básicos',
  simulacao: '🔄 Simulação',
  seguranca: '🛡️ Segurança',
  download: '📥 Download',
  temporizador: '⏱️ Temporizador',
  conteudo: '📰 Conteúdo',
};

export default function TemplateSelector({ selected, onSelect }: TemplateSelectorProps) {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const templateList = Object.values(TEMPLATES);
  const filtered = filterCategory === 'all'
    ? templateList
    : templateList.filter(t => t.category === filterCategory);

  const categories = [...new Set(templateList.map(t => t.category))];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-300">
          Modelo de Página Intermediária
        </h3>
        <span className="text-xs text-slate-500">
          {filtered.length} modelos disponíveis
        </span>
      </div>

      {/* Filtro por categoria */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterCategory('all')}
          className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
            filterCategory === 'all'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
              : 'bg-slate-800/50 text-slate-400 border border-white/[0.06] hover:border-white/20'
          }`}
        >
          Todos
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
              filterCategory === cat
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'bg-slate-800/50 text-slate-400 border border-white/[0.06] hover:border-white/20'
            }`}
          >
            {categoryLabels[cat] || cat}
          </button>
        ))}
      </div>

      {/* Grid de templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map(template => (
          <button
            key={template.id}
            onClick={() => onSelect(template.id as TemplateId, { ...template.defaultConfig })}
            className={`group relative p-4 rounded-xl border transition-all text-left ${
              selected === template.id
                ? 'bg-cyan-500/10 border-cyan-500/30 ring-1 ring-cyan-500/20'
                : 'bg-[#0d1422] border-white/[0.06] hover:border-white/20 hover:bg-[#0a101c]'
            }`}
          >
            {/* Badge Premium */}
            {template.isPremium && (
              <span className="absolute top-2 right-2 text-[10px] px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-full border border-amber-500/20">
                PRO
              </span>
            )}

            {/* Ícone e nome */}
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{template.icon}</span>
              <div>
                <p className="font-medium text-sm text-slate-200 group-hover:text-white transition-colors">
                  {template.name}
                </p>
                <p className="text-xs text-slate-500">
                  ⏱ {template.estimatedDuration} • 🔥 {template.popularity}%
                </p>
              </div>
            </div>

            {/* Descrição */}
            <p className="text-xs text-slate-400 leading-relaxed">
              {template.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mt-2">
              {template.tags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="text-[10px] px-1.5 py-0.5 bg-slate-700/50 text-slate-500 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Indicador de selecionado */}
            {selected === template.id && (
              <div className="absolute bottom-2 right-2">
                <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
