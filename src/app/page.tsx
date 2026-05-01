import Link from 'next/link';
import { prisma } from '@/lib/db';
import BlogCard from '@/components/BlogCard';
import ThinkerCard from '@/components/ThinkerCard';
import { ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [posts, thinkers] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 6,
      include: { author: true },
    }),
    prisma.thinker.findMany({
      where: { published: true },
      orderBy: { name: 'asc' },
      take: 6,
    }),
  ]);

  return (
    <div className="max-w-wide mx-auto px-6 lg:px-8 py-10 lg:py-12 space-y-14">

      {/* ── Latest posts ── */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="w-6 h-[2px] bg-[#E24B4A] mb-3" />
            <h2 className="text-[1.25rem] font-medium text-zinc-900">Latest</h2>
          </div>
          <Link
            href="/blog"
            className="hidden sm:inline-flex items-center gap-1 text-[0.78rem] text-zinc-400 hover:text-zinc-900 transition-colors"
          >
            All posts <ArrowRight size={12} />
          </Link>
        </div>

        {posts.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard
                key={post.id}
                slug={post.slug}
                title={post.title}
                excerpt={post.excerpt}
                category={post.category}
                difficulty={post.difficulty}
                createdAt={post.createdAt}
                authorName={post.author?.name}
                featured={post.featured}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-zinc-400 border border-zinc-100 rounded bg-zinc-50">
            <p className="text-[0.8125rem]">
              No posts yet.{' '}
              <Link href="/admin" className="text-[#E24B4A] underline">
                Create your first post
              </Link>
              .
            </p>
          </div>
        )}
      </section>

      {/* ── Thinkers ── */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="w-6 h-[2px] bg-[#E24B4A] mb-3" />
            <h2 className="text-[1.25rem] font-medium text-zinc-900">Thinkers</h2>
          </div>
          <Link
            href="/thinkers"
            className="hidden sm:inline-flex items-center gap-1 text-[0.78rem] text-zinc-400 hover:text-zinc-900 transition-colors"
          >
            All thinkers <ArrowRight size={12} />
          </Link>
        </div>

        {thinkers.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {thinkers.map((t) => (
              <ThinkerCard key={t.id} {...t} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-zinc-400 border border-zinc-100 rounded bg-zinc-50">
            <p className="text-[0.8125rem]">
              No thinkers yet.{' '}
              <Link href="/admin" className="text-[#E24B4A] underline">
                Add via admin panel
              </Link>
              .
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
