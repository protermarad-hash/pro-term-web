'use client';

import { getSupabaseAnonClient } from '@/lib/supabase';

export async function getCurrentAccessToken(): Promise<string | null> {
  const supabase = getSupabaseAnonClient();
  if (!supabase) return null;

  const { data, error } = await supabase.auth.getSession();
  if (error) return null;
  return data.session?.access_token ?? null;
}

function withBearer(init: RequestInit, token: string) {
  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${token}`);
  return { ...init, headers };
}

export async function adminFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const token = await getCurrentAccessToken();
  if (!token) {
    throw new Error('Sesiunea de administrator lipsește sau a expirat. Autentifică-te din nou.');
  }

  return fetch(input, withBearer(init, token));
}

export async function fetchWithOptionalAuth(input: RequestInfo | URL, init: RequestInit = {}) {
  const token = await getCurrentAccessToken();
  return fetch(input, token ? withBearer(init, token) : init);
}
