import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const published = searchParams.get('published');
  const category = searchParams.get('category');

  let query = supabase
    .from('Post')
    .select('*, author:Thinker(name, slug)')
    .order('createdAt', { ascending: false });

  if (published !== null) query = query.eq('published', published === 'true');
  if (category) query = query.eq('category', category);

  const { data: posts, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, slug, excerpt, content, category, difficulty, published, featured, authorId } = body;

  if (!title || !slug || !excerpt || !content || !category) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const now = new Date().toISOString();
  const { data: post, error } = await supabase
    .from('Post')
    .insert({
      id: crypto.randomUUID(),
      title, slug, excerpt, content, category,
      difficulty: difficulty || 'introductory',
      published: published ?? false,
      featured: featured ?? false,
      authorId: authorId || null,
      createdAt: now,
      updatedAt: now,
    })
    .select('*, author:Thinker(name, slug)')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(post, { status: 201 });
}
