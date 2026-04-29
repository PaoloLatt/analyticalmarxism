import Link from 'next/link';
import { prisma } from '@/lib/db';
import BlogCard from '@/components/BlogCard';
import ThinkerCard from '@/components/ThinkerCard';
import { ArrowRight, BookOpen, Users, BarChart3, FileText } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [posts, thinkers, infographics] = await Promise.all([
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
    prisma.infographic.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
  ]);

  return (
    <>
      {/* ═══ Compact Masthead ═══════════════════════════════════ */}
      <section className="bg-parchment border-b border-sand">
        <div className="max-w-wide mx-auto px-6 lg:px-8 py-8 lg:py-10">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">
            <div className="flex-1">
              <p className="text-[0.7rem] font-sans font-semibold uppercase tracking-[0.2em] text-burgundy-600 mb-2">
                An open educational project
              </p>
              <h1 className="font-serif text-[2rem] lg:text-[2.5rem] font-bold leading-tight tracking-tight text-charcoal mb-2.5">
                Analytical Marxism
              </h1>
              <p className="text-[0.9375rem] text-slate leading-relaxed max-w-lg">
                Exploring Marxist questions with the tools of analytic philosophy,
                game theory, and social science. Clarity, rigor, no jargon fog.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5 lg:flex-col lg:items-end lg:shrink-0">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-burgundy-600 hover:bg-burgundy-500 text-cream rounded text-small font-medium transition-colors"
              >
                Start Reading <ArrowRight size={14} />
              </Link>
              <Link
                href="/thinkers"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-sand hover:border-burgundy-300 text-slate hover:text-burgundy-600 rounded text-small font-medium transition-colors"
              >
                Meet the Thinkers
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Quick Nav ═══════════════════════════════════════════ */}
      <section className="border-b border-sand bg-white">
        <div className="max-w-wide mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-sand">
            {[
              { icon: BookOpen,  label: 'Blog & Commentary', sub: 'Explainers, commentary & readings', href: '/blog',              color: 'text-burgundy-600' },
              { icon: BarChart3, label: 'Visual Explainers',  sub: 'Diagrams, charts & videos',         href: '/visual-explainers', color: 'text-emerald-700' },
              { icon: Users,     label: 'Thinkers',           sub: 'September Group & beyond',          href: '/thinkers',          color: 'text-navy-600'    },
              { icon: FileText,  label: 'Articles & Essays',  sub: 'Long-form scholarship',             href: '/articles',          color: 'text-amber-700'   },
            ].map(({ icon: Icon, label, sub, href, color }) => (
              <Link
                key={href}
                href={href}
                className="flex items-start gap-3 px-4 py-4 hover:bg-parchment transition-colors group"
              >
                <Icon size={18} className={`${color} mt-0.5 shrink-0`} />
                <div>
                  <p className="text-[0.8125rem] font-medium text-charcoal group-hover:text-burgundy-600 transition-colors leading-tight">
                    {label}
                  </p>
                  <p className="text-[0.72rem] text-muted mt-0.5 leading-tight">{sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Latest Posts ════════════════════════════════════════ */}
      <section className="max-w-wide mx-auto px-6 lg:px-8 py-10 lg:py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[0.7rem] font-sans font-semibold uppercase tracking-widest text-burgundy-600 mb-1">
              Latest
            </p>
            <h2 className="font-serif text-[1.5rem] font-bold text-charcoal">
              Blog &amp; Commentary
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden sm:inline-flex items-center gap-1 text-small font-medium text-burgundy-600 hover:text-burgundy-500 transition-colors"
          >
            All posts <ArrowRight size={13} />
          </Link>
        </div>

        {posts.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 stagger">
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
          <div className="text-center py-12 text-muted border border-sand rounded-lg bg-parchment/50">
            <p className="text-small">
              No posts yet. Head to the{' '}
              <Link href="/admin" className="text-burgundy-600 underline">
                admin panel
              </Link>{' '}
              to create your first post.
            </p>
          </div>
        )}
      </section>

      {/* ═══ Thinkers ════════════════════════════════════════════ */}
      <section className="bg-parchment border-y border-sand">
        <div className="max-w-wide mx-auto px-6 lg:px-8 py-10 lg:py-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[0.7rem] font-sans font-semibold uppercase tracking-widest text-burgundy-600 mb-1">
                The September Group &amp; beyond
              </p>
              <h2 className="font-serif text-[1.5rem] font-bold text-charcoal">
                Key Thinkers
              </h2>
            </div>
            <Link
              href="/thinkers"
              className="hidden sm:inline-flex items-center gap-1 text-small font-medium text-burgundy-600 hover:text-burgundy-500 transition-colors"
            >
              All thinkers <ArrowRight size={13} />
            </Link>
          </div>

          {thinkers.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger">
              {thinkers.map((t) => (
                <ThinkerCard key={t.id} {...t} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted">
              <p className="text-small">
                No thinkers yet. Add them via the{' '}
                <Link href="/admin" className="text-burgundy-600 underline">
                  admin panel
                </Link>
                .
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ═══ Visual Explainers ═══════════════════════════════════ */}
      {infographics.length > 0 && (
        <section className="max-w-wide mx-auto px-6 lg:px-8 py-10 lg:py-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[0.7rem] font-sans font-semibold uppercase tracking-widest text-burgundy-600 mb-1">
                See it clearly
              </p>
              <h2 className="font-serif text-[1.5rem] font-bold text-charcoal">
                Visual Explainers
              </h2>
            </div>
            <Link
              href="/visual-explainers"
              className="hidden sm:inline-flex items-center gap-1 text-small font-medium text-burgundy-600 hover:text-burgundy-500 transition-colors"
            >
              Browse all <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3 stagger">
            {infographics.map((ig) => (
              <Link
                key={ig.id}
                href={`/visual-explainers#${ig.slug}`}
                className="group block bg-white border border-sand/60 rounded overflow-hidden card-lift"
              >
                <div className="aspect-video bg-parchment flex items-center justify-center">
                  <BarChart3 size={28} className="text-sand" />
                </div>
                <div className="p-4">
                  <span className="badge badge-explainer mb-2">{ig.type}</span>
                  <h3 className="font-serif text-[0.9375rem] font-semibold text-charcoal group-hover:text-burgundy-600 transition-colors leading-snug">
                    {ig.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
