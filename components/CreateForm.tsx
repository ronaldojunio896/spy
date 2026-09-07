'use client';

import { useState } from 'react';
import { TEMPLATES, type TemplateId } from '@/lib/utils';
import TemplateSelector from './TemplateSelector';

// ============================================================
// FORMULÁRIO DE CRIAÇÃO DE LINK
// ============================================================

interface CreateFormProps {
  onSubmit: (data: CreateLinkPayload) => Promise<void>;
  onCancel?: () => void;
}

export interface CreateLinkPayload {
  targetUrl: string;
  title: string;
  category: string;
  template: TemplateId;
  templateConfig: Record<string, unknown>;
  showPreview: boolean;
  expiresAt?: string;
}

export default function CreateForm({ onSubmit, onCancel }: CreateFormProps) {
  const [targetUrl, setTargetUrl] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Geral');
  const [template, setTemplate] = useState<TemplateId>('none');
  const [templateConfig, setTemplateConfig] = useState<Record<string, unknown>>({});
  const [showPreview, setShowPreview] = useState(true);
  const [expiresAt, setExpiresAt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUrl) return;

    setIsSubmitting(true);
    try {
      const payload: CreateLinkPayload = {
        targetUrl,
        title: title || 'Sem título',
        category,
        template,
        templateConfig,
        showPreview,
        expiresAt: expiresAt || undefined,
      };

      const res = await fetch('/api/spylinks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success && data.link) {
        setGeneratedUrl(data.link.trackingUrl);
      }
    } catch (error) {
      console.error('Erro ao criar link:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTemplateSelect = (templateId: TemplateId, config: Record<string, unknown>) => {
    setTemplate(templateId);
    setTemplateConfig(config);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedUrl);
  };

  // Se o link foi gerado, mostrar resultado
  if (generatedUrl) {
    return (
      <div className="bg-[#0d1422] border border-white/[0.06] rounded-2xl p-6 backdrop-blur-xl">
        <div className="text-center">
          {/* Ícone de sucesso */}
          <div className="w-16 h-16 mx-auto mb-4 bg-emerald-500/10 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h3 className="text-lg font-semibold text-white mb-2">Link Criado!</h3>

          {/* URL gerada */}
          <div className="flex items-center gap-2 bg-slate-800/50 border border-white/[0.06] rounded-xl p-3 mb-4">
            <span className="text-cyan-400 text-sm font-mono flex-1 truncate">{generatedUrl}</span>
            <button
              onClick={copyToClipboard}
              className="px-3 py-1.5 text-xs bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors"
            >
              Copiar
            </button>
          </div>

          {/* Info do template */}
          {template !== 'none' && (
            <p className="text-xs text-slate-400 mb-4">
              Modelo: {TEMPLATES[template].icon} {TEMPLATES[template].name} ({TEMPLATES[template].estimatedDuration})
            </p>
          )}

          {/* Preview do destino */}
          <p className="text-slate-500 text-xs mb-4">
            Destino: {new URL(targetUrl).hostname}
          </p>

          {/* Botões */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                setGeneratedUrl('');
                setTargetUrl('');
                setTitle('');
                setTemplate('none');
                setTemplateConfig({});
              }}
              className="px-4 py-2 text-sm bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition-colors"
            >
              Criar Outro
            </button>
            <a
              href={generatedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm bg-cyan-500/20 text-cyan-400 rounded-xl hover:bg-cyan-500/30 transition-colors"
            >
              Testar Link
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Formulário de criação
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* URL de destino */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          URL de Destino *
        </label>
        <input
          type="url"
          value={targetUrl}
          onChange={e => setTargetUrl(e.target.value)}
          placeholder="https://exemplo.com/pagina"
          required
          className="w-full px-4 py-3 bg-[#0a101c] border border-white/[0.06] rounded-xl text-slate-100 placeholder-slate-600 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all outline-none"
        />
      </div>

      {/* Título */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Título do Link
        </label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Ex: Campanha Black Friday"
          className="w-full px-4 py-3 bg-[#0a101c] border border-white/[0.06] rounded-xl text-slate-100 placeholder-slate-600 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all outline-none"
        />
      </div>

      {/* Categoria */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Categoria
        </label>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="w-full px-4 py-3 bg-[#0a101c] border border-white/[0.06] rounded-xl text-slate-100 focus:border-cyan-500/50 outline-none"
        >
          <option value="Geral">Geral</option>
          <option value="Marketing">Marketing</option>
          <option value="Vendas">Vendas</option>
          <option value="Social">Social</option>
          <option value="Operacional">Operacional</option>
          <option value="Pessoal">Pessoal</option>
        </select>
      </div>

      {/* Template selector */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-slate-300">
            Modelo de Página
          </label>
          <button
            type="button"
            onClick={() => setShowTemplateSelector(!showTemplateSelector)}
            className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            {showTemplateSelector ? 'Fechar modelos' : 'Escolher modelo'}
          </button>
        </div>

        {/* Template atual selecionado */}
        <div className="flex items-center gap-3 p-3 bg-[#0a101c] border border-white/[0.06] rounded-xl mb-3">
          <span className="text-xl">{TEMPLATES[template].icon}</span>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-200">
              {TEMPLATES[template].name}
            </p>
            <p className="text-xs text-slate-500">
              {TEMPLATES[template].estimatedDuration}
            </p>
          </div>
          {template !== 'none' && (
            <button
              type="button"
              onClick={() => {
                setTemplate('none');
                setTemplateConfig({});
              }}
              className="text-xs text-slate-500 hover:text-red-400 transition-colors"
            >
              Remover
            </button>
          )}
        </div>

        {/* Seletor expandido */}
        {showTemplateSelector && (
          <TemplateSelector
            selected={template}
            onSelect={handleTemplateSelect}
          />
        )}
      </div>

      {/* Preview do destino */}
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showPreview}
            onChange={e => setShowPreview(e.target.checked)}
            className="w-4 h-4 accent-cyan-500"
          />
          <span className="text-sm text-slate-300">Mostrar destino no redirecionamento</span>
        </label>
      </div>

      {/* Expiração */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Expiração (opcional)
        </label>
        <input
          type="datetime-local"
          value={expiresAt}
          onChange={e => setExpiresAt(e.target.value)}
          className="w-full px-4 py-3 bg-[#0a101c] border border-white/[0.06] rounded-xl text-slate-100 focus:border-cyan-500/50 outline-none"
        />
      </div>

      {/* Botões */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting || !targetUrl}
          className="flex-1 py-3 bg-cyan-500/20 text-cyan-400 rounded-xl font-medium hover:bg-cyan-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-transparent border-t-cyan-400 rounded-full animate-spin" />
              Gerando...
            </span>
          ) : (
            '🔗 Gerar Link'
          )}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-slate-800 text-slate-400 rounded-xl hover:bg-slate-700 transition-colors"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
