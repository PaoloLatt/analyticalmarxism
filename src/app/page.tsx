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
    <>
      {/* ── Teaser / Masthead ── */}
      <section className="bg-white" style={{ borderBottom: '0.5px solid #E4E4E7' }}>
        <div className="max-w-wide mx-auto px-6 lg:px-8 py-10 lg:py-12">
          <div className="flex flex-col lg:flex-row lg:items-end gap-8 lg:gap-16">
            <div className="flex-1">
              <div className="w-8 h-[2px] bg-[#E24B4A] mb-5" />
              <h1
                className="text-[1.875rem] font-medium text-zinc-900 mb-3 leading-tight"
                style={{ letterSpacing: '-0.02em' }}
              >
                Analytical Marxism
              </h1>
              <p className="text-[0.9375rem] text-zinc-500 leading-relaxed max-w-lg">
                Exploring Marxist questions with the tools of analytic philosophy,
                game theory, and social science. Clarity, rigour, no jargon fog.
              </p>
            </div>
            <div className="flex gap-3 lg:shrink-0">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#E24B4A] hover:bg-[#C73B3A] text-white text-[0.8125rem] font-medium rounded transition-colors"
              >
                Start Reading <ArrowRight size={13} />
              </Link>
              <Link
                href="/thinkers"
                className="inline-flex items-center gap-2 px-4 py-2 border border-zinc-200 hover:border-zinc-400 text-zinc-600 hover:text-zinc-900 text-[0.8125rem] font-medium rounded transition-colors"
              >
                The Thinkers
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-wide mx-auto px-6 lg:px-8 py-10 lg:py-12 space-y-14">

        {/* ── Latest posts ── */}
        <section>
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="w-6 h-[2px] bg-[#E24B4A] mb-3" />
              <h2 className="text-[1.125rem] font-medium text-zinc-900">Latest</h2>
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
              <h2 className="text-[1.125rem] font-medium text-zinc-900">Key Thinkers</h2>
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
    </>
  );
}
