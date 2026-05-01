import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET() {
  const { data: thinkers, error } = await supabase
    .from('Thinker')
    .select('*')
    .order('name');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(thinkers);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    name, slug, birthYear, deathYear, nationality, photoUrl,
    shortBio, fullBio, contribution, keyWorks, connections, published,
  } = body;

  if (!name || !slug || !shortBio || !fullBio || !contribution) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const now = new Date().toISOString();
  const { data: thinker, error } = await supabase
    .from('Thinker')
    .insert({
      id: crypto.randomUUID(),
      name, slug,
      birthYear: birthYear ?? null,
      deathYear: deathYear ?? null,
      nationality: nationality ?? null,
      photoUrl: photoUrl ?? null,
      shortBio, fullBio, contribution,
      keyWorks: typeof keyWorks === 'string' ? keyWorks : JSON.stringify(keyWorks ?? []),
      connections: connections ? (typeof connections === 'string' ? connections : JSON.stringify(connections)) : null,
      published: published ?? true,
      createdAt: now,
      updatedAt: now,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(thinker, { status: 201 });
}
