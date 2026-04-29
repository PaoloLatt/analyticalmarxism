import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const accounts = await prisma.socialAccount.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(accounts);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { platform, accountName, accessToken, enabled } = body;

  if (!platform || !accountName) {
    return NextResponse.json({ error: 'platform and accountName are required' }, { status: 400 });
  }

  const account = await prisma.socialAccount.create({
    data: {
      platform,
      accountName,
      // TODO: encrypt accessToken before storing in production
      accessToken: accessToken ?? null,
      enabled: enabled ?? true,
    },
  });

  return NextResponse.json(account, { status: 201 });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
  await prisma.socialAccount.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
