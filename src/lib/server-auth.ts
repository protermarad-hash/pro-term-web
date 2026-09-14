import 'server-only';

import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase-admin';

type AuthenticatedRequest = {
  ok: true;
  user: User | null;
  userClient: SupabaseClient | null;
};

type RejectedRequest = {
  ok: false;
  response: NextResponse;
};

export type RequestAuthResult = AuthenticatedRequest | RejectedRequest;

function bearerToken(request: Request): { present: boolean; token: string | null } {
  const header = request.headers.get('authorization');
  if (!header) return { present: false, token: null };

  const match = /^Bearer\s+(\S+)$/i.exec(header.trim());
  return { present: true, token: match?.[1] ?? null };
}

function createUserClient(token: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  return createClient(url, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

export async function authenticateRequest(
  request: Request,
  options: { optional?: boolean } = {},
): Promise<RequestAuthResult> {
  const bearer = bearerToken(request);

  if (!bearer.present && options.optional) {
    return { ok: true, user: null, userClient: null };
  }

  if (!bearer.token) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Autentificare necesară.' }, { status: 401 }),
    };
  }

  const userClient = createUserClient(bearer.token);
  if (!userClient) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Eroare internă de configurare.' }, { status: 500 }),
    };
  }

  const { data, error } = await userClient.auth.getUser(bearer.token);
  if (error || !data.user) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Sesiune invalidă sau expirată.' }, { status: 401 }),
    };
  }

  return { ok: true, user: data.user, userClient };
}

export async function userIsAdmin(userClient: SupabaseClient, userId: string) {
  const { data, error } = await userClient
    .from('profiles')
    .select('is_admin')
    .eq('id', userId)
    .maybeSingle();

  if (error) return { ok: false as const, isAdmin: false };
  return { ok: true as const, isAdmin: data?.is_admin === true };
}

export async function requireAdmin(request: Request) {
  const auth = await authenticateRequest(request);
  if (!auth.ok) return auth;

  const admin = await userIsAdmin(auth.userClient!, auth.user!.id);
  if (!admin.ok) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: 'Eroare internă de autorizare.' }, { status: 500 }),
    };
  }

  if (!admin.isAdmin) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: 'Acces interzis.' }, { status: 403 }),
    };
  }

  // The privileged client is created only after identity and admin status are verified.
  const serviceClient = getSupabaseServiceClient();
  if (!serviceClient) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: 'Eroare internă de configurare.' }, { status: 500 }),
    };
  }

  return { ok: true as const, user: auth.user!, serviceClient };
}
