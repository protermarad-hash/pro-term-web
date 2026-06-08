'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSupabaseAnonClient } from '@/lib/supabase';

type Mode = 'login' | 'register';

export default function AutentificareClient() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  function reset() {
    setError('');
    setSuccess('');
    setName('');
    setEmail('');
    setPassword('');
    setConfirm('');
  }

  function switchMode(m: Mode) {
    reset();
    setMode(m);
  }

  function romanianError(msg: string): string {
    if (msg.includes('Invalid login credentials')) return 'Email sau parolă incorectă.';
    if (msg.includes('Email not confirmed')) return 'Contul nu este confirmat. Verificați emailul.';
    if (msg.includes('User already registered')) return 'Există deja un cont cu acest email.';
    if (msg.includes('Password should be at least')) return 'Parola trebuie să aibă cel puțin 6 caractere.';
    if (msg.includes('Unable to validate email')) return 'Adresa de email este invalidă.';
    if (msg.includes('rate limit')) return 'Prea multe încercări. Așteptați câteva minute.';
    return 'A apărut o eroare. Încercați din nou.';
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const supabase = getSupabaseAnonClient();
    if (!supabase) { setError('Serviciul nu este disponibil momentan.'); return; }
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) { setError(romanianError(err.message)); return; }
      router.push('/cont/profil');
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError('Parolele nu se potrivesc.'); return; }
    if (password.length < 6) { setError('Parola trebuie să aibă cel puțin 6 caractere.'); return; }
    const supabase = getSupabaseAnonClient();
    if (!supabase) { setError('Serviciul nu este disponibil momentan.'); return; }
    setLoading(true);
    try {
      const { data, error: err } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      if (err) { setError(romanianError(err.message)); return; }
      if (data.session) {
        router.push('/cont/profil');
      } else {
        setSuccess('Cont creat! Verificați emailul pentru a confirma înregistrarea.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-light-200 px-4 py-24">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block mb-6">
            <span className="font-heading text-2xl font-bold text-primary">PRO TERM</span>
          </Link>
          <div className="flex rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-colors ${
                mode === 'login' ? 'bg-primary text-white shadow-sm' : 'text-dark-300 hover:text-dark'
              }`}
            >
              Intră în cont
            </button>
            <button
              type="button"
              onClick={() => switchMode('register')}
              className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-colors ${
                mode === 'register' ? 'bg-primary text-white shadow-sm' : 'text-dark-300 hover:text-dark'
              }`}
            >
              Creează cont
            </button>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-card">
          {mode === 'login' ? (
            <form onSubmit={handleLogin} noValidate>
              <h1 className="mb-6 font-heading text-2xl font-bold text-dark">Bun venit înapoi</h1>

              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-medium text-dark">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="adresa@email.ro"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-dark outline-none placeholder:text-dark-300/50 focus:border-accent focus:ring-2 focus:ring-accent/30"
                />
              </div>

              <div className="mb-6">
                <label className="mb-1.5 block text-sm font-medium text-dark">Parolă</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-dark outline-none placeholder:text-dark-300/50 focus:border-accent focus:ring-2 focus:ring-accent/30"
                />
              </div>

              {error && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-accent py-3 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60 disabled:translate-y-0"
              >
                {loading ? 'Se conectează...' : 'Intră în cont'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} noValidate>
              <h1 className="mb-6 font-heading text-2xl font-bold text-dark">Creează cont nou</h1>

              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-medium text-dark">Nume complet</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  placeholder="Ion Popescu"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-dark outline-none placeholder:text-dark-300/50 focus:border-accent focus:ring-2 focus:ring-accent/30"
                />
              </div>

              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-medium text-dark">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="adresa@email.ro"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-dark outline-none placeholder:text-dark-300/50 focus:border-accent focus:ring-2 focus:ring-accent/30"
                />
              </div>

              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-medium text-dark">Parolă</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="Minimum 6 caractere"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-dark outline-none placeholder:text-dark-300/50 focus:border-accent focus:ring-2 focus:ring-accent/30"
                />
              </div>

              <div className="mb-6">
                <label className="mb-1.5 block text-sm font-medium text-dark">Confirmă parola</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="Repetă parola"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-dark outline-none placeholder:text-dark-300/50 focus:border-accent focus:ring-2 focus:ring-accent/30"
                />
              </div>

              {error && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-accent py-3 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60 disabled:translate-y-0"
              >
                {loading ? 'Se creează contul...' : 'Creează cont'}
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-dark-300">
          Prin crearea unui cont, ești de acord cu{' '}
          <Link href="/termeni-si-conditii" className="text-accent hover:underline">
            Termenii și condițiile
          </Link>{' '}
          și{' '}
          <Link href="/politica-confidentialitate" className="text-accent hover:underline">
            Politica de confidențialitate
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
