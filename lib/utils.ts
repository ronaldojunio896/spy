export function generateId(length = 6): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function parseUserAgent(ua: string) {
  let device = 'Desktop';
  if (/mobile/i.test(ua)) device = 'Mobile';
  if (/tablet/i.test(ua)) device = 'Tablet';

  let browser = 'Unknown Browser';
  if (/chrome/i.test(ua) && !/edge/i.test(ua)) browser = 'Chrome';
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari';
  else if (/firefox/i.test(ua)) browser = 'Firefox';
  else if (/edge/i.test(ua)) browser = 'Edge';

  let os = 'Unknown OS';
  if (/windows/i.test(ua)) os = 'Windows';
  else if (/mac os/i.test(ua)) os = 'macOS';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/iphone|ipad/i.test(ua)) os = 'iOS';
  else if (/linux/i.test(ua)) os = 'Linux';

  return { device, browser, os };
}

export async function getGeoLocation(ip: string) {
  if (!ip || ip === '127.0.0.1' || ip === '::1') {
    return { country: 'Localhost', city: 'Local Network' };
  }
  try {
    const res = await fetch(http://ip-api.com/json/);
    const data = await res.json();
    if (data.status === 'success') {
      return { country: data.country || 'Desconhecido', city: data.city || 'Desconhecida' };
    }
  } catch (e) {
    // Falha silenciosa na geolocalização por IP
  }
  return { country: 'Desconhecido', city: 'Desconhecida' };
}

export const TEMPLATES = [
  { id: 'none', name: 'Redirecionamento Direto', icon: '⚡', description: 'Vai direto pro alvo sem intermediários', premium: false },
  { id: 'loading', name: 'Carregamento / Spinner', icon: '⏳', description: 'Simula tela de carregamento antes de redirecionar', premium: false },
  { id: 'verification', name: 'Verificação de Segurança', icon: '🛡️', description: 'Estilo Cloudflare / Proteção contra bots', premium: false },
  { id: 'download', name: 'Central de Download', icon: '📥', description: 'Simula download de arquivo com progresso', premium: false },
  { id: 'countdown', name: 'Contagem Regressiva', icon: '⏱️', description: 'Timer circular grande antes do redirecionamento', premium: true },
  { id: 'captcha', name: 'Validação Captcha', icon: '✅', description: 'Checkbox estilo reCAPTCHA v2', premium: true },
  { id: 'article', name: 'Artigo / Notícia', icon: '📰', description: 'Página de prévia de manchete e skeleton de leitura', premium: true },
];