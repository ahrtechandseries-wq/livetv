import { NextResponse } from 'next/server';
import { getAdminSettings, KV_KEYS, writeKV } from '@/lib/adminStore';
import { requireAdmin } from '@/lib/adminAuth';

export async function GET(request) { const denied = requireAdmin(request); if (denied) return denied; return NextResponse.json(await getAdminSettings()); }
export async function PUT(request) {
  const denied = requireAdmin(request); if (denied) return denied;
  try { const current = await getAdminSettings(); const body = await request.json(); const next = { ...current, ...body, watermarkOpacity: Math.min(1, Math.max(0, Number(body.watermarkOpacity ?? current.watermarkOpacity))), watermarkSize: Math.min(160, Math.max(16, Number(body.watermarkSize ?? current.watermarkSize))) }; await writeKV(KV_KEYS.settings, next); return NextResponse.json(next); }
  catch (err) { return NextResponse.json({ error: err.message }, { status: 500 }); }
}
