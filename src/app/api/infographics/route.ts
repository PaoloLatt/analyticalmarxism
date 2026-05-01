import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET() {
  const { data: items, error } = await supabase
    .from('Infographic')
    .select('*, thinker:Thinker(name, slug)')
    .order('createdAt', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, slug, description, imageUrl, embedHtml, type, videoUrl, published, featured, thinkerId } = body;

  if (!title || !slug || !description || !type) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const now = new Date().toISOString();
  const { data: item, error } = await supabase
    .from('Infographic')
    .insert({
      id: crypto.randomUUID(),
      title, slug, description,
      imageUrl: imageUrl ?? null,
      embedHtml: embedHtml ?? null,
      type,
      videoUrl: videoUrl ?? null,
      published: published ?? false,
      featured: featured ?? false,
      thinkerId: thinkerId ?? null,
      createdAt: now,
      updatedAt: now,
    })
    .select('*, thinker:Thinker(name, slug)')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(item, { status: 201 });
}
