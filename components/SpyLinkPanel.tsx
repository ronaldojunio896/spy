'use client';

import { useState, useEffect } from 'react';
import CreateForm, { type CreateLinkPayload } from './CreateForm';
import LinkCard from './LinkCard';
import LogsTable from './LogsTable';
import StatsPanel from './StatsPanel';

// ============================================================
// PAINEL PRINCIPAL DO SPYLINK
// Gerencia todas as abas: Dashboard, Criar Link, Logs
// ============================================================

type Tab = 'dashboard' | 'create' | 'logs';

interface LinkData {
  id: string;
  trackingUrl: string;
  targetUrl: string;
  title: string;
  category: string;
  template: string;
  templateConfig: Record<string, unknown>;
  showPreview: boolean;
  totalClicks: number;
  status: string;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function SpyLinkPanel() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [links, setLinks] = useState<LinkData[]>([]);
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null);
  const [logs, setLogs] = useState<unknown[]>([]);
  const [metrics, setMetrics] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(false);

  // --- Carregar links ao montar ---
  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/spylinks');
      const data = await res.json();
      if (data.success) {
        setLinks(data.links);
      }
    } catch (error) {
      console.error('Erro ao carregar links:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLogs = async (linkId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/spylinks/${linkId}/logs`);
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs);
        setMetrics(data.metrics);
        setSelectedLinkId(linkId);
        setActiveTab('logs');
      }
    } catch (error) {
      console.error('Erro ao carregar logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (linkId: string) => {
    if (!confirm('Tem certeza que deseja remover este link?')) return;
    try {
      const res = await fetch(`/api/spylinks/${linkId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setLinks(prev => prev.filter(l => l.id !== linkId));
      }
    } catch (error) {
      console.error('Erro ao deletar link:', error);
    }
  };

  // --- Métricas agregadas ---
  const totalLinks = links.length;
  const activeLinks = links.filter(l => l.status === 'active').length;
  const totalClicks = links.reduce((sum, l) => sum + (l.totalClicks || 0), 0);
  const uniqueClicks = Math.round(totalClicks * 0.7); // Estimativa até ter dados reais

  // Top categoria
  const catCount: Record<string, number> = {};
  links.forEach(l => { catCount[l.category] = (catCount[l.category] || 0) + 1; });
  const topCategory = Object.entries(catCount).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';

  // Top template
  const tplCount: Record<string, number> = {};
  links.forEach(l => { tplCount[l.template] = (tplCount[l.template] || 0) + 1; });
  const topTemplate = Object.entries(tplCount).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';

  return (
    <div className="space-y-6">
      {/* Tabs de navegação */}
      <div className="flex items-center gap-1 bg-[#0a101c] border border-white/[0.06] rounded-xl p-1">
        {[
          { id: 'dashboard', label: '📊 Dashboard', icon: '' },
          { id: 'create', label: '🔗 Criar Link', icon: '' },
          { id: 'logs', label: '📋 Logs', icon: '' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-cyan-500/20 text-cyan-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/30'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Conteúdo por aba */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <StatsPanel
            totalLinks={totalLinks}
            activeLinks={activeLinks}
            totalClicks={totalClicks}
            uniqueClicks={uniqueClicks}
            topCategory={topCategory}
            topTemplate={topTemplate}
          />

          {/* Grid de links */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-300">Seus Links</h3>
              <button
                onClick={() => setActiveTab('create')}
                className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                + Novo Link
              </button>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 mx-auto border-2 border-transparent border-t-cyan-400 rounded-full animate-spin" />
              </div>
            ) : links.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-slate-800/50 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🔗</span>
                </div>
                <p className="text-slate-400 text-sm">Nenhum link criado ainda</p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="mt-3 px-4 py-2 text-xs bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors"
                >
                  Criar primeiro link
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {links.map(link => (
                  <LinkCard
                    key={link.id}
                    id={link.id}
                    trackingUrl={link.trackingUrl}
                    targetUrl={link.targetUrl}
                    title={link.title}
                    category={link.category}
                    template={link.template}
                    totalClicks={link.totalClicks}
                    status={link.status}
                    createdAt={link.createdAt}
                    onClick={() => fetchLogs(link.id)}
                    onDelete={() => handleDelete(link.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'create' && (
        <div className="bg-[#0d1422] border border-white/[0.06] rounded-2xl p-6 backdrop-blur-xl">
          <h3 className="text-lg font-semibold text-white mb-6">
            🔗 Criar Novo Link
          </h3>
          <CreateForm
            onSubmit={async (payload: CreateLinkPayload) => {
              // Submit é tratado internamente pelo CreateForm
            }}
            onCancel={() => setActiveTab('dashboard')}
          />
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="bg-[#0d1422] border border-white/[0.06] rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">
              📋 Logs de Acesso
            </h3>
            {selectedLinkId && (
              <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-lg">
                Link: {selectedLinkId}
              </span>
            )}
          </div>
          <LogsTable
            logs={logs as never[]}
            metrics={metrics as never}
          />
        </div>
      )}
    </div>
  );
}
