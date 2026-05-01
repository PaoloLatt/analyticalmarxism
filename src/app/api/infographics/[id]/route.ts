import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

interface RouteContext { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, ctx: RouteContext) {
  const { id } = await ctx.params;
  const { data, error } = await supabase
    .from('Infographic')
    .select('*, thinker:Thinker(name, slug)')
    .eq('id', id)
    .single();
  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest, ctx: RouteContext) {
  const { id } = await ctx.params;
  const body = await req.json();

  const updates: Record<string, unknown> = { updatedAt: new Date().toISOString() };
  for (const k of ['title','slug','description','imageUrl','embedHtml','type','videoUrl']) {
    if (body[k] !== undefined) updates[k] = body[k] || null;
  }
  if (body.published !== undefined) updates.published = body.published;
  if (body.featured !== undefined) updates.featured = body.featured;
  if (body.thinkerId !== undefined) updates.thinkerId = body.thinkerId || null;

  const { data, error } = await supabase
    .from('Infographic')
    .update(updates)
    .eq('id', id)
    .select('*, thinker:Thinker(name, slug)')
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_req: NextRequest, ctx: RouteContext) {
  const { id } = await ctx.params;
  const { error } = await supabase.from('Infographic').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
