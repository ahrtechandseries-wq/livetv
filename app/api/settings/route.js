import { NextResponse } from 'next/server';
import { getAdminSettings } from '@/lib/adminStore';

export async function GET() {
  const settings = await getAdminSettings();
  return NextResponse.json(settings, { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } });
}
