const KV_URL = () => {
  const account = process.env.CLOUDFLARE_ACCOUNT_ID;
  const namespace = process.env.CLOUDFLARE_KV_NAMESPACE_ID;
  const token = process.env.CLOUDFLARE_API_TOKEN;
  if (!account || !namespace || !token) return null;
  return { account, namespace, token };
};

async function kvRequest(key, init = {}) {
  const cfg = KV_URL();
  if (!cfg) return null;
  const url = `https://api.cloudflare.com/client/v4/accounts/${cfg.account}/storage/kv/namespaces/${cfg.namespace}/values/${encodeURIComponent(key)}`;
  const res = await fetch(url, {
    ...init,
    headers: { Authorization: `Bearer ${cfg.token}`, ...(init.headers || {}) },
    cache: 'no-store'
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Cloudflare KV HTTP ${res.status}`);
  return res;
}

export async function readKV(key, fallback = null) {
  const res = await kvRequest(key);
  if (!res) return fallback;
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

export async function writeKV(key, value) {
  const cfg = KV_URL();
  if (!cfg) throw new Error('Cloudflare KV is not configured.');
  const url = `https://api.cloudflare.com/client/v4/accounts/${cfg.account}/storage/kv/namespaces/${cfg.namespace}/values/${encodeURIComponent(key)}`;
  const body = typeof value === 'string' ? value : JSON.stringify(value);
  const res = await fetch(url, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${cfg.token}`, 'Content-Type': 'application/json' },
    body,
    cache: 'no-store'
  });
  if (!res.ok) throw new Error(`Cloudflare KV HTTP ${res.status}`);
  return true;
}

export const KV_KEYS = {
  channels: 'nexlive:admin:channels',
  settings: 'nexlive:admin:settings'
};

export const DEFAULT_SETTINGS = {
  siteName: 'NexLive',
  logoUrl: '',
  faviconUrl: '/icon.svg',
  description: 'Premium live TV, sports, news and international channels.',
  footer: 'NexLive by AHR',
  primaryColor: '#C4172C',
  accentColor: '#E11D48',
  watermarkUrl: '',
  watermarkEnabled: true,
  watermarkPosition: 'top-left',
  watermarkOpacity: 0.72,
  watermarkSize: 42
};

export async function getAdminChannels() {
  return (await readKV(KV_KEYS.channels, [])) || [];
}

export async function getAdminSettings() {
  return { ...DEFAULT_SETTINGS, ...((await readKV(KV_KEYS.settings, {})) || {}) };
}

export function hasKVConfig() {
  return Boolean(KV_URL());
}
