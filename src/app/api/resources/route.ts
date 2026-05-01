import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET() {
  const { data, error } = await supabase
    .from('Resource')
    .select('*')
    .order('createdAt', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, description, url, type, difficulty } = body;

  if (!title || !type) {
    return NextResponse.json({ error: 'title and type are required' }, { status: 400 });
  }

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('Resource')
    .insert({
      id: crypto.randomUUID(),
      title,
      description: description || null,
      url: url || null,
      type,
      difficulty: difficulty || 'introductory',
      createdAt: now,
      updatedAt: now,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
