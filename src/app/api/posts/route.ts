import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const published = searchParams.get('published');
  const category = searchParams.get('category');

  const where: Record<string, unknown> = {};
  if (published !== null) where.published = published === 'true';
  if (category) where.category = category;

  const posts = await prisma.post.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { author: true, tags: true },
  });

  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, slug, excerpt, content, category, difficulty, published, featured, authorId, tagNames } = body;

  if (!title || !slug || !excerpt || !content || !category) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Connect or create tags
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

  const post = await prisma.post.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      category,
      difficulty: difficulty || 'introductory',
      published: published ?? false,
      featured: featured ?? false,
      authorId: authorId || null,
      tags: { connect: tags.map(t => ({ id: t.id })) },
    },
    include: { author: true, tags: true },
  });

  return NextResponse.json(post, { status: 201 });
}
