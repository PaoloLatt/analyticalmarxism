import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import BlogCard from '@/components/BlogCard';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const thinker = await prisma.thinker.findUnique({ where: { slug } });
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
  const thinker = await prisma.thinker.findUnique({
    where: { slug },
    include: {
      posts: {
        where: { published: true },
        orderBy: { createdAt: 'desc' },
        take: 4,
      },
    },
  });

  if (!thinker || !thinker.published) notFound();

  const lifespan = thinker.birthYear
    ? `${thinker.birthYear}–${thinker.deathYear ?? 'present'}`
    : null;

  let keyWorks: KeyWork[] = [];
  try {
    keyWorks = JSON.parse(thinker.keyWorks);
  } catch {}

  return (
    <div className="max-w-wide mx-auto px-6 lg:px-10 py-16 lg:py-22">
      {/* Back */}
      <Link
        href="/thinkers"
        className="inline-flex items-center gap-1 text-small text-muted hover:text-burgundy-600 transition-colors mb-10"
      >
        <ArrowLeft size={14} /> All Thinkers
      </Link>

      <div className="grid lg:grid-cols-[280px_1fr] gap-12 lg:gap-16">
        {/* Sidebar */}
        <aside>
          <div className="aspect-square bg-parchment rounded-lg flex items-center justify-center overflow-hidden mb-6">
            {thinker.photoUrl ? (
              <img src={thinker.photoUrl} alt={thinker.name} className="w-full h-full object-cover" />
            ) : (
              <span className="font-serif text-display text-sand/50">
                {thinker.name.split(' ').map(w => w[0]).join('')}
              </span>
            )}
          </div>

          <div className="space-y-3 text-small text-slate">
            {thinker.nationality && (
              <div>
                <span className="font-semibold text-charcoal">Nationality:</span>{' '}
                {thinker.nationality}
              </div>
            )}
            {lifespan && (
              <div>
                <span className="font-semibold text-charcoal">Life:</span>{' '}
                {lifespan}
              </div>
            )}
          </div>
        </aside>

        {/* Main content */}
        <div>
          <h1 className="font-serif text-display font-bold text-charcoal mb-2">
            {thinker.name}
          </h1>
          <p className="text-body text-slate italic mb-8">{thinker.shortBio}</p>

          {/* Contribution */}
          <div className="bg-burgundy-50 border border-burgundy-200 rounded-lg p-6 lg:p-8 mb-10">
            <h2 className="font-serif text-title font-semibold text-burgundy-800 mb-3">
              Key Contribution
            </h2>
            <p className="text-body text-burgundy-900 leading-relaxed">
              {thinker.contribution}
            </p>
          </div>

          {/* Full bio */}
          <div className="prose prose-lg max-w-none mb-12">
            <ReactMarkdown>{thinker.fullBio}</ReactMarkdown>
          </div>

          {/* Key Works */}
          {keyWorks.length > 0 && (
            <section className="mb-12">
              <h2 className="font-serif text-headline font-semibold text-charcoal mb-6">
                Key Works
              </h2>
              <div className="space-y-4">
                {keyWorks.map((work, i) => (
                  <div
                    key={i}
                    className="bg-white border border-sand/60 rounded-lg p-5 flex gap-4"
                  >
                    <span className="font-mono text-caption text-burgundy-600 font-semibold mt-1 shrink-0">
                      {work.year}
                    </span>
                    <div>
                      <h3 className="font-serif font-semibold text-charcoal">
                        {work.title}
                      </h3>
                      <p className="text-small text-slate mt-1">{work.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Related posts */}
          {thinker.posts.length > 0 && (
            <section>
              <h2 className="font-serif text-headline font-semibold text-charcoal mb-6">
                Related Posts
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {thinker.posts.map((post) => (
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
    </div>
  );
}
