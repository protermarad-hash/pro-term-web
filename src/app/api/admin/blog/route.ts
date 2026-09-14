import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server-auth';

export async function GET(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.ok) return admin.response;
  const supabase = admin.serviceClient;

  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, slug, title, category, published, published_at, excerpt, content, image_url, meta_title, meta_description, tags, read_time')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: 'Nu am putut încărca articolele.' }, { status: 500 });
  }

  return NextResponse.json({ posts: data ?? [] });
}

export async function POST(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.ok) return admin.response;
  const supabase = admin.serviceClient;

  const body = await request.json();
  const { data, error } = await supabase
    .from('blog_posts')
    .insert({
      slug: body.slug,
      title: body.title,
      excerpt: body.excerpt || null,
      content: body.content || null,
      category: body.category || null,
      image_url: body.imageUrl || null,
      meta_title: body.metaTitle || null,
      meta_description: body.metaDescription || null,
      tags: body.tags ?? [],
      read_time: body.read_time ?? 5,
      published: body.published ?? false,
      published_at: body.published ? new Date().toISOString() : null,
    })
    .select('id')
    .single();

  if (error) return NextResponse.json({ error: 'Articolul nu a putut fi salvat.' }, { status: 500 });
  return NextResponse.json({ post: data });
}

export async function PUT(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.ok) return admin.response;
  const supabase = admin.serviceClient;

  const body = await request.json();
  if (!body.id) return NextResponse.json({ error: 'ID lipsă' }, { status: 400 });

  const { data, error } = await supabase
    .from('blog_posts')
    .update({
      slug: body.slug,
      title: body.title,
      excerpt: body.excerpt || null,
      content: body.content || null,
      category: body.category || null,
      image_url: body.imageUrl || null,
      meta_title: body.metaTitle || null,
      meta_description: body.metaDescription || null,
      tags: body.tags ?? [],
      read_time: body.read_time ?? 5,
      published: body.published ?? false,
      published_at: body.published ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', body.id)
    .select('id')
    .single();

  if (error) return NextResponse.json({ error: 'Articolul nu a putut fi actualizat.' }, { status: 500 });
  return NextResponse.json({ post: data });
}

export async function DELETE(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.ok) return admin.response;
  const supabase = admin.serviceClient;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID lipsă' }, { status: 400 });

  const { error } = await supabase.from('blog_posts').delete().eq('id', id);
  if (error) return NextResponse.json({ error: 'Articolul nu a putut fi șters.' }, { status: 500 });
  return NextResponse.json({ deleted: true });
}
