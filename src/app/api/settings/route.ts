import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const DEFAULTS: Record<string, string> = {
  'social.twitter':   'https://twitter.com/placeholder',
  'social.facebook':  'https://facebook.com/placeholder',
  'social.linkedin':  'https://linkedin.com/placeholder',
  'social.instagram': 'https://instagram.com/placeholder',
  'social.youtube':   'https://youtube.com/placeholder',
  'site.tagline':     'Clarity about capitalism',
};

export async function GET() {
  const rows = await prisma.siteSettings.findMany();
  const settings: Record<string, string> = { ...DEFAULTS };
  for (const { key, value } of rows) {
    settings[key] = value;
  }
  return NextResponse.json(settings);
}

export async function PUT(req: Request) {
  const body: Record<string, string> = await req.json();

  await Promise.all(
    Object.entries(body).map(([key, value]) =>
      prisma.siteSettings.upsert({
        where:  { key },
        update: { value },
        create: { key, value },
      })
    )
  );

  return NextResponse.json({ ok: true });
}
