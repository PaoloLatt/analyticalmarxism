import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const thinkers = await prisma.thinker.findMany({
    orderBy: { name: 'asc' },
    include: { posts: { select: { id: true, title: true, slug: true } } },
  });
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

  const thinker = await prisma.thinker.create({
    data: {
      name,
      slug,
      birthYear: birthYear ?? null,
      deathYear: deathYear ?? null,
      nationality: nationality ?? null,
      photoUrl: photoUrl ?? null,
      shortBio,
      fullBio,
      contribution,
      keyWorks: typeof keyWorks === 'string' ? keyWorks : JSON.stringify(keyWorks ?? []),
      connections: connections ? (typeof connections === 'string' ? connections : JSON.stringify(connections)) : null,
      published: published ?? true,
    },
  });

  return NextResponse.json(thinker, { status: 201 });
}
