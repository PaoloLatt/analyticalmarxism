import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import TrackPageView from '@/components/TrackPageView';
import ShareButtons from '@/components/ShareButtons';
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
    explainer:  'badge-explainer',
    commentary: 'badge-commentary',
    reading:    'badge-reading',
  };

  return (
    <article className="mx-auto px-6 py-10 lg:py-12" style={{ maxWidth: '680px' }}>
      <TrackPageView
        eventName="article_read"
        params={{ content_slug: post.slug, content_title: post.title, category: post.category }}
      />

      {/* Meta */}
      <div className="flex items-center gap-3 mb-5">
        <span className={BADGE_CLASS[post.category] ?? 'badge'}>{post.category}</span>
        <span className="difficulty">{post.difficulty}</span>
      </div>

      {/* Title */}
      <h1 className="text-[1.75rem] font-medium text-zinc-900 leading-snug mb-5" style={{ letterSpacing: '-0.015em' }}>
        {post.title}
      </h1>

      {/* Share buttons — directly below title */}
      <div className="mb-6">
        <ShareButtons title={post.title} slug={post.slug} />
      </div>

      {/* Byline */}
      <div className="flex items-center gap-3 text-[0.78rem] text-zinc-400 mb-4">
        <time dateTime={post.createdAt.toISOString()}>
          {format(post.createdAt, 'MMMM d, yyyy')}
        </time>
        {post.author && (
          <>
            <span className="text-zinc-200">·</span>
            <Link
              href={`/thinkers/${post.author.slug}`}
              className="text-[#E24B4A] hover:text-[#C73B3A] transition-colors"
            >
              {post.author.name}
            </Link>
          </>
        )}
      </div>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-8">
          {post.tags.map((tag) => (
            <span
              key={tag.id}
              className="text-[0.65rem] font-mono bg-zinc-100 text-zinc-400 px-2 py-0.5 rounded-sm"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      )}

      <div className="h-px bg-zinc-100 mb-8" />

      {/* Body */}
      <div className="prose prose-base max-w-none">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>

      {/* Footer nav */}
      <div className="mt-14 pt-6" style={{ borderTop: '0.5px solid #E4E4E7' }}>
        <Link
          href="/blog"
          className="text-[0.78rem] text-zinc-400 hover:text-zinc-900 transition-colors"
        >
          ← All Posts
        </Link>
      </div>
    </article>
  );
}
