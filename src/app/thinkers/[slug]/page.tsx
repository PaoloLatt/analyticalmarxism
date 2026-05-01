import { supabase } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import BlogCard from '@/components/BlogCard';
import TrackPageView from '@/components/TrackPageView';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: thinker } = await supabase
    .from('Thinker')
    .select('name, shortBio')
    .eq('slug', slug)
    .single();
  if (!thinker) return { title: 'Thinker Not Found' };
  return { title: thinker.name, description: thinker.shortBio };
}

interface KeyWork {
  title: string;
  year: number;
  description: string;
}

export default async function ThinkerPage({ params }: Props) {
  const { slug } = await params;
  const { data: thinker } = await supabase
    .from('Thinker')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!thinker || !thinker.published) notFound();

  const { data: relatedPosts } = await supabase
    .from('Post')
    .select('id, slug, title, excerpt, category, difficulty, createdAt')
    .eq('authorId', thinker.id)
    .eq('published', true)
    .order('createdAt', { ascending: false })
    .limit(4);

  const lifespan = thinker.birthYear
    ? `${thinker.birthYear}–${thinker.deathYear ?? 'present'}`
    : null;

  let keyWorks: KeyWork[] = [];
  try { keyWorks = JSON.parse(thinker.keyWorks); } catch {}

  return (
    <div className="max-w-wide mx-auto px-6 lg:px-8 py-8 lg:py-10">
      <TrackPageView
        eventName="thinker_viewed"
        params={{ thinker_slug: thinker.slug, thinker_name: thinker.name }}
      />

      <div className="grid lg:grid-cols-[220px_1fr] gap-10 lg:gap-14">
        {/* Sidebar */}
        <aside>
          <div className="aspect-square bg-zinc-100 rounded flex items-center justify-center overflow-hidden mb-5">
            {thinker.photoUrl ? (
              <img src={thinker.photoUrl} alt={thinker.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-[2.5rem] font-medium text-zinc-300">
                {thinker.name.split(' ').map((w: string) => w[0]).join('')}
              </span>
            )}
          </div>

          <div className="space-y-2.5 text-[0.8125rem] text-zinc-600">
            {thinker.nationality && (
              <div>
                <span className="font-medium text-zinc-900">Nationality:</span>{' '}
                {thinker.nationality}
              </div>
            )}
            {lifespan && (
              <div>
                <span className="font-medium text-zinc-900">Life:</span>{' '}
                {lifespan}
              </div>
            )}
          </div>
        </aside>

        {/* Main content */}
        <div>
          <h1 className="text-[1.75rem] font-medium text-zinc-900 mb-2" style={{ letterSpacing: '-0.015em' }}>
            {thinker.name}
          </h1>
          <p className="text-[0.9375rem] text-zinc-500 mb-7">{thinker.shortBio}</p>

          {/* Contribution */}
          <div className="bg-[#FAFAFA] border border-[#E4E4E7] rounded p-5 lg:p-6 mb-8">
            <h2 className="text-[0.8125rem] font-medium uppercase tracking-wider text-zinc-400 mb-2.5">
              Key Contribution
            </h2>
            <p className="text-[0.9375rem] text-zinc-700 leading-relaxed">
              {thinker.contribution}
            </p>
          </div>

          {/* Full bio */}
          <div className="prose prose-base max-w-none mb-10">
            <ReactMarkdown>{thinker.fullBio}</ReactMarkdown>
          </div>

          {/* Key Works */}
          {keyWorks.length > 0 && (
            <section className="mb-10">
              <h2 className="text-[1rem] font-medium text-zinc-900 mb-4">
                Key Works
              </h2>
              <div className="space-y-3">
                {keyWorks.map((work, i) => (
                  <div
                    key={i}
                    className="bg-[#FAFAFA] border border-[#E4E4E7] rounded p-4 flex gap-4"
                    style={{ borderWidth: '0.5px' }}
                  >
                    <span className="font-mono text-[0.65rem] text-[#E24B4A] font-medium mt-0.5 shrink-0">
                      {work.year}
                    </span>
                    <div>
                      <h3 className="text-[0.875rem] font-medium text-zinc-900">{work.title}</h3>
                      <p className="text-[0.8rem] text-zinc-500 mt-1">{work.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Related posts */}
          {relatedPosts && relatedPosts.length > 0 && (
            <section>
              <h2 className="text-[1rem] font-medium text-zinc-900 mb-4">
                Related Posts
              </h2>
              <div className="grid gap-3 md:grid-cols-2">
                {relatedPosts.map((post: any) => (
                  <BlogCard
                    key={post.id}
                    slug={post.slug}
                    title={post.title}
                    excerpt={post.excerpt}
                    category={post.category}
                    difficulty={post.difficulty}
                    createdAt={post.createdAt}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <div className="mt-10 pt-6" style={{ borderTop: '0.5px solid #E4E4E7' }}>
        <Link
          href="/thinkers"
          className="text-[0.78rem] text-zinc-400 hover:text-zinc-900 transition-colors"
        >
          ← All Thinkers
        </Link>
      </div>
    </div>
  );
}
