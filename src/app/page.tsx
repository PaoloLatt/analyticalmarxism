import Link from 'next/link';
import { supabase } from '@/lib/db';
import HomeTabs from '@/components/HomeTabs';
import { ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [{ data: posts }, { data: articles }, { data: thinkers }, { data: visuals }] = await Promise.all([
    supabase
      .from('Post')
      .select('id, slug, title, excerpt, category, difficulty, createdAt, featured, author:Thinker(name, slug)')
      .eq('published', true)
      .order('createdAt', { ascending: false })
      .limit(6),
    supabase
      .from('Article')
      .select('id, slug, title, subtitle, author, excerpt')
      .eq('published', true)
      .order('createdAt', { ascending: false })
      .limit(6),
    supabase
      .from('Thinker')
      .select('id, slug, name, shortBio, nationality, birthYear, deathYear, photoUrl')
      .eq('published', true)
      .order('name')
      .limit(6),
    supabase
      .from('Infographic')
      .select('id, slug, title, description, imageUrl, type')
      .eq('published', true)
      .order('createdAt', { ascending: false })
      .limit(6),
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

      {/* ── Tabbed content ── */}
      <div className="max-w-wide mx-auto px-6 lg:px-8 py-10 lg:py-12">
        <div className="mb-7">
          <div className="w-6 h-[2px] bg-[#E24B4A] mb-3" />
          <h2 className="text-[1.125rem] font-medium text-zinc-900">Explore</h2>
        </div>
        <HomeTabs
          posts={posts ?? []}
          articles={articles ?? []}
          thinkers={thinkers ?? []}
          visuals={visuals ?? []}
        />
      </div>
    </>
  );
}
