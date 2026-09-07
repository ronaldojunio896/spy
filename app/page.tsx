'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push('/dashboard');
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.message || 'Credenciais inválidas');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      <form onSubmit={handleLogin} className="bg-gray-900 p-8 rounded-xl border border-gray-800 w-96 shadow-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center text-cyan-400">Spy OSINT - Login</h1>
        
        {error && <div className="mb-4 p-3 bg-red-950 border border-red-800 text-red-200 text-sm rounded">{error}</div>}
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-300">E-mail</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full p-3 bg-gray-950 border border-gray-800 rounded text-white focus:outline-none focus:border-cyan-500"
            required 
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-300">Senha</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full p-3 bg-gray-950 border border-gray-800 rounded text-white focus:outline-none focus:border-cyan-500"
            required 
          />
        </div>

        <button type="submit" className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 font-bold rounded transition-colors text-white">
          Entrar no Sistema
        </button>
      </form>
    </div>
  );
}