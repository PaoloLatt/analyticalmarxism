import { prisma } from '@/lib/db';
import SectionHeader from '@/components/SectionHeader';
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

  const categories = ['all', 'explainer', 'commentary', 'reading'] as const;

  return (
    <div className="max-w-wide mx-auto px-6 lg:px-10 py-16 lg:py-22">
      <SectionHeader
        label="Blog & Commentary"
        title="Latest Posts"
        subtitle="Explainers, commentary on current issues, and guided readings of key texts in the Analytical Marxist tradition."
      />

      {/* Category filters (client-side filtering can be added later) */}
      <div className="flex flex-wrap gap-2 mt-10 mb-10">
        {categories.map((cat) => (
          <span
            key={cat}
            className={`px-4 py-2 rounded-full text-small font-medium cursor-pointer transition-colors ${
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
        <div className="grid gap-6 md:grid-cols-2 stagger">
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
        <div className="text-center py-20 text-muted">
          <p className="text-body">No posts yet. Create your first post in the admin panel.</p>
        </div>
      )}
    </div>
  );
}
