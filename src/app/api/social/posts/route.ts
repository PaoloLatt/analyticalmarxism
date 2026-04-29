import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const posts = await prisma.socialPost.findMany({
    orderBy: { createdAt: 'desc' },
    include: { account: true },
  });
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { postId, platform, content, accountId } = body;

  if (!platform || !content) {
    return NextResponse.json({ error: 'platform and content are required' }, { status: 400 });
  }

  const socialPost = await prisma.socialPost.create({
    data: {
      postId:    postId    ?? null,
      platform,
      content,
      accountId: accountId ?? null,
      status:    'draft',
    },
  });

  return NextResponse.json(socialPost, { status: 201 });
}

export async function PUT(req: Request) {
  const body = await req.json();
  const { id, action } = body;

  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

  if (action === 'publish') {
    // TODO: call the relevant platform API here
    // e.g. for Twitter: await twitterClient.v2.tweet(post.content)
    // e.g. for LinkedIn: await linkedinClient.postShare(...)
    const updated = await prisma.socialPost.update({
      where: { id },
      data: {
        status:      'published',
        publishedAt: new Date(),
        // externalId: result.id  // set this from the platform API response
      },
    });
    return NextResponse.json(updated);
  }

  if (action === 'delete') {
    await prisma.socialPost.delete({ where: { id } });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'unknown action' }, { status: 400 });
}
