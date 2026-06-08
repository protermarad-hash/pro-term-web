import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, Clock, Phone, Tag } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getSupabaseServiceClient } from '@/lib/supabase';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  image_url: string | null;
  category: string | null;
  author: string;
  read_time: number | null;
  published_at: string | null;
  updated_at: string;
  meta_title: string | null;
  meta_description: string | null;
  tags: string[] | null;
}

type RelatedPost = Pick<BlogPost, 'id' | 'slug' | 'title' | 'excerpt' | 'image_url' | 'category' | 'read_time' | 'published_at'>;

async function getPost(slug: string): Promise<BlogPost | null> {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();

  return data ?? null;
}

async function getRelated(post: BlogPost): Promise<RelatedPost[]> {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from('blog_posts')
    .select('id, slug, title, excerpt, image_url, category, read_time, published_at')
    .eq('published', true)
    .eq('category', post.category ?? '')
    .neq('slug', post.slug)
    .limit(3);

  return (data ?? []) as RelatedPost[];
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: 'Articol negăsit' };

  return {
    title: post.meta_title ?? `${post.title} | PRO TERM Blog`,
    description: post.meta_description ?? post.excerpt ?? '',
    alternates: { canonical: `https://pro-term.ro/blog/${post.slug}` },
    openGraph: {
      title: post.meta_title ?? post.title,
      description: post.meta_description ?? post.excerpt ?? '',
      url: `https://pro-term.ro/blog/${post.slug}`,
      images: post.image_url ? [{ url: post.image_url }] : [],
      type: 'article',
      publishedTime: post.published_at ?? undefined,
    },
  };
}

function formatDate(iso: string | null) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' });
}

function renderMarkdown(content: string): string {
  let html = content;
  html = html.replace(/^## (.+)$/gm, '<h2 class="mt-8 mb-3 font-heading text-2xl font-bold text-dark">$1</h2>');
  html = html.replace(/^### (.+)$/gm, '<h3 class="mt-6 mb-2 font-heading text-xl font-bold text-dark">$1</h3>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/`(.+?)`/g, '<code class="rounded bg-gray-100 px-1 font-mono text-sm text-dark">$1</code>');
  html = html.replace(/^\| (.+) \|$/gm, (match) => {
    const cells = match.slice(2, -2).split(' | ');
    return '<tr>' + cells.map((c) => `<td class="border border-gray-200 px-3 py-2 text-sm">${c}</td>`).join('') + '</tr>';
  });
  html = html.replace(/^\|- .+$/gm, ''); // remove separator rows
  html = html.replace(/^\- (.+)$/gm, '<li class="ml-4 list-disc text-dark-300">$1</li>');
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal text-dark-300">$1</li>');
  html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="font-semibold text-primary hover:underline">$1</a>');
  html = html.replace(/\n\n/g, '</p><p class="mb-4 text-dark-300 leading-relaxed">');
  return html;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  const related: RelatedPost[] = await getRelated(post);

  const schemaArticle = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt ?? '',
    author: { '@type': 'Organization', name: post.author },
    publisher: { '@type': 'Organization', name: 'PRO TERM SRL', url: 'https://pro-term.ro' },
    datePublished: post.published_at ?? post.updated_at,
    dateModified: post.updated_at,
    url: `https://pro-term.ro/blog/${post.slug}`,
    image: post.image_url ?? 'https://pro-term.ro/og-image.jpg',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaArticle) }}
      />
      <Header />
      <main className="bg-light-200 pb-20 pt-24">
        <div className="container mx-auto max-w-4xl px-4">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-1.5 text-sm text-dark-300">
            <Link href="/" className="hover:text-primary">Acasă</Link>
            <span>›</span>
            <Link href="/blog" className="hover:text-primary">Blog</Link>
            <span>›</span>
            <span className="text-dark font-medium truncate max-w-xs">{post.title}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-4">
            {/* Article */}
            <article className="lg:col-span-3">
              {post.category && (
                <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">
                  {post.category}
                </span>
              )}

              <h1 className="mb-4 font-heading text-3xl font-bold text-dark md:text-4xl leading-tight">
                {post.title}
              </h1>

              <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-dark-300">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  {formatDate(post.published_at)}
                </span>
                {post.read_time && (
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} />
                    {post.read_time} min citire
                  </span>
                )}
                <span className="font-semibold text-dark">{post.author}</span>
              </div>

              {post.image_url && (
                <div className="relative mb-8 h-64 w-full overflow-hidden rounded-2xl md:h-80">
                  <Image
                    src={post.image_url}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                    unoptimized
                  />
                </div>
              )}

              {/* Content */}
              <div
                className="prose-custom card"
                dangerouslySetInnerHTML={{ __html: post.content ? renderMarkdown(post.content) : post.excerpt ?? '' }}
              />

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-6 flex flex-wrap items-center gap-2">
                  <Tag size={14} className="text-dark-300" />
                  {post.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-dark-300">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* CTA */}
              <div className="mt-8 flex items-center gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-5">
                <Phone size={24} className="flex-shrink-0 text-primary" />
                <div className="flex-1">
                  <p className="font-bold text-dark">Solicită ofertă gratuită</p>
                  <p className="text-sm text-dark-300">Specialiștii PRO TERM îți stau la dispoziție pentru orice întrebare.</p>
                </div>
                <Link href="/contact" className="btn-primary py-2 text-sm whitespace-nowrap">
                  Contactează-ne
                </Link>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="space-y-5">
              <Link href="/blog" className="flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                <ArrowLeft size={14} />
                Înapoi la blog
              </Link>

              <div className="card">
                <h3 className="mb-3 font-heading text-base font-bold text-dark">Servicii rapide</h3>
                <ul className="space-y-2 text-sm">
                  {[
                    { label: 'Montaj aer condiționat', href: '/servicii/montaj-aer-conditionat-arad' },
                    { label: 'Service & revizie', href: '/servicii/service-aer-conditionat-arad' },
                    { label: 'Calculator BTU', href: '/calculator-btu' },
                    { label: 'Catalog produse', href: '/produse' },
                  ].map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="text-dark-300 hover:text-primary hover:underline">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>

          {/* Related articles */}
          {related.length > 0 && (
            <section className="mt-16">
              <h2 className="mb-6 font-heading text-2xl font-bold text-dark">Articole similare</h2>
              <div className="grid gap-5 sm:grid-cols-3">
                {related.map((rel) => (
                  <article key={rel.id} className="card group p-0 overflow-hidden">
                    {rel.image_url ? (
                      <div className="relative h-36 overflow-hidden">
                        <Image src={rel.image_url} alt={rel.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" unoptimized />
                      </div>
                    ) : (
                      <div className="flex h-28 items-center justify-center bg-gradient-to-br from-primary/10 to-blue-100">
                        <span className="text-3xl">❄️</span>
                      </div>
                    )}
                    <div className="p-4">
                      <Link href={`/blog/${rel.slug}`} className="font-heading text-sm font-bold text-dark hover:text-primary leading-snug">
                        {rel.title}
                      </Link>
                      {rel.read_time && (
                        <p className="mt-1 text-xs text-dark-300 flex items-center gap-1">
                          <Clock size={11} />
                          {rel.read_time} min
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
