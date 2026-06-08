import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Tag } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getSupabaseServiceClient } from '@/lib/supabase';

export const metadata: Metadata = {
  title: 'Blog HVAC | Sfaturi aer condiționat, montaj și service | PRO TERM',
  description:
    'Articole utile despre aer condiționat, pompe de căldură, montaj și service HVAC în Arad și Timiș. Sfaturi de la specialiști cu 25 ani experiență.',
  alternates: { canonical: 'https://pro-term.ro/blog' },
  openGraph: {
    title: 'Blog HVAC — PRO TERM',
    description: 'Articole despre aer condiționat, montaj, service și HVAC de la specialiști cu 25 ani experiență.',
    url: 'https://pro-term.ro/blog',
  },
};

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  image_url: string | null;
  category: string | null;
  author: string;
  read_time: number | null;
  published_at: string | null;
  tags: string[] | null;
}

const CATEGORIES = ['Toate', 'Ghiduri', 'Montaj & Service', 'Comparații'];

async function getPosts(): Promise<BlogPost[]> {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from('blog_posts')
    .select('id, slug, title, excerpt, image_url, category, author, read_time, published_at, tags')
    .eq('published', true)
    .order('published_at', { ascending: false });

  return data ?? [];
}

function formatDate(iso: string | null) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' });
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-light-200 pb-20 pt-24">
        {/* Hero */}
        <section className="border-b border-slate-100 bg-white py-12">
          <div className="container mx-auto px-4">
            <span className="text-sm font-bold uppercase tracking-widest text-accent">Blog PRO TERM</span>
            <h1 className="mt-2 font-heading text-4xl font-bold text-dark md:text-5xl">
              Sfaturi & Ghiduri HVAC
            </h1>
            <p className="mt-4 max-w-2xl text-dark-300 leading-relaxed">
              Articole practice despre alegerea, instalarea și întreținerea echipamentelor HVAC. Scrise de specialiști cu 25 ani experiență în Arad și Timiș.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 pt-10">
          {posts.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-lg text-dark-300">Niciun articol disponibil momentan.</p>
              <p className="mt-2 text-sm text-dark-300">
                Rulează <code className="rounded bg-gray-100 px-1">scripts/create-blog-table.sql</code> în Supabase pentru a popula articolele.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-4">
              {/* Posts grid */}
              <div className="lg:col-span-3">
                <div className="grid gap-6 sm:grid-cols-2">
                  {posts.map((post) => (
                    <article key={post.id} className="card group flex flex-col overflow-hidden p-0">
                      {post.image_url ? (
                        <div className="relative h-48 w-full overflow-hidden">
                          <Image
                            src={post.image_url}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <div className="flex h-36 items-center justify-center bg-gradient-to-br from-primary/10 to-blue-100">
                          <span className="text-4xl">❄️</span>
                        </div>
                      )}
                      <div className="flex flex-1 flex-col p-5">
                        {post.category && (
                          <span className="mb-2 self-start rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                            {post.category}
                          </span>
                        )}
                        <Link href={`/blog/${post.slug}`}>
                          <h2 className="mb-2 font-heading text-lg font-bold text-dark leading-snug transition-colors group-hover:text-primary">
                            {post.title}
                          </h2>
                        </Link>
                        {post.excerpt && (
                          <p className="mb-4 text-sm text-dark-300 leading-relaxed line-clamp-3">{post.excerpt}</p>
                        )}
                        <div className="mt-auto flex items-center gap-3 border-t border-gray-100 pt-3 text-xs text-dark-300">
                          <span>{formatDate(post.published_at)}</span>
                          {post.read_time && (
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {post.read_time} min citire
                            </span>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <aside className="space-y-6">
                <div className="card">
                  <h3 className="mb-4 font-heading text-base font-bold text-dark">Categorii</h3>
                  <ul className="space-y-2">
                    {CATEGORIES.filter(c => c !== 'Toate').map((cat) => {
                      const count = posts.filter((p) => p.category === cat).length;
                      if (count === 0) return null;
                      return (
                        <li key={cat} className="flex items-center justify-between text-sm">
                          <span className="text-dark-300">{cat}</span>
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold text-dark-300">{count}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="card">
                  <h3 className="mb-4 font-heading text-base font-bold text-dark">Articole recente</h3>
                  <ul className="space-y-3">
                    {posts.slice(0, 4).map((post) => (
                      <li key={post.id}>
                        <Link href={`/blog/${post.slug}`} className="text-sm font-semibold text-dark hover:text-primary leading-snug">
                          {post.title}
                        </Link>
                        <p className="text-xs text-dark-300 mt-0.5">{formatDate(post.published_at)}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
                  <h3 className="font-bold text-dark mb-2 text-sm">Consultanță gratuită</h3>
                  <p className="text-xs text-dark-300 mb-3">Ai întrebări despre aer condiționat? Specialiștii PRO TERM îți răspund gratuit.</p>
                  <Link href="/#contact" className="btn-primary py-2 text-sm justify-center">
                    Contactează-ne
                  </Link>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
