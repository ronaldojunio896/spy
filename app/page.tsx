'use client';

import { useEffect, useRef, useState } from 'react';

const STATUS = {
  investigation: {
    label: 'Em Investigação',
    color: 'text-amber-300',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    dot: 'bg-amber-400',
  },
  priority: {
    label: 'Prioridade Alta',
    color: 'text-red-300',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    dot: 'bg-red-400',
  },
  completed: {
    label: 'Concluído',
    color: 'text-emerald-300',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    dot: 'bg-emerald-400',
  },
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [search, setSearch] = useState('');
  const [targets, setTargets] = useState([]);

  const [formData, setFormData] = useState({
    nome: '',
    endereco: '',
    status: 'investigation',
    obs: '',
  });

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (activeTab !== 'min') return;

    if (window.google?.maps) {
      initMap();
      return;
    }

    const existingScript = document.getElementById('google-maps-script');
    if (existingScript) return;

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
    if (!apiKey) return;

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = 'https://maps.googleapis.com/maps/api/js?key=' + apiKey + '&libraries=places';
    script.async = true;
    script.defer = true;
    script.onload = () => { initMap(); };
    document.head.appendChild(script);
  }, [activeTab]);

  const initMap = () => {
    if (!mapRef.current || !window.google?.maps) return;
    if (mapInstanceRef.current) {
      window.google.maps.event.trigger(mapInstanceRef.current, 'resize');
      return;
    }
    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      center: { lat: -19.9167, lng: -43.9345 },
      zoom: 13,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      backgroundColor: '#070b14',
    });
  };

  const addTarget = () => {
    if (!formData.nome.trim()) {
      alert('Informe um nome para o registro.');
      return;
    }
    const newTarget = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toLocaleString('pt-BR'),
    };
    setTargets((prev) => [newTarget, ...prev]);
    setFormData({ nome: '', endereco: '', status: 'investigation', obs: '' });
  };

  const removeTarget = (id) => {
    setTargets((prev) => prev.filter((target) => target.id !== id));
  };

  const filteredTargets = targets.filter((target) => {
    const value = search.toLowerCase();
    return (
      target.nome.toLowerCase().includes(value) ||
      target.endereco.toLowerCase().includes(value) ||
      STATUS[target.status]?.label.toLowerCase().includes(value)
    );
  });

  const NavItem = ({ id, icon, label, badge }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={
        'group w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ' +
        (activeTab === id
          ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
          : 'text-slate-400 hover:text-white hover:bg-white/[0.04]')
      }
    >
      <span
        className={
          'w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all ' +
          (activeTab === id ? 'bg-cyan-500/10' : 'bg-slate-900 group-hover:bg-slate-800')
        }
      >
        {icon}
      </span>
      <span className="flex-1 text-left text-sm font-medium">{label}</span>
      {badge && (
        <span className="min-w-5 h-5 px-1.5 flex items-center justify-center rounded-full bg-cyan-500/10 text-cyan-300 text-[10px] font-bold">
          {badge}
        </span>
      )}
    </button>
  );

  const StatCard = ({ icon, title, value, description, accent = 'cyan' }) => {
    const accentMap = {
      cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/10',
      emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/10',
      amber: 'text-amber-400 bg-amber-500/10 border-amber-500/10',
      red: 'text-red-400 bg-red-500/10 border-red-500/10',
    };
    return (
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0d1422] p-5 shadow-xl">
        <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-cyan-500/5 blur-2xl" />
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">{title}</p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white">{value}</p>
            <p className="mt-1 text-xs text-slate-500">{description}</p>
          </div>
          <div className={'h-11 w-11 rounded-xl border flex items-center justify-center text-xl ' + accentMap[accent]}>
            {icon}
          </div>
        </div>
      </div>
    );
  };

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
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-full rounded-xl border border-white/[0.05] bg-white/[0.02] py-2.5 text-slate-500 hover:text-white hover:bg-white/[0.05] transition text-xs">
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
              {activeTab === 'spylink' && 'SpyLink'}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onClick={() => setActiveTab('spylink')} className="text-left rounded-2xl border border-white/[0.06] bg-[#0d1422] p-5 hover:border-cyan-500/20 transition">
                  <h3 className="font-bold text-white text-lg">🔗 SpyLink</h3>
                  <p className="text-xs text-slate-500 mt-1">Gerenciamento de links e campanhas.</p>
                </button>
                <button onClick={() => setActiveTab('min')} className="text-left rounded-2xl border border-white/[0.06] bg-[#0d1422] p-5 hover:border-cyan-500/20 transition">
                  <h3 className="font-bold text-white text-lg">🗺️ Mapeamento MIN</h3>
                  <p className="text-xs text-slate-500 mt-1">Geolocalização de alvos em tempo real.</p>
                </button>
                <button onClick={() => setActiveTab('geoword')} className="text-left rounded-2xl border border-white/[0.06] bg-[#0d1422] p-5 hover:border-cyan-500/20 transition">
                  <h3 className="font-bold text-white text-lg">🌐 GeoWord</h3>
                  <p className="text-xs text-slate-500 mt-1">Nova ferramenta de relatórios e dados globais.</p>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'spylink' && (
            <div className="p-7 max-w-[1400px] mx-auto">
              <h1 className="text-2xl font-bold mb-2">SpyLink</h1>
              <p className="text-sm text-slate-500">Módulo de inteligência de links ativos.</p>
            </div>
          )}

          {activeTab === 'min' && (
            <div className="h-full flex relative">
              <aside className="w-[380px] bg-[#0a101c] border-r border-white/[0.06] p-4 flex flex-col">
                <h2 className="font-bold text-sm text-cyan-400 mb-4">Mapeamento MIN</h2>
                <div className="space-y-3">
                  <input type="text" placeholder="Nome do Alvo" value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} className="w-full h-10 rounded-xl bg-white/[0.02] border border-white/[0.06] px-3 text-xs text-white" />
                  <input type="text" placeholder="Endereço" value={formData.endereco} onChange={(e) => setFormData({...formData, endereco: e.target.value})} className="w-full h-10 rounded-xl bg-white/[0.02] border border-white/[0.06] px-3 text-xs text-white" />
                  <button onClick={addTarget} className="w-full h-10 rounded-xl bg-cyan-500 text-xs font-bold text-slate-950">Adicionar Registro</button>
                </div>
              </aside>
              <div className="flex-1 relative">
                <div ref={mapRef} className="absolute inset-0"></div>
              </div>
            </div>
          )}

          {activeTab === 'geoword' && (
            <div className="p-7 max-w-[1400px] mx-auto">
              <div className="rounded-2xl border border-white/[0.06] bg-[#0d1422] p-7">
                <h1 className="text-2xl font-bold text-cyan-400">🌐 GeoWord — Nova Ferramenta</h1>
                <p className="text-sm text-slate-400 mt-2">Módulo operacional dedicado a relatórios integrados, análise de dados textuais e geolocalização estendida.</p>
                <div className="mt-6 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                  <p className="text-xs text-slate-500">Status: Módulo carregado e pronto para receber parâmetros de integração.</p>
                </div>
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