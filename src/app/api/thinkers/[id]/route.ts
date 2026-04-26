import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, ctx: RouteContext) {
  const { id } = await ctx.params;
  const thinker = await prisma.thinker.findUnique({ where: { id } });
  if (!thinker) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(thinker);
}

export async function PUT(req: NextRequest, ctx: RouteContext) {
  const { id } = await ctx.params;
  const body = await req.json();

  const data: Record<string, unknown> = {};
  for (const key of ['name','slug','shortBio','fullBio','contribution','nationality','photoUrl'] as const) {
    if (body[key] !== undefined) data[key] = body[key];
  }
  if (body.birthYear !== undefined) data.birthYear = body.birthYear;
  if (body.deathYear !== undefined) data.deathYear = body.deathYear;
  if (body.published !== undefined) data.published = body.published;
  if (body.keyWorks !== undefined) {
    data.keyWorks = typeof body.keyWorks === 'string' ? body.keyWorks : JSON.stringify(body.keyWorks);
  }
  if (body.connections !== undefined) {
    data.connections = body.connections ? (typeof body.connections === 'string' ? body.connections : JSON.stringify(body.connections)) : null;
  }

  const thinker = await prisma.thinker.update({ where: { id }, data });
  return NextResponse.json(thinker);
}

export async function DELETE(_req: NextRequest, ctx: RouteContext) {
  const { id } = await ctx.params;
  await prisma.thinker.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
