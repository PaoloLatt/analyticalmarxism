import Link from 'next/link';
import { format } from 'date-fns';

interface BlogCardProps {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  difficulty: string;
  createdAt: Date | string;
  authorName?: string;
  featured?: boolean;
}

const BADGE_CLASS: Record<string, string> = {
  explainer:  'badge-explainer',
  commentary: 'badge-commentary',
  reading:    'badge-reading',
};

export default function BlogCard({
  slug, title, excerpt, category, difficulty, createdAt, authorName, featured,
}: BlogCardProps) {
  const date = typeof createdAt === 'string' ? new Date(createdAt) : createdAt;

  return (
    <Link
      href={`/blog/${slug}`}
      className={`group flex flex-col bg-white rounded border border-sand/60 p-4 card-lift ${
        featured ? 'ring-1 ring-burgundy-200' : ''
      }`}
    >
      {/* Meta row */}
      <div className="flex items-center gap-2 mb-2.5">
        <span className={`${BADGE_CLASS[category] ?? 'badge'} text-[0.65rem] py-0.5 px-2`}>
          {category}
        </span>
        <span className="text-[0.68rem] font-mono uppercase tracking-widest text-muted">
          {difficulty}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-serif text-[0.9875rem] font-semibold text-charcoal group-hover:text-burgundy-600 transition-colors mb-2 leading-snug">
        {title}
      </h3>

      {/* Excerpt */}
      <p className="text-[0.8125rem] text-slate leading-relaxed mb-3 line-clamp-2 flex-1">
        {excerpt}
      </p>

      {/* Footer */}
      <div className="flex items-center gap-2 text-[0.7rem] text-muted mt-auto">
        <time dateTime={date.toISOString()}>
          {format(date, 'MMM d, yyyy')}
        </time>
        {authorName && (
          <>
            <span className="text-sand">·</span>
            <span>{authorName}</span>
          </>
        )}
      </div>
    </Link>
  );
}
