import { NextResponse } from 'next/server';
import { getAdminChannels, KV_KEYS, readKV, writeKV } from '@/lib/adminStore';
import { requireAdmin } from '@/lib/adminAuth';
import { parseM3U } from '@/lib/m3u';

function idFor(channel) {
  if (channel.id) return String(channel.id);
  const raw = `${channel.url || ''}|${channel.name || ''}`.toLowerCase();
  let hash = 0;
  for (let i = 0; i < raw.length; i++) hash = ((hash << 5) - hash + raw.charCodeAt(i)) | 0;
  return `admin-${Math.abs(hash).toString(36)}`;
}

function normalize(c, index = 0) {
  return {
    id: idFor(c), name: String(c.name || '').trim(), url: String(c.url || '').trim(), logo: String(c.logo || '').trim(),
    countryCode: String(c.countryCode || c.country || 'OTHER').toUpperCase(), countryLabel: c.countryLabel || c.country || 'Other',
    categoryKey: String(c.categoryKey || c.category || 'other').toLowerCase(), categoryLabel: c.categoryLabel || c.category || 'Other',
    language: c.language || '', enabled: c.enabled !== false, featured: Boolean(c.featured), home: c.home !== false,
    sortOrder: Number.isFinite(Number(c.sortOrder)) ? Number(c.sortOrder) : index, customSection: c.customSection || '', source: c.source || 'Admin'
  };
}

export async function GET(request) {
  const denied = requireAdmin(request); if (denied) return denied;
  return NextResponse.json({ channels: await getAdminChannels(), configured: Boolean(process.env.CLOUDFLARE_ACCOUNT_ID && process.env.CLOUDFLARE_KV_NAMESPACE_ID && process.env.CLOUDFLARE_API_TOKEN) });
}

export async function PUT(request) {
  const denied = requireAdmin(request); if (denied) return denied;
  try {
    const body = await request.json();
    const channels = Array.isArray(body.channels) ? body.channels.map(normalize).filter(c => c.name && c.url) : null;
    if (!channels) return NextResponse.json({ error: 'channels must be an array.' }, { status: 400 });
    await writeKV(KV_KEYS.channels, channels);
    return NextResponse.json({ ok: true, channels });
  } catch (err) { return NextResponse.json({ error: err.message }, { status: 500 }); }
}

export async function POST(request) {
  const denied = requireAdmin(request); if (denied) return denied;
  try {
    const body = await request.json();
    if (body.action === 'import-m3u') {
      if (!body.url) return NextResponse.json({ error: 'M3U URL is required.' }, { status: 400 });
      const res = await fetch(body.url, { signal: AbortSignal.timeout(20000) });
      if (!res.ok) throw new Error(`M3U source returned HTTP ${res.status}`);
      const parsed = parseM3U(await res.text(), 'Admin M3U Import').slice(0, 5000).map(normalize);
      return NextResponse.json({ channels: parsed, count: parsed.length });
    }
    const current = await getAdminChannels();
    const channel = normalize(body.channel || body, current.length);
    if (!channel.name || !channel.url) return NextResponse.json({ error: 'Name and stream URL are required.' }, { status: 400 });
    const next = [...current.filter(c => c.id !== channel.id), channel];
    await writeKV(KV_KEYS.channels, next);
    return NextResponse.json({ ok: true, channel, channels: next });
  } catch (err) { return NextResponse.json({ error: err.message }, { status: 500 }); }
}

export async function DELETE(request) {
  const denied = requireAdmin(request); if (denied) return denied;
  try {
    const body = await request.json(); const ids = new Set((body.ids || [body.id]).filter(Boolean).map(String));
    const current = await getAdminChannels(); const next = current.filter(c => !ids.has(String(c.id)));
    await writeKV(KV_KEYS.channels, next); return NextResponse.json({ ok: true, channels: next });
  } catch (err) { return NextResponse.json({ error: err.message }, { status: 500 }); }
}
