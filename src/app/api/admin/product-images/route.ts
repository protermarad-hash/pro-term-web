import { NextResponse } from 'next/server';
import { getSupabaseServiceClient, slugify } from '@/lib/supabase';
import { requireAdmin } from '@/lib/admin-auth';

const BUCKET = 'product-images';

function getMissingSupabaseEnv() {
  return [
    ['NEXT_PUBLIC_SUPABASE_URL', process.env.NEXT_PUBLIC_SUPABASE_URL],
    ['SUPABASE_SERVICE_ROLE_KEY', process.env.SUPABASE_SERVICE_ROLE_KEY],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name);
}

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const supabase = getSupabaseServiceClient();
  const missing = getMissingSupabaseEnv();

  if (!supabase) {
    return NextResponse.json(
      { error: `Supabase Storage nu este configurat. Lipsesc: ${missing.join(', ') || 'cheile server'}.` },
      { status: 500 },
    );
  }

  const formData = await request.formData();
  const files = formData.getAll('files').filter((item): item is File => item instanceof File);
  const productName = String(formData.get('productName') ?? 'produs');

  if (files.length === 0) {
    return NextResponse.json({ error: 'Nu ai selectat nicio imagine.' }, { status: 400 });
  }

  const urls: string[] = [];

  for (const file of files) {
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: `Fișierul ${file.name} nu este imagine.` }, { status: 400 });
    }

    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const safeName = slugify(file.name.replace(/\.[^/.]+$/, '')) || 'imagine';
    const folder = slugify(productName) || 'produse';
    const path = `${folder}/${Date.now()}-${safeName}.${extension}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    });

    if (error) {
      return NextResponse.json(
        { error: `Nu am putut încărca imaginea ${file.name}: ${error.message}` },
        { status: 500 },
      );
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    urls.push(data.publicUrl);
  }

  return NextResponse.json({ urls });
}
