'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldOff } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { getSupabaseAnonClient } from '@/lib/supabase';

type CheckState = 'loading' | 'forbidden' | 'allowed';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [state, setState] = useState<CheckState>('loading');

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace('/cont/autentificare');
      return;
    }

    const supabase = getSupabaseAnonClient();
    if (!supabase) {
      setState('forbidden');
      return;
    }

    supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        const d = data as { is_admin?: boolean } | null;
        setState(d?.is_admin === true ? 'allowed' : 'forbidden');
      });
  }, [authLoading, user, router]);

  if (state === 'loading' || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-light-200">
        <p className="text-sm text-dark-300">Se verifică accesul...</p>
      </main>
    );
  }

  if (state === 'forbidden') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-light-200 px-4">
        <div className="w-full max-w-sm rounded-3xl bg-white p-10 text-center shadow-card">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
            <ShieldOff size={28} className="text-red-500" />
          </div>
          <p className="mb-1 font-heading text-6xl font-bold text-dark">403</p>
          <h1 className="mb-2 font-heading text-xl font-bold text-dark">Acces interzis</h1>
          <p className="mb-6 text-sm text-dark-300">
            Nu aveți permisiunile necesare pentru a accesa zona de administrare.
          </p>
          <Link href="/" className="btn-primary justify-center">
            Înapoi la site
          </Link>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
