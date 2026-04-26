import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.article.findUnique({ where: { slug } });
  if (!article) return { title: 'Article Not Found' };
  return { title: article.title, description: article.excerpt };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug },
    include: { tags: true },
  });

  if (!article || !article.published) notFound();

  return (
    <article className="max-w-article mx-auto px-6 py-16 lg:py-22">
      <Link
        href="/articles"
        className="inline-flex items-center gap-1 text-small text-muted hover:text-burgundy-600 transition-colors mb-10"
      >
        <ArrowLeft size={14} /> All Articles
      </Link>

      <h1 className="font-serif text-display font-bold text-charcoal mb-3">
        {article.title}
      </h1>

      {article.subtitle && (
        <p className="font-serif text-title italic text-muted mb-6">{article.subtitle}</p>
      )}

      <div className="flex items-center gap-3 text-small text-muted mb-10">
        <span>{article.author}</span>
        <span className="text-sand">·</span>
        <time dateTime={article.createdAt.toISOString()}>
          {format(article.createdAt, 'MMMM d, yyyy')}
        </time>
      </div>

      <div className="divider-left !mb-10" />

      <div className="prose prose-lg max-w-none">
        <ReactMarkdown>{article.content}</ReactMarkdown>
      </div>

      <div className="border-t border-sand mt-16 pt-8">
        <Link
          href="/articles"
          className="inline-flex items-center gap-1 text-small font-medium text-burgundy-600 hover:text-burgundy-500 transition-colors"
        >
          <ArrowLeft size={14} /> All Articles
        </Link>
      </div>
    </article>
  );
}
