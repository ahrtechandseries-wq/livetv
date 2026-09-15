import { cookies } from 'next/headers';

export function isAdminRequest(request) {
  const secret = process.env.NEXLIVE_ADMIN_SECRET;
  if (!secret) return false;
  const header = request.headers.get('x-admin-secret');
  const cookie = cookies().get('nexlive_admin')?.value;
  return header === secret || cookie === secret;
}

export function requireAdmin(request) {
  if (!isAdminRequest(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  return null;
}
