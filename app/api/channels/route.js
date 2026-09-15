import { NextResponse } from 'next/server';
import { buildCatalogue } from '@/lib/aggregate';
import { getAdminChannels } from '@/lib/adminStore';

let catalogueCache = { value: null, expires: 0 };
const SOURCE_TTL = 15 * 60 * 1000;

async function getBaseCatalogue() {
  if (catalogueCache.value && Date.now() < catalogueCache.expires) return catalogueCache.value;
  const value = await buildCatalogue();
  catalogueCache = { value, expires: Date.now() + SOURCE_TTL };
  return value;
}

export async function GET() {
  try {
    const [catalogue, stored] = await Promise.all([getBaseCatalogue(), getAdminChannels()]);
    const admin = (stored || []).filter(c => c.enabled !== false && c.name && c.url).map(c => ({
      ...c,
      source: c.source || 'Admin', logo: c.logo || null,
      countryCode: c.countryCode || 'OTHER', countryLabel: c.countryLabel || 'Other',
      categoryKey: c.categoryKey || 'other', categoryLabel: c.categoryLabel || 'Other', language: c.language || null
    }));
    const adminUrls = new Set(admin.map(c => c.url.toLowerCase().trim()));
    const merged = [...admin, ...catalogue.channels.filter(c => !adminUrls.has(c.url.toLowerCase().trim()))];
    return NextResponse.json({ ...catalogue, channels: merged, total: merged.length, adminCount: admin.length }, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' }
    });
  } catch (err) {
    console.log('NexLive /api/channels failed:', err);
    return NextResponse.json({ error: 'Could not build the channel catalogue right now.', channels: [] }, { status: 502 });
  }
}
