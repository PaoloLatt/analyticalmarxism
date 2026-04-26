import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, ctx: RouteContext) {
  const { id } = await ctx.params;
  const post = await prisma.post.findUnique({
    where: { id },
    include: { author: true, tags: true },
  });
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(req: NextRequest, ctx: RouteContext) {
  const { id } = await ctx.params;
  const body = await req.json();
  const { title, slug, excerpt, content, category, difficulty, published, featured, authorId, tagNames } = body;

  let tagsConnect;
  if (tagNames?.length) {
    const tags = await Promise.all(
      (tagNames as string[]).map(async (name: string) => {
        const tagSlug = name.toLowerCase().replace(/\s+/g, '-');
        return prisma.tag.upsert({
          where: { slug: tagSlug },
          create: { name, slug: tagSlug },
          update: {},
        });
      })
    );
    tagsConnect = { set: tags.map(t => ({ id: t.id })) };
  }

  const post = await prisma.post.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(slug !== undefined && { slug }),
      ...(excerpt !== undefined && { excerpt }),
      ...(content !== undefined && { content }),
      ...(category !== undefined && { category }),
      ...(difficulty !== undefined && { difficulty }),
      ...(published !== undefined && { published }),
      ...(featured !== undefined && { featured }),
      ...(authorId !== undefined && { authorId: authorId || null }),
      ...(tagsConnect && { tags: tagsConnect }),
    },
    include: { author: true, tags: true },
  });

  return NextResponse.json(post);
}

export async function DELETE(_req: NextRequest, ctx: RouteContext) {
  const { id } = await ctx.params;
  await prisma.post.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
