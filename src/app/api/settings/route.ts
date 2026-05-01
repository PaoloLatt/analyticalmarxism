import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

const DEFAULTS: Record<string, string> = {
  'social.twitter':   'https://twitter.com/placeholder',
  'social.facebook':  'https://facebook.com/placeholder',
  'social.linkedin':  'https://linkedin.com/placeholder',
  'social.instagram': 'https://instagram.com/placeholder',
  'social.youtube':   'https://youtube.com/placeholder',
  'site.tagline':     'Clarity about capitalism',
};

export async function GET() {
  const { data: rows } = await supabase.from('SiteSettings').select('key, value');
  const settings: Record<string, string> = { ...DEFAULTS };
  for (const row of rows ?? []) {
    settings[row.key as string] = row.value as string;
  }
  return NextResponse.json(settings);
}

export async function PUT(req: Request) {
  const body: Record<string, string> = await req.json();
  const now = new Date().toISOString();

  const { error } = await supabase
    .from('SiteSettings')
    .upsert(
      Object.entries(body).map(([key, value]) => ({ key, value, updatedAt: now })),
      { onConflict: 'key' }
    );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
