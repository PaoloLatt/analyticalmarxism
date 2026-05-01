import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, ctx: RouteContext) {
  const { id } = await ctx.params;
  const { data: post, error } = await supabase
    .from('Post')
    .select('*, author:Thinker(name, slug)')
    .eq('id', id)
    .single();

  if (error || !post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(req: NextRequest, ctx: RouteContext) {
  const { id } = await ctx.params;
  const body = await req.json();
  const { title, slug, excerpt, content, category, difficulty, published, featured, authorId } = body;

  const updates: Record<string, unknown> = { updatedAt: new Date().toISOString() };
  if (title !== undefined) updates.title = title;
  if (slug !== undefined) updates.slug = slug;
  if (excerpt !== undefined) updates.excerpt = excerpt;
  if (content !== undefined) updates.content = content;
  if (category !== undefined) updates.category = category;
  if (difficulty !== undefined) updates.difficulty = difficulty;
  if (published !== undefined) updates.published = published;
  if (featured !== undefined) updates.featured = featured;
  if (authorId !== undefined) updates.authorId = authorId || null;

  const { data: post, error } = await supabase
    .from('Post')
    .update(updates)
    .eq('id', id)
    .select('*, author:Thinker(name, slug)')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(post);
}

export async function DELETE(_req: NextRequest, ctx: RouteContext) {
  const { id } = await ctx.params;
  const { error } = await supabase.from('Post').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
