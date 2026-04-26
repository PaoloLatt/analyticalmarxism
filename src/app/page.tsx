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
      take: 4,
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
      {/* ═══ Hero ═══════════════════════════════════════════ */}
      <section className="relative bg-charcoal text-cream overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative max-w-wide mx-auto px-6 lg:px-10 py-22 lg:py-30">
          <p className="text-caption font-sans font-semibold uppercase tracking-[0.2em] text-burgundy-400 mb-6 fade-in">
            An open educational project
          </p>
          <h1 className="font-serif text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.08] tracking-tight max-w-3xl mb-8 fade-in" style={{ animationDelay: '0.1s' }}>
            Analytical Marxism
          </h1>
          <p className="text-[1.2rem] leading-relaxed text-sand max-w-2xl mb-10 fade-in" style={{ animationDelay: '0.2s' }}>
            Exploring Marxist questions with the tools of analytic philosophy,
            game theory, and social science. From the September Group to
            contemporary debates — with clarity, rigor, and no fog.
          </p>
          <div className="flex flex-wrap gap-4 fade-in" style={{ animationDelay: '0.3s' }}>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-burgundy-600 hover:bg-burgundy-500 text-cream rounded font-sans font-medium transition-colors"
            >
              Start Reading <ArrowRight size={16} />
            </Link>
            <Link
              href="/thinkers"
              className="inline-flex items-center gap-2 px-6 py-3 border border-sand/30 hover:border-sand/60 text-sand hover:text-cream rounded font-sans font-medium transition-colors"
            >
              Meet the Thinkers
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ Quick Nav Cards ════════════════════════════════ */}
      <section className="max-w-wide mx-auto px-6 lg:px-10 -mt-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: BookOpen,  label: 'Blog & Commentary', href: '/blog',              color: 'text-burgundy-600' },
            { icon: BarChart3, label: 'Visual Explainers',  href: '/visual-explainers', color: 'text-emerald-700' },
            { icon: Users,     label: 'Thinkers',           href: '/thinkers',          color: 'text-navy-600' },
            { icon: FileText,  label: 'Articles & Essays',  href: '/articles',          color: 'text-amber-700' },
          ].map(({ icon: Icon, label, href, color }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 bg-white border border-sand/60 rounded-lg p-4 card-lift"
            >
              <Icon size={20} className={color} />
              <span className="font-sans font-medium text-small text-charcoal">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ Latest Posts ═══════════════════════════════════ */}
      <section className="max-w-wide mx-auto px-6 lg:px-10 py-18 lg:py-22">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-caption font-sans font-semibold uppercase tracking-widest text-burgundy-600 mb-2">
              Latest
            </p>
            <h2 className="font-serif text-headline font-bold text-charcoal">
              Blog &amp; Commentary
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden sm:inline-flex items-center gap-1 text-small font-medium text-burgundy-600 hover:text-burgundy-500 transition-colors"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {posts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 stagger">
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
          <div className="text-center py-16 text-muted">
            <p className="text-body">No posts yet. Head to the <Link href="/admin" className="text-burgundy-600 underline">admin panel</Link> to create your first post.</p>
          </div>
        )}
      </section>

      {/* ═══ Thinkers ══════════════════════════════════════ */}
      <section className="bg-parchment">
        <div className="max-w-wide mx-auto px-6 lg:px-10 py-18 lg:py-22">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-caption font-sans font-semibold uppercase tracking-widest text-burgundy-600 mb-2">
                The September Group &amp; beyond
              </p>
              <h2 className="font-serif text-headline font-bold text-charcoal">
                Key Thinkers
              </h2>
            </div>
            <Link
              href="/thinkers"
              className="hidden sm:inline-flex items-center gap-1 text-small font-medium text-burgundy-600 hover:text-burgundy-500 transition-colors"
            >
              All thinkers <ArrowRight size={14} />
            </Link>
          </div>

          {thinkers.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 stagger">
              {thinkers.map((t) => (
                <ThinkerCard key={t.id} {...t} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted">
              <p className="text-body">No thinkers yet. Add them via the <Link href="/admin" className="text-burgundy-600 underline">admin panel</Link>.</p>
            </div>
          )}
        </div>
      </section>

      {/* ═══ Visual Explainers Preview ═════════════════════ */}
      <section className="max-w-wide mx-auto px-6 lg:px-10 py-18 lg:py-22">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-caption font-sans font-semibold uppercase tracking-widest text-burgundy-600 mb-2">
              See it clearly
            </p>
            <h2 className="font-serif text-headline font-bold text-charcoal">
              Visual Explainers
            </h2>
          </div>
          <Link
            href="/visual-explainers"
            className="hidden sm:inline-flex items-center gap-1 text-small font-medium text-burgundy-600 hover:text-burgundy-500 transition-colors"
          >
            Browse all <ArrowRight size={14} />
          </Link>
        </div>

        {infographics.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-3 stagger">
            {infographics.map((ig) => (
              <Link
                key={ig.id}
                href={`/visual-explainers#${ig.slug}`}
                className="group block bg-white border border-sand/60 rounded-lg overflow-hidden card-lift"
              >
                <div className="aspect-video bg-parchment flex items-center justify-center">
                  <BarChart3 size={32} className="text-sand" />
                </div>
                <div className="p-5">
                  <span className="badge badge-explainer mb-2">{ig.type}</span>
                  <h3 className="font-serif text-body font-semibold text-charcoal group-hover:text-burgundy-600 transition-colors">
                    {ig.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted">
            <p className="text-body">No visual explainers yet.</p>
          </div>
        )}
      </section>

      {/* ═══ CTA ═══════════════════════════════════════════ */}
      <section className="bg-burgundy-600 text-cream">
        <div className="max-w-wide mx-auto px-6 lg:px-10 py-16 lg:py-20 text-center">
          <h2 className="font-serif text-headline font-bold mb-4">
            Start exploring
          </h2>
          <p className="text-body text-burgundy-100 max-w-article mx-auto mb-8">
            Analytical Marxism brought unprecedented clarity to questions about
            exploitation, class, history, and justice. Dive in — no jargon fog required.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-8 py-3 bg-cream text-burgundy-700 hover:bg-white rounded font-sans font-semibold transition-colors"
          >
            Read the Blog <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
