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
      className={`group block bg-white rounded-lg border border-sand/60 p-6 lg:p-8 card-lift ${
        featured ? 'ring-2 ring-burgundy-200' : ''
      }`}
    >
      {/* Meta row */}
      <div className="flex items-center gap-3 mb-4">
        <span className={BADGE_CLASS[category] ?? 'badge'}>
          {category}
        </span>
        <span className="difficulty">{difficulty}</span>
      </div>

      {/* Title */}
      <h3 className="font-serif text-title font-semibold text-charcoal group-hover:text-burgundy-600 transition-colors mb-3">
        {title}
      </h3>

      {/* Excerpt */}
      <p className="text-body text-slate leading-relaxed mb-4 line-clamp-3">
        {excerpt}
      </p>

      {/* Footer */}
      <div className="flex items-center gap-2 text-small text-muted">
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
