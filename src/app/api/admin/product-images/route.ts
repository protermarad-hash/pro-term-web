import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server-auth';
import { slugify } from '@/lib/supabase';

const BUCKET = 'product-images';

export async function POST(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.ok) return admin.response;
  const supabase = admin.serviceClient;

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
        { error: 'Nu am putut încărca imaginea.' },
        { status: 500 },
      );
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    urls.push(data.publicUrl);
  }

  return NextResponse.json({ urls });
}
