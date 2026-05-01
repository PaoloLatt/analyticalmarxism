import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET() {
  const { data: accounts, error } = await supabase
    .from('SocialAccount')
    .select('*')
    .order('createdAt', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(accounts);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { platform, accountName, accessToken, enabled } = body;

  if (!platform || !accountName) {
    return NextResponse.json({ error: 'platform and accountName are required' }, { status: 400 });
  }

  const now = new Date().toISOString();
  const { data: account, error } = await supabase
    .from('SocialAccount')
    .insert({
      id: crypto.randomUUID(),
      platform,
      accountName,
      accessToken: accessToken ?? null,
      enabled: enabled ?? true,
      createdAt: now,
      updatedAt: now,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(account, { status: 201 });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

  const { error } = await supabase.from('SocialAccount').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
