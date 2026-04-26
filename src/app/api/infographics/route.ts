import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const items = await prisma.infographic.findMany({
    orderBy: { createdAt: 'desc' },
    include: { thinker: true, tags: true },
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, slug, description, imageUrl, embedHtml, type, videoUrl, published, featured, thinkerId, tagNames } = body;

  if (!title || !slug || !description || !type) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const tags = tagNames?.length
    ? await Promise.all(
        (tagNames as string[]).map(async (name: string) => {
          const tagSlug = name.toLowerCase().replace(/\s+/g, '-');
          return prisma.tag.upsert({
            where: { slug: tagSlug },
            create: { name, slug: tagSlug },
            update: {},
          });
        })
      )
    : [];

  const item = await prisma.infographic.create({
    data: {
      title, slug, description,
      imageUrl: imageUrl ?? null,
      embedHtml: embedHtml ?? null,
      type,
      videoUrl: videoUrl ?? null,
      published: published ?? false,
      featured: featured ?? false,
      thinkerId: thinkerId ?? null,
      tags: { connect: tags.map(t => ({ id: t.id })) },
    },
    include: { thinker: true, tags: true },
  });

  return NextResponse.json(item, { status: 201 });
}
