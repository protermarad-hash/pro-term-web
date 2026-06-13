import { NextResponse } from 'next/server';
import { getSupabaseServiceClient } from './supabase';

type AdminAuthOk = { ok: true; userId: string };
type AdminAuthFail = { ok: false; response: NextResponse };
export type AdminAuthResult = AdminAuthOk | AdminAuthFail;

export async function requireAdmin(request: Request): Promise<AdminAuthResult> {
  const token = request.headers.get('Authorization')?.replace(/^Bearer\s+/i, '').trim();

  if (!token) {
    return { ok: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return { ok: false, response: NextResponse.json({ error: 'Server error' }, { status: 500 }) };
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return { ok: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile?.is_admin) {
    return { ok: false, response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }

  return { ok: true, userId: user.id };
}
