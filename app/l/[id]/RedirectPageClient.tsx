'use client';

import { useEffect, useState } from 'react';
import { TEMPLATES, type TemplateId } from '@/lib/utils';

// ============================================================
// PÁGINA INTERMEDIÁRIA — CLIENT-SIDE
// Renderiza o template selecionado e depois redireciona
// ============================================================

interface RedirectPageClientProps {
  targetUrl: string;
  template: string;
  templateConfig: Record<string, unknown>;
  showPreview: boolean;
}

export default function RedirectPageClient({
  targetUrl,
  template,
  templateConfig,
  showPreview,
}: RedirectPageClientProps) {
  const config = {
    ...(TEMPLATES[template as TemplateId]?.defaultConfig || {}),
    ...templateConfig,
  } as Record<string, unknown>;

  const duration = (config.duration as number) || 3;
  const theme = (config.theme as string) || 'dark';
  const message = (config.message as string) || 'Redirecionando...';
  const submessage = (config.submessage as string) || '';
  const [progress, setProgress] = useState(0);
  const [seconds, setSeconds] = useState(duration);

  useEffect(() => {
    // Timer de progresso
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + (100 / (duration * 20));
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        return next;
      });
    }, 50);

    // Timer de segundos
    const secInterval = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          clearInterval(secInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Redirecionar após a duração
    const timeout = setTimeout(() => {
      window.location.href = targetUrl;
    }, duration * 1000);

    return () => {
      clearInterval(interval);
      clearInterval(secInterval);
      clearTimeout(timeout);
    };
  }, [duration, targetUrl]);

  // ============================================================
  // RENDERIZAÇÃO POR TEMPLATE
  // ============================================================

  const bgClass = theme === 'dark'
    ? 'bg-[#070b14] text-slate-100'
    : 'bg-white text-slate-900';

  // --- Template: Loading ---
  if (template === 'loading') {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${bgClass}`}>
        {/* Spinner */}
        <div className="relative mb-8">
          <div className="w-16 h-16 border-4 border-slate-700 rounded-full" />
          <div
            className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-cyan-400 rounded-full animate-spin"
          />
        </div>

        {/* Mensagem */}
        <h2 className="text-xl font-medium mb-2">{message}</h2>
        {submessage && <p className="text-slate-400 text-sm mb-6">{submessage}</p>}

        {/* Barra de progresso */}
        {(config.showProgress as boolean) && (
          <div className="w-64 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-50 ease-linear"
              style={{
                width: `${progress}%`,
                backgroundColor: (config.progressColor as string) || '#06b6d4',
              }}
            />
          </div>
        )}

        {/* Preview */}
        {showPreview && (
          <p className="text-slate-500 text-xs mt-6">
            Destino: {new URL(targetUrl).hostname}
          </p>
        )}
      </div>
    );
  }

  // --- Template: Verification (estilo Cloudflare) ---
  if (template === 'verification') {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${bgClass}`}>
        <div className="text-center">
          {/* Ícone de verificação */}
          <div className="relative w-20 h-20 mx-auto mb-6">
            {(config.showRay as boolean) && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-16 h-16 border-2 border-transparent border-t-emerald-400 rounded-full animate-spin"
                  style={{ borderColor: `transparent transparent ${(config.rayColor as string) || '#10b981'} transparent` }}
                />
              </div>
            )}
            {(config.checkIcon as boolean) && seconds <= 1 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>

          <h2 className="text-xl font-medium mb-2">{message}</h2>
          {submessage && <p className="text-slate-400 text-sm mb-4">{submessage}</p>}

          {/* Ray ID falso (estilo Cloudflare) */}
          <p className="text-slate-600 text-xs font-mono">
            Ray ID: {Math.random().toString(36).substring(2, 14).toUpperCase()}
          </p>
        </div>

        {showPreview && (
          <p className="text-slate-500 text-xs mt-8">
            Destino: {new URL(targetUrl).hostname}
          </p>
        )}
      </div>
    );
  }

  // --- Template: Download ---
  if (template === 'download') {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${bgClass}`}>
        <div className="bg-[#0d1422] border border-white/[0.06] rounded-2xl p-8 max-w-md w-full mx-4">
          {/* Ícone de arquivo */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p className="font-medium">{(config.fileName as string) || 'Arquivo'}</p>
              <p className="text-slate-400 text-sm">{(config.fileSize as string) || ''}</p>
            </div>
          </div>

          <h2 className="text-lg font-medium mb-2">{message}</h2>
          {submessage && <p className="text-slate-400 text-sm mb-6">{submessage}</p>}

          {/* Barra de progresso */}
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-2">
            <div
              className="h-full rounded-full transition-all duration-50 ease-linear"
              style={{
                width: `${progress}%`,
                backgroundColor: (config.progressColor as string) || '#06b6d4',
              }}
            />
          </div>
          <p className="text-slate-500 text-xs text-right">{Math.round(progress)}%</p>
        </div>

        {showPreview && (
          <p className="text-slate-500 text-xs mt-4">
            Destino: {new URL(targetUrl).hostname}
          </p>
        )}
      </div>
    );
  }

  // --- Template: Countdown ---
  if (template === 'countdown') {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${bgClass}`}>
        <h2 className="text-xl font-medium mb-8">{message}</h2>

        {/* Timer grande */}
        <div
          className="text-7xl font-bold mb-8"
          style={{ color: (config.timerColor as string) || '#06b6d4' }}
        >
          {seconds}
        </div>

        {/* Barra de progresso circular (decorativa) */}
        <svg className="w-32 h-32 mb-6" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="4" />
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke={(config.timerColor as string) || '#06b6d4'}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
            transform="rotate(-90 50 50)"
            className="transition-all duration-50"
          />
        </svg>

        {(config.showCancel as boolean) && (
          <button
            className="text-slate-500 text-sm underline hover:text-slate-300 transition-colors"
            onClick={() => window.history.back()}
          >
            {(config.cancelText as string) || 'Cancelar'}
          </button>
        )}

        {showPreview && (
          <p className="text-slate-500 text-xs mt-6">
            Destino: {new URL(targetUrl).hostname}
          </p>
        )}
      </div>
    );
  }

  // --- Template: Captcha ---
  if (template === 'captcha') {
    const [checked, setChecked] = useState(false);

    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${bgClass}`}>
        <div className="bg-[#0d1422] border border-white/[0.06] rounded-2xl p-6 max-w-sm w-full mx-4">
          <div className="flex items-center gap-3">
            {/* Checkbox estilo reCAPTCHA */}
            <button
              onClick={() => setChecked(true)}
              className={`w-7 h-7 rounded border-2 flex items-center justify-center transition-all ${
                checked
                  ? 'border-emerald-400 bg-emerald-400/10'
                  : 'border-slate-600 hover:border-slate-400'
              }`}
            >
              {checked && (
                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
            <span className="text-sm">{message}</span>
          </div>

          {/* Spinner após check */}
          {checked && (config.spinnerAfterCheck as boolean) && (
            <div className="flex items-center gap-2 mt-4 ml-10">
              <div className="w-4 h-4 border-2 border-transparent border-t-cyan-400 rounded-full animate-spin" />
              <span className="text-slate-400 text-xs">Verificando...</span>
            </div>
          )}

          {/* Marca d'água */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.06]">
            <span className="text-slate-600 text-xs">SpyLink Security</span>
            <span className="text-slate-600 text-xs">v1.0</span>
          </div>
        </div>

        {showPreview && (
          <p className="text-slate-500 text-xs mt-4">
            Destino: {new URL(targetUrl).hostname}
          </p>
        )}
      </div>
    );
  }

  // --- Template: Article ---
  if (template === 'article') {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${bgClass}`}>
        <div className="max-w-lg w-full mx-4">
          {/* Headline */}
          <h1 className="text-2xl font-bold mb-3">{config.headline as string}</h1>
          <p className="text-slate-400 mb-6">{config.subheadline as string}</p>

          {/* Skeleton de artigo */}
          <div className="space-y-3 mb-6">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-3 bg-slate-800 rounded animate-pulse"
                style={{ width: `${100 - i * 15}%` }}
              />
            ))}
          </div>

          {/* Botão */}
          {(config.showReadMore as boolean) && (
            <button
              className="w-full py-3 bg-cyan-500/10 text-cyan-400 rounded-xl font-medium hover:bg-cyan-500/20 transition-colors"
              onClick={() => window.location.href = targetUrl}
            >
              {(config.readMoreText as string) || 'Ler artigo completo'}
            </button>
          )}
        </div>

        {showPreview && (
          <p className="text-slate-500 text-xs mt-6">
            Destino: {new URL(targetUrl).hostname}
          </p>
        )}
      </div>
    );
  }

  // --- Fallback: Redirecionamento genérico ---
  return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${bgClass}`}>
      <div className="relative mb-6">
        <div className="w-12 h-12 border-4 border-slate-700 rounded-full" />
        <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-cyan-400 rounded-full animate-spin" />
      </div>
      <h2 className="text-lg font-medium">{message}</h2>
      <p className="text-slate-500 text-sm mt-2">Redirecionando em {seconds}s...</p>
      {showPreview && (
        <p className="text-slate-500 text-xs mt-4">
          Destino: {new URL(targetUrl).hostname}
        </p>
      )}
    </div>
  );
}
