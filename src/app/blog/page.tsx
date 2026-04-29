import { prisma } from '@/lib/db';
import BlogCard from '@/components/BlogCard';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Blog & Commentary' };
export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    include: { author: true, tags: true },
  });

  return (
    <div className="max-w-wide mx-auto px-6 lg:px-8 py-8 lg:py-10">
      <div className="mb-6">
        <p className="text-[0.7rem] font-sans font-semibold uppercase tracking-widest text-burgundy-600 mb-1">
          Blog &amp; Commentary
        </p>
        <h1 className="font-serif text-[1.75rem] font-bold text-charcoal">
          Latest Posts
        </h1>
        <p className="text-small text-slate mt-2 max-w-xl">
          Explainers, commentary on current issues, and guided readings of key
          texts in the Analytical Marxist tradition.
        </p>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-6 pb-6 border-b border-sand">
        {(['all', 'explainer', 'commentary', 'reading'] as const).map((cat) => (
          <span
            key={cat}
            className={`px-3 py-1.5 rounded text-[0.75rem] font-medium cursor-pointer transition-colors ${
              cat === 'all'
                ? 'bg-charcoal text-cream'
                : 'bg-white border border-sand text-slate hover:border-burgundy-300 hover:text-burgundy-600'
            }`}
          >
            {cat === 'all' ? 'All Posts' : cat.charAt(0).toUpperCase() + cat.slice(1) + 's'}
          </span>
        ))}
      </div>

      {posts.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 stagger">
          {posts.map((post) => (
            <BlogCard
              key={post.id}
              slug={post.slug}
              title={post.title}
              excerpt={post.excerpt}
              category={post.category}
              difficulty={post.difficulty}
              createdAt={post.createdAt}
              authorName={post.author?.name}
              featured={post.featured}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted border border-sand rounded-lg bg-parchment/50">
          <p className="text-small">No posts yet. Create your first post in the admin panel.</p>
        </div>
      )}
    </div>
  );
}
