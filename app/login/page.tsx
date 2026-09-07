'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/');
        router.refresh();
      } else {
        setError(data.message || 'Erro ao autenticar');
      }
    } catch (err) {
      setError('Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#070b14] text-slate-100 font-sans p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#0d1422] p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="text-center mb-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-xl shadow-cyan-500/20 mb-4">
            <span className="text-3xl">🛡️</span>
          </div>
          <h1 className="text-xl font-bold tracking-wider text-white">R1 TECH</h1>
          <p className="text-[10px] uppercase tracking-[0.25em] text-cyan-400 mt-1">
            Secure Operations Center
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-300 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
              E-mail Operacional
            </label>
            <input
              type="email"
              required
              placeholder="r1@tech.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 text-xs text-white outline-none focus:border-cyan-500/50 transition"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
              Senha de Acesso
            </label>
            <input
              type="password"
              required
              placeholder="••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 text-xs text-white outline-none focus:border-cyan-500/50 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl bg-cyan-500 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition shadow-lg shadow-cyan-500/20 disabled:opacity-50 mt-2"
          >
            {loading ? 'Autenticando...' : 'Acessar Painel'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[10px] text-slate-600">
            Acesso restrito a operadores autorizados.
          </p>
        </div>
      </div>
    </div>
  );
}