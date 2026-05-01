import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET() {
  const { data: posts, error } = await supabase
    .from('SocialPost')
    .select('*, account:SocialAccount(platform, accountName)')
    .order('createdAt', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { postId, platform, content, accountId } = body;

  if (!platform || !content) {
    return NextResponse.json({ error: 'platform and content are required' }, { status: 400 });
  }

  const now = new Date().toISOString();
  const { data: socialPost, error } = await supabase
    .from('SocialPost')
    .insert({
      id: crypto.randomUUID(),
      postId: postId ?? null,
      platform,
      content,
      accountId: accountId ?? null,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(socialPost, { status: 201 });
}

export async function PUT(req: Request) {
  const body = await req.json();
  const { id, action } = body;

  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

  if (action === 'publish') {
    const now = new Date().toISOString();
    const { data: updated, error } = await supabase
      .from('SocialPost')
      .update({ status: 'published', publishedAt: now, updatedAt: now })
      .eq('id', id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(updated);
  }

  if (action === 'delete') {
    const { error } = await supabase.from('SocialPost').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'unknown action' }, { status: 400 });
}
