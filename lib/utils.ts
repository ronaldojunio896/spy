import { eq, and, isNull, gt } from 'drizzle-orm';
import { spylinks, logs } from '../drizzle/schema';
import { db } from './db';

// ============================================================
// UTILITÁRIOS — Gerar ID, Parsear User-Agent, Geolocalização
// ============================================================

/**
 * Gera um ID curto e único para o link (6 caracteres alfanuméricos)
 */
export function generateId(length = 6): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Gera um ID garantindo que não colida com um existente no banco
 */
export async function generateUniqueId(length = 6): Promise<string> {
  let id = generateId(length);
  let attempts = 0;
  while (attempts < 10) {
    const existing = await db
      .select({ id: spylinks.id })
      .from(spylinks)
      .where(eq(spylinks.id, id))
      .limit(1);
    if (existing.length === 0) return id;
    id = generateId(length);
    attempts++;
  }
  // Fallback: aumenta o tamanho se houver muitas colisões
  return generateId(10);
}

// ============================================================
// PARSER DE USER-AGENT
// ============================================================

interface ParsedUA {
  device: 'Desktop' | 'Mobile' | 'Tablet';
  browser: string;
  os: string;
}

export function parseUserAgent(ua: string): ParsedUA {
  // Dispositivo
  let device: ParsedUA['device'] = 'Desktop';
  if (/Mobile|Android.*Mobile|iPhone|iPod/i.test(ua)) device = 'Mobile';
  else if (/iPad|Android(?!.*Mobile)|Tablet/i.test(ua)) device = 'Tablet';

  // Browser
  let browser = 'Other';
  if (/Edg\//i.test(ua)) browser = 'Edge';
  else if (/OPR|Opera/i.test(ua)) browser = 'Opera';
  else if (/Chrome/i.test(ua) && !/Edg/i.test(ua)) browser = 'Chrome';
  else if (/Firefox/i.test(ua)) browser = 'Firefox';
  else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';

  // OS
  let os = 'Other';
  if (/Windows/i.test(ua)) os = 'Windows';
  else if (/Mac OS X/i.test(ua) && !/iPhone|iPad|iPod/i.test(ua)) os = 'MacOS';
  else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
  else if (/Android/i.test(ua)) os = 'Android';
  else if (/Linux/i.test(ua)) os = 'Linux';

  return { device, browser, os };
}

// ============================================================
// GEOLOCALIZAÇÃO POR IP (apenas país/cidade — SEM coordenadas GPS)
// Usa API gratuita ip-api.com (sem chave)
// ============================================================

interface GeoResult {
  country: string;
  city: string;
}

export async function getGeoByIp(ip: string): Promise<GeoResult> {
  try {
    // Ignora IPs locais
    if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
      return { country: 'Local', city: 'Local' };
    }

    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city`);
    const data = await res.json();

    if (data.status === 'success') {
      return {
        country: data.country || 'Desconhecido',
        city: data.city || 'Desconhecido',
      };
    }
    return { country: 'Desconhecido', city: 'Desconhecido' };
  } catch {
    return { country: 'Desconhecido', city: 'Desconhecido' };
  }
}

// ============================================================
// VERIFICAR SE VISITANTE É ÚNICO (por IP + spylinkId)
// ============================================================

export async function isUniqueVisitor(spylinkId: string, ip: string): Promise<boolean> {
  const existing = await db
    .select({ id: logs.id })
    .from(logs)
    .where(and(eq(logs.spylinkId, spylinkId), eq(logs.ip, ip)))
    .limit(1);
  return existing.length === 0;
}

// ============================================================
// EXTRAIR IP REAL DOS HEADERS DA VERCEL
// ============================================================

export function getClientIp(headers: Headers): string {
  // Vercel passa o IP real via x-forwarded-for
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    // Pega o primeiro IP da lista (cliente original)
    return forwarded.split(',')[0].trim();
  }
  // Fallback
  return headers.get('x-real-ip') || '0.0.0.0';
}

// ============================================================
// VALIDAR URL
// ============================================================

export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

// ============================================================
// MODELOS PRÉ-PRONTOS DE PÁGINAS INTERMEDIÁRIAS
// ============================================================

export const TEMPLATES = {
  none: {
    id: 'none',
    name: 'Redirecionamento Direto',
    description: 'Redireciona instantaneamente sem página intermediária.',
    defaultConfig: {},
  icon: '⚡',
  preview: 'Nenhuma página intermediária — redirecionamento instantâneo.',
  estimatedDuration: '0s',
  isPremium: false,
  category: 'basic',
  popularity: 95,
  tags: ['rapido', 'direto', 'simples'],
  createdAt: '2025-01-01',
  updatedAt: '2025-06-01',
  author: 'R1 Tech',
    version: '1.0.0',
  },
  loading: {
    id: 'loading',
    name: 'Carregando Conteúdo',
    description: 'Página de loading com barra de progresso. Ideal para simular carregamento de conteúdo.',
    defaultConfig: {
      message: 'Preparando seu conteúdo...',
      submessage: 'Isso levará apenas alguns segundos',
      duration: 3,
      theme: 'dark',
      showProgress: true,
      progressColor: '#06b6d4',
    },
    icon: '⏳',
    preview: 'Página escura com spinner animado e barra de progresso cyan.',
    estimatedDuration: '3s',
    isPremium: false,
    category: 'simulacao',
    popularity: 88,
    tags: ['loading', 'carregando', 'espera', 'progresso'],
    createdAt: '2025-01-15',
    updatedAt: '2025-06-01',
    author: 'R1 Tech',
    version: '1.2.0',
  },
  verification: {
    id: 'verification',
    name: 'Verificação Humana',
    description: 'Página de verificação estilo Cloudflare. O visitante precisa aguardar a verificação.',
    defaultConfig: {
      message: 'Verificando se você é humano...',
      submessage: 'Aguarde enquanto verificamos sua conexão',
      duration: 4,
      theme: 'dark',
      showRay: true,
      rayColor: '#10b981',
      checkIcon: true,
      checkColor: '#10b981',
    },
    icon: '🛡️',
    preview: 'Página estilo Cloudflare com animação de verificação.',
    estimatedDuration: '4s',
    isPremium: false,
    category: 'seguranca',
    popularity: 92,
    tags: ['verificacao', 'humano', 'cloudflare', 'seguranca'],
    createdAt: '2025-02-01',
    updatedAt: '2025-06-01',
    author: 'R1 Tech',
    version: '1.3.0',
  },
  download: {
    id: 'download',
    name: 'Preparando Download',
    description: 'Página que simula preparação de arquivo para download.',
    defaultConfig: {
      message: 'Preparando arquivo para download...',
      submessage: 'O download iniciará automaticamente',
      fileName: 'documento.pdf',
      fileSize: '2.4 MB',
      duration: 5,
      theme: 'dark',
      showProgress: true,
      progressColor: '#06b6d4',
    },
    icon: '📥',
    preview: 'Página com barra de progresso e info do arquivo.',
    estimatedDuration: '5s',
    isPremium: false,
    category: 'download',
    popularity: 85,
    tags: ['download', 'arquivo', 'preparando'],
    createdAt: '2025-02-15',
    updatedAt: '2025-06-01',
    author: 'R1 Tech',
    version: '1.1.0',
  },
  countdown: {
    id: 'countdown',
    name: 'Contagem Regressiva',
    description: 'Página com timer de contagem regressiva antes do redirecionamento.',
    defaultConfig: {
      message: 'Você será redirecionado em...',
      duration: 10,
      theme: 'dark',
      showSeconds: true,
      timerColor: '#06b6d4',
      showCancel: true,
      cancelText: 'Cancelar',
    },
    icon: '⏱️',
    preview: 'Página escura com timer grande centralizado.',
    estimatedDuration: '10s',
    isPremium: true,
    category: 'temporizador',
    popularity: 70,
    tags: ['timer', 'countdown', 'contagem', 'espera'],
    createdAt: '2025-03-01',
    updatedAt: '2025-06-01',
    author: 'R1 Tech',
    version: '1.0.0',
  },
  captcha: {
    id: 'captcha',
    name: 'Desafio Captcha',
    description: 'Página com checkbox de verificação estilo reCAPTCHA.',
    defaultConfig: {
      message: 'Clique para verificar',
      duration: 3,
      theme: 'dark',
      checkboxColor: '#10b981',
      spinnerAfterCheck: true,
    },
    icon: '✅',
    preview: 'Página com checkbox centralizado e animação de verificação.',
    estimatedDuration: '3s',
    isPremium: true,
    category: 'seguranca',
    popularity: 75,
    tags: ['captcha', 'verificacao', 'checkbox', 'recaptcha'],
    createdAt: '2025-03-15',
    updatedAt: '2025-06-01',
    author: 'R1 Tech',
    version: '1.0.0',
  },
  article: {
    id: 'article',
    name: 'Artigo / Notícia',
    description: 'Página intermediária com visual de artigo ou notícia antes do redirecionamento.',
    defaultConfig: {
      headline: 'Conteúdo Exclusivo',
      subheadline: 'Carregando artigo completo...',
      duration: 5,
      theme: 'dark',
      showReadMore: true,
      readMoreText: 'Clique para ler o artigo completo',
    },
    icon: '📰',
    preview: 'Página estilo portal de notícias com headline e botão.',
    estimatedDuration: '5s',
    isPremium: true,
    category: 'conteudo',
    popularity: 65,
    tags: ['artigo', 'noticia', 'conteudo', 'blog'],
    createdAt: '2025-04-01',
    updatedAt: '2025-06-01',
    author: 'R1 Tech',
    version: '1.0.0',
  },
} as const;

export type TemplateId = keyof typeof TEMPLATES;
export type Template = (typeof TEMPLATES)[TemplateId];
