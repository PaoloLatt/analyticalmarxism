import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

interface RouteContext { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, ctx: RouteContext) {
  const { id } = await ctx.params;
  const { data, error } = await supabase.from('GlossaryTerm').select('*').eq('id', id).single();
  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest, ctx: RouteContext) {
  const { id } = await ctx.params;
  const body = await req.json();

  const updates: Record<string, unknown> = { updatedAt: new Date().toISOString() };
  if (body.term !== undefined) updates.term = body.term;
  if (body.definition !== undefined) updates.definition = body.definition;
  if (body.relatedTerms !== undefined) updates.relatedTerms = body.relatedTerms || null;

  const { data, error } = await supabase.from('GlossaryTerm').update(updates).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_req: NextRequest, ctx: RouteContext) {
  const { id } = await ctx.params;
  const { error } = await supabase.from('GlossaryTerm').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
