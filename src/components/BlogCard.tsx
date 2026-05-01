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
      className={`group flex flex-col bg-[#FAFAFA] rounded-[6px] p-3.5 transition-colors ${
        featured
          ? 'border border-[#E24B4A]/30'
          : 'border hover:border-zinc-400'
      }`}
      style={{ borderColor: featured ? undefined : '#E4E4E7', borderWidth: '0.5px' }}
    >
      {/* Meta row */}
      <div className="flex items-center gap-2 mb-2">
        <span className={`${BADGE_CLASS[category] ?? 'badge'}`}>
          {category}
        </span>
        <span className="difficulty">{difficulty}</span>
      </div>

      {/* Title */}
      <h3 className="text-[0.875rem] font-medium text-zinc-900 group-hover:text-[#E24B4A] transition-colors mb-1.5 leading-snug">
        {title}
      </h3>

      {/* Excerpt */}
      <p className="text-[0.8rem] text-zinc-500 leading-relaxed mb-3 line-clamp-2 flex-1">
        {excerpt}
      </p>

      {/* Footer */}
      <div className="flex items-center gap-2 text-[0.68rem] text-zinc-400 mt-auto">
        <time dateTime={date.toISOString()}>
          {format(date, 'MMM d, yyyy')}
        </time>
        {authorName && (
          <>
            <span className="text-zinc-300">·</span>
            <span>{authorName}</span>
          </>
        )}
      </div>
    </Link>
  );
}
