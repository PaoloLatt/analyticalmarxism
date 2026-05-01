import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, ctx: RouteContext) {
  const { id } = await ctx.params;
  const { data: thinker, error } = await supabase
    .from('Thinker')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !thinker) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(thinker);
}

export async function PUT(req: NextRequest, ctx: RouteContext) {
  const { id } = await ctx.params;
  const body = await req.json();

  const updates: Record<string, unknown> = { updatedAt: new Date().toISOString() };
  for (const key of ['name','slug','shortBio','fullBio','contribution','nationality','photoUrl']) {
    if (body[key] !== undefined) updates[key] = body[key];
  }
  if (body.birthYear !== undefined) updates.birthYear = body.birthYear;
  if (body.deathYear !== undefined) updates.deathYear = body.deathYear;
  if (body.published !== undefined) updates.published = body.published;
  if (body.keyWorks !== undefined) {
    updates.keyWorks = typeof body.keyWorks === 'string' ? body.keyWorks : JSON.stringify(body.keyWorks);
  }
  if (body.connections !== undefined) {
    updates.connections = body.connections
      ? (typeof body.connections === 'string' ? body.connections : JSON.stringify(body.connections))
      : null;
  }

  const { data: thinker, error } = await supabase
    .from('Thinker')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(thinker);
}

export async function DELETE(_req: NextRequest, ctx: RouteContext) {
  const { id } = await ctx.params;
  const { error } = await supabase.from('Thinker').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
