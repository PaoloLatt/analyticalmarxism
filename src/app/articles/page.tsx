import { prisma } from '@/lib/db';
import SectionHeader from '@/components/SectionHeader';
import Link from 'next/link';
import { format } from 'date-fns';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Articles & Essays' };
export const dynamic = 'force-dynamic';

export default async function ArticlesPage() {
  const articles = await prisma.article.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    include: { tags: true },
  });

  return (
    <div className="max-w-wide mx-auto px-6 lg:px-10 py-16 lg:py-22">
      <SectionHeader
        label="Deep Dives"
        title="Articles & Essays"
        subtitle="Long-form explorations of the major theses in Analytical Marxism — historical materialism, exploitation theory, class analysis, and radical political philosophy."
        centered
      />

      {articles.length > 0 ? (
        <div className="max-w-article mx-auto mt-12 space-y-0 divide-y divide-sand stagger">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              className="group block py-8 first:pt-0"
            >
              <h2 className="font-serif text-title font-semibold text-charcoal group-hover:text-burgundy-600 transition-colors mb-2">
                {article.title}
              </h2>
              {article.subtitle && (
                <p className="font-serif text-body italic text-muted mb-3">{article.subtitle}</p>
              )}
              <p className="text-body text-slate leading-relaxed mb-3 line-clamp-2">
                {article.excerpt}
              </p>
              <div className="flex items-center gap-3 text-small text-muted">
                <span>{article.author}</span>
                <span className="text-sand">·</span>
                <time dateTime={article.createdAt.toISOString()}>
                  {format(article.createdAt, 'MMM d, yyyy')}
                </time>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted">
          <p className="text-body">No articles yet.</p>
        </div>
      )}
    </div>
  );
}
