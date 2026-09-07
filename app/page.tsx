'use client';

import { useState } from 'react';
import SpyLinkPanel from '@/components/spylink/SpyLinkPanel';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  const NavItem = ({ id, icon, label }: { id: string; icon: string; label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={
        'group w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ' +
        (activeTab === id
          ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
          : 'text-slate-400 hover:text-white hover:bg-white/[0.04]')
      }
    >
      <span className={'w-9 h-9 rounded-lg flex items-center justify-center text-lg ' + (activeTab === id ? 'bg-cyan-500/10' : 'bg-slate-900')}>
        {icon}
      </span>
      <span className="flex-1 text-left text-sm font-medium">{label}</span>
    </button>
  );

  return (
    <div className="h-screen w-full overflow-hidden bg-[#070b14] text-slate-100 font-sans flex">
      {/* SIDEBAR */}
      <aside className={'flex flex-col border-r border-white/[0.06] bg-[#0a101c] transition-all duration-300 ' + (isSidebarOpen ? 'w-[270px]' : 'w-[78px]')}>
        <div className="h-[76px] flex items-center px-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/20">
              <span className="text-xl">🛡️</span>
            </div>
            {isSidebarOpen && (
              <div className="min-w-0">
                <h1 className="text-sm font-bold tracking-wide text-white">R1 TECH</h1>
                <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-400">Operations</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {isSidebarOpen && <p className="px-3 mb-2 mt-2 text-[10px] uppercase tracking-[0.18em] font-bold text-slate-600">Principal</p>}
          <NavItem id="dashboard" icon="▦" label={isSidebarOpen ? 'Dashboard' : ''} />
          <NavItem id="spylink" icon="🔗" label={isSidebarOpen ? 'SpyLink' : ''} />
          <NavItem id="min" icon="🗺️" label={isSidebarOpen ? 'Mapeamento MIN' : ''} />
          <NavItem id="geoword" icon="🌐" label={isSidebarOpen ? 'GeoWord' : ''} />

          {isSidebarOpen && (
            <>
              <p className="px-3 mb-2 mt-8 text-[10px] uppercase tracking-[0.18em] font-bold text-slate-600">Sistema</p>
              <NavItem id="activity" icon="◷" label="Atividade" />
              <NavItem id="settings" icon="⚙️" label="Configurações" />
            </>
          )}
        </div>

        <div className="p-3 border-t border-white/[0.06]">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-full rounded-xl border border-white/[0.05] bg-white/[0.02] py-2.5 text-slate-500 hover:text-white transition text-xs">
            {isSidebarOpen ? '‹ Recolher menu' : '›'}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-[76px] flex items-center justify-between px-7 border-b border-white/[0.06] bg-[#090e18]/95 backdrop-blur-xl shrink-0">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-400 font-bold">R1 TECH</p>
            <h2 className="text-lg font-bold text-white">
              {activeTab === 'dashboard' && 'Central Operacional'}
              {activeTab === 'spylink' && 'SpyLink Reformulado'}
              {activeTab === 'min' && 'Mapeamento Investigativo'}
              {activeTab === 'geoword' && 'GeoWord'}
              {activeTab === 'activity' && 'Atividade'}
              {activeTab === 'settings' && 'Configurações'}
            </h2>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <div className="p-7 max-w-[1600px] mx-auto">
              <h1 className="text-3xl font-bold tracking-tight text-white mb-6">Central Operacional</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button onClick={() => setActiveTab('spylink')} className="text-left rounded-2xl border border-white/[0.06] bg-[#0d1422] p-5 hover:border-cyan-500/20 transition">
                  <h3 className="font-bold text-white text-lg">🔗 SpyLink Reformulado</h3>
                  <p className="text-xs text-slate-500 mt-1">Gerenciamento avançado de links e templates.</p>
                </button>
                <button onClick={() => setActiveTab('min')} className="text-left rounded-2xl border border-white/[0.06] bg-[#0d1422] p-5 hover:border-cyan-500/20 transition">
                  <h3 className="font-bold text-white text-lg">🗺️ Mapeamento MIN</h3>
                  <p className="text-xs text-slate-500 mt-1">Geolocalização de alvos.</p>
                </button>
                <button onClick={() => setActiveTab('geoword')} className="text-left rounded-2xl border border-white/[0.06] bg-[#0d1422] p-5 hover:border-cyan-500/20 transition">
                  <h3 className="font-bold text-white text-lg">🌐 GeoWord</h3>
                  <p className="text-xs text-slate-500 mt-1">Ferramenta de relatórios e dados globais.</p>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'spylink' && (
            <div className="p-7 max-w-[1600px] mx-auto">
              <SpyLinkPanel />
            </div>
          )}

          {activeTab === 'min' && (
            <div className="p-7 max-w-[1400px] mx-auto">
              <h1 className="text-2xl font-bold mb-2">Mapeamento MIN</h1>
              <p className="text-sm text-slate-500">Módulo de geolocalização e alvos.</p>
            </div>
          )}

          {activeTab === 'geoword' && (
            <div className="p-7 max-w-[1400px] mx-auto">
              <div className="rounded-2xl border border-white/[0.06] bg-[#0d1422] p-7">
                <h1 className="text-2xl font-bold text-cyan-400">🌐 GeoWord — Relatórios Globais</h1>
                <p className="text-sm text-slate-400 mt-2">Módulo operacional dedicado a relatórios integrados, análise de dados textuais e geolocalização estendida.</p>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="p-7 max-w-[1200px] mx-auto">
              <h1 className="text-2xl font-bold mb-2">Atividade</h1>
              <p className="text-sm text-slate-500">Histórico de ações recentes.</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="p-7 max-w-[1000px] mx-auto">
              <h1 className="text-2xl font-bold mb-2">Configurações</h1>
              <p className="text-sm text-slate-500">Parâmetros do sistema.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}