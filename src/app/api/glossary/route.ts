import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET() {
  const { data, error } = await supabase
    .from('GlossaryTerm')
    .select('*')
    .order('term');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { term, definition, relatedTerms } = body;

  if (!term || !definition) {
    return NextResponse.json({ error: 'term and definition are required' }, { status: 400 });
  }

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('GlossaryTerm')
    .insert({
      id: crypto.randomUUID(),
      term, definition,
      relatedTerms: relatedTerms || null,
      createdAt: now,
      updatedAt: now,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
