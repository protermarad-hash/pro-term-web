'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { LogOut, Save, Trash2, Heart, Package, User } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useFavorites } from '@/lib/favorites-context';
import { getSupabaseAnonClient } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type ProfileData = {
  nume_complet: string;
  telefon: string;
  adresa_livrare: string;
  oras: string;
  judet: string;
  cod_postal: string;
};

type Retragere = {
  id: string;
  created_at: string;
  numar_comanda: string;
  produs: string;
  pret: number;
  status: string;
  motiv: string;
};

const EMPTY_PROFILE: ProfileData = {
  nume_complet: '',
  telefon: '',
  adresa_livrare: '',
  oras: '',
  judet: '',
  cod_postal: '',
};

export default function ProfilClient() {
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();
  const { favorites, removeFavorite } = useFavorites();

  const [profile, setProfile] = useState<ProfileData>(EMPTY_PROFILE);
  const [profileLoading, setProfileLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  const [retrageri, setRetrageri] = useState<Retragere[]>([]);
  const [retrageriLoading, setRetrageriLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<'profil' | 'retrageri' | 'favorite'>('profil');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/cont/autentificare');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    const supabase = getSupabaseAnonClient();
    if (!supabase) { setProfileLoading(false); return; }

    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setProfile({
            nume_complet: data.nume_complet ?? '',
            telefon: data.telefon ?? '',
            adresa_livrare: data.adresa_livrare ?? '',
            oras: data.oras ?? '',
            judet: data.judet ?? '',
            cod_postal: data.cod_postal ?? '',
          });
        }
        setProfileLoading(false);
      });
  }, [user]);

  useEffect(() => {
    if (!user?.email) return;
    const supabase = getSupabaseAnonClient();
    if (!supabase) { setRetrageriLoading(false); return; }

    supabase
      .from('retrageri')
      .select('id, created_at, numar_comanda, produs, pret, status, motiv')
      .eq('email', user.email)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setRetrageri((data as Retragere[]) ?? []);
        setRetrageriLoading(false);
      });
  }, [user]);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    const supabase = getSupabaseAnonClient();
    if (!supabase) return;
    setSaving(true);
    setSaveMsg('');
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, ...profile, updated_at: new Date().toISOString() });
    setSaving(false);
    setSaveMsg(error ? 'Eroare la salvare.' : 'Modificările au fost salvate.');
    setTimeout(() => setSaveMsg(''), 4000);
  }

  async function handleSignOut() {
    await signOut();
    router.push('/');
  }

  if (authLoading) {
    return (
      <>
        <Header />
        <main className="flex min-h-screen items-center justify-center pt-24">
          <p className="text-dark-300">Se verifică autentificarea...</p>
        </main>
        <Footer />
      </>
    );
  }

  if (!user) return null;

  const statusColor: Record<string, string> = {
    nou: 'bg-blue-50 text-blue-700 border-blue-200',
    'în procesare': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    aprobat: 'bg-green-50 text-green-700 border-green-200',
    respins: 'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-light-200 pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            {/* Header card */}
            <div className="mb-6 flex items-center justify-between rounded-2xl bg-white px-6 py-5 shadow-card">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <User size={22} className="text-primary" />
                </div>
                <div>
                  <p className="font-heading font-bold text-dark">
                    {profile.nume_complet || user.email}
                  </p>
                  <p className="text-sm text-dark-300">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
              >
                <LogOut size={15} />
                Deconectează-te
              </button>
            </div>

            {/* Tabs */}
            <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
              {([
                { key: 'profil', label: 'Profilul meu', icon: User },
                { key: 'retrageri', label: 'Cereri retragere', icon: Package },
                { key: 'favorite', label: `Favorite (${favorites.length})`, icon: Heart },
              ] as const).map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex flex-shrink-0 items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors ${
                    activeTab === key
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-white text-dark-300 hover:text-dark shadow-card'
                  }`}
                >
                  <Icon size={15} />
                  {label}
                </button>
              ))}
            </div>

            {/* Profil tab */}
            {activeTab === 'profil' && (
              <div className="rounded-3xl bg-white p-6 shadow-card md:p-8">
                <h2 className="mb-6 font-heading text-xl font-bold text-dark">Date personale</h2>
                {profileLoading ? (
                  <p className="text-sm text-dark-300">Se încarcă...</p>
                ) : (
                  <form onSubmit={saveProfile}>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label className="mb-1.5 block text-sm font-medium text-dark">
                          Nume complet
                        </label>
                        <input
                          type="text"
                          value={profile.nume_complet}
                          onChange={(e) => setProfile((p) => ({ ...p, nume_complet: e.target.value }))}
                          className="input-field"
                          placeholder="Ion Popescu"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="mb-1.5 block text-sm font-medium text-dark">
                          Email (nu poate fi modificat)
                        </label>
                        <input
                          type="email"
                          value={user.email ?? ''}
                          readOnly
                          className="input-field cursor-not-allowed bg-slate-50 opacity-60"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-dark">Telefon</label>
                        <input
                          type="tel"
                          value={profile.telefon}
                          onChange={(e) => setProfile((p) => ({ ...p, telefon: e.target.value }))}
                          className="input-field"
                          placeholder="07xx xxx xxx"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-dark">
                          Cod poștal
                        </label>
                        <input
                          type="text"
                          value={profile.cod_postal}
                          onChange={(e) => setProfile((p) => ({ ...p, cod_postal: e.target.value }))}
                          className="input-field"
                          placeholder="310000"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="mb-1.5 block text-sm font-medium text-dark">
                          Adresă livrare
                        </label>
                        <input
                          type="text"
                          value={profile.adresa_livrare}
                          onChange={(e) =>
                            setProfile((p) => ({ ...p, adresa_livrare: e.target.value }))
                          }
                          className="input-field"
                          placeholder="Str. Exemplu nr. 1"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-dark">Oraș</label>
                        <input
                          type="text"
                          value={profile.oras}
                          onChange={(e) => setProfile((p) => ({ ...p, oras: e.target.value }))}
                          className="input-field"
                          placeholder="Arad"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-dark">Județ</label>
                        <input
                          type="text"
                          value={profile.judet}
                          onChange={(e) => setProfile((p) => ({ ...p, judet: e.target.value }))}
                          className="input-field"
                          placeholder="Arad"
                        />
                      </div>
                    </div>

                    {saveMsg && (
                      <div
                        className={`mt-4 rounded-xl px-4 py-3 text-sm ${
                          saveMsg.includes('Eroare')
                            ? 'border border-red-200 bg-red-50 text-red-700'
                            : 'border border-green-200 bg-green-50 text-green-700'
                        }`}
                      >
                        {saveMsg}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={saving}
                      className="mt-6 flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-accent/90 disabled:opacity-60"
                    >
                      <Save size={15} />
                      {saving ? 'Se salvează...' : 'Salvează modificările'}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Retrageri tab */}
            {activeTab === 'retrageri' && (
              <div className="rounded-3xl bg-white p-6 shadow-card md:p-8">
                <h2 className="mb-6 font-heading text-xl font-bold text-dark">
                  Cererile mele de retragere
                </h2>
                {retrageriLoading ? (
                  <p className="text-sm text-dark-300">Se încarcă...</p>
                ) : retrageri.length === 0 ? (
                  <div className="rounded-2xl border border-slate-100 bg-light-200 py-12 text-center">
                    <Package size={32} className="mx-auto mb-3 text-dark-300/40" />
                    <p className="text-sm text-dark-300">Nu aveți cereri de retragere înregistrate.</p>
                    <Link href="/formular-retragere" className="mt-3 inline-block text-sm text-accent hover:underline">
                      Depune o cerere de retragere
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {retrageri.map((r) => (
                      <div
                        key={r.id}
                        className="flex flex-col gap-3 rounded-2xl border border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <p className="font-semibold text-dark">
                            RET-{r.id.slice(0, 8).toUpperCase()}
                          </p>
                          <p className="mt-0.5 text-sm text-dark-300">
                            Comandă: <strong>{r.numar_comanda}</strong> · {r.produs}
                          </p>
                          <p className="mt-0.5 text-xs text-dark-300">
                            {new Date(r.created_at).toLocaleDateString('ro-RO')} · {r.motiv}
                          </p>
                        </div>
                        <span
                          className={`inline-flex self-start rounded-full border px-3 py-1 text-xs font-semibold sm:self-auto ${
                            statusColor[r.status] ?? 'bg-slate-100 text-dark-300 border-slate-200'
                          }`}
                        >
                          {r.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Favorite tab */}
            {activeTab === 'favorite' && (
              <div className="rounded-3xl bg-white p-6 shadow-card md:p-8">
                <h2 className="mb-6 font-heading text-xl font-bold text-dark">
                  Produsele mele favorite
                </h2>
                {favorites.length === 0 ? (
                  <div className="rounded-2xl border border-slate-100 bg-light-200 py-12 text-center">
                    <Heart size={32} className="mx-auto mb-3 text-dark-300/40" />
                    <p className="text-sm text-dark-300">Nu aveți produse favorite salvate.</p>
                    <Link href="/produse" className="mt-3 inline-block text-sm text-accent hover:underline">
                      Explorați produsele
                    </Link>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {favorites.map((fav) => (
                      <div
                        key={fav.slug}
                        className="flex items-center gap-3 rounded-2xl border border-slate-100 p-3"
                      >
                        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-light-200">
                          {fav.imageUrl ? (
                            <Image
                              src={fav.imageUrl}
                              alt={fav.name}
                              fill
                              sizes="56px"
                              className="object-contain p-1"
                              unoptimized
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <Heart size={16} className="text-dark-300/40" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/produse/${fav.slug}`}
                            className="block truncate text-sm font-semibold text-dark hover:text-accent transition-colors"
                          >
                            {fav.name}
                          </Link>
                          <p className="text-xs text-dark-300">
                            {fav.price > 0
                              ? `${fav.price.toLocaleString('ro-RO')} RON`
                              : fav.priceLabel ?? 'Cere ofertă'}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFavorite(fav.slug)}
                          className="flex-shrink-0 rounded-lg p-1.5 text-dark-300/60 hover:bg-red-50 hover:text-red-500 transition-colors"
                          aria-label="Șterge din favorite"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
