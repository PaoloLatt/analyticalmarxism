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
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post) return { title: 'Post Not Found' };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { author: true, tags: true },
  });

  if (!post || !post.published) notFound();

  const BADGE_CLASS: Record<string, string> = {
    explainer: 'badge-explainer',
    commentary: 'badge-commentary',
    reading: 'badge-reading',
  };

  return (
    <article className="max-w-article mx-auto px-6 py-16 lg:py-22">
      {/* Back link */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-1 text-small text-muted hover:text-burgundy-600 transition-colors mb-10"
      >
        <ArrowLeft size={14} /> Back to Blog
      </Link>

      {/* Meta */}
      <div className="flex items-center gap-3 mb-6">
        <span className={BADGE_CLASS[post.category] ?? 'badge'}>
          {post.category}
        </span>
        <span className="difficulty">{post.difficulty}</span>
      </div>

      {/* Title */}
      <h1 className="font-serif text-display font-bold text-charcoal mb-6">
        {post.title}
      </h1>

      {/* Byline */}
      <div className="flex items-center gap-3 text-small text-muted mb-4">
        <time dateTime={post.createdAt.toISOString()}>
          {format(post.createdAt, 'MMMM d, yyyy')}
        </time>
        {post.author && (
          <>
            <span className="text-sand">·</span>
            <Link
              href={`/thinkers/${post.author.slug}`}
              className="text-burgundy-600 hover:text-burgundy-500"
            >
              {post.author.name}
            </Link>
          </>
        )}
      </div>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
          {post.tags.map((tag) => (
            <span
              key={tag.id}
              className="text-caption font-mono bg-parchment text-muted px-2 py-1 rounded"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      )}

      <div className="divider-left !mb-10" />

      {/* Body */}
      <div className="prose prose-lg max-w-none">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>

      {/* Footer nav */}
      <div className="border-t border-sand mt-16 pt-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-small font-medium text-burgundy-600 hover:text-burgundy-500 transition-colors"
        >
          <ArrowLeft size={14} /> All Posts
        </Link>
      </div>
    </article>
  );
}
