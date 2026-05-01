import { prisma } from '@/lib/db';
import BlogCard from '@/components/BlogCard';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Blog' };
export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    include: { author: true, tags: true },
  });

  const TABS = [
    { key: 'all',        label: 'All'        },
    { key: 'explainer',  label: 'Explainers' },
    { key: 'commentary', label: 'Commentary' },
    { key: 'reading',    label: 'Readings'   },
  ] as const;

  return (
    <div className="max-w-wide mx-auto px-6 lg:px-8 py-8 lg:py-10">
      <div className="mb-6">
        <div className="w-6 h-[2px] bg-[#E24B4A] mb-3" />
        <h1 className="text-[1.375rem] font-medium text-zinc-900">Blog</h1>
      </div>

      {/* Text tabs */}
      <div className="flex gap-6 mb-7" style={{ borderBottom: '0.5px solid #E4E4E7' }}>
        {TABS.map(({ key, label }) => (
          <span
            key={key}
            className={`pb-2.5 text-[0.8125rem] cursor-pointer transition-colors ${
              key === 'all'
                ? 'text-zinc-900 font-medium border-b-2 border-[#E24B4A] -mb-px'
                : 'text-zinc-400 hover:text-zinc-700'
            }`}
          >
            {label}
          </span>
        ))}
      </div>

      {posts.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
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
        <div className="py-16 text-center text-zinc-400 border border-zinc-100 rounded bg-zinc-50">
          <p className="text-[0.8125rem]">No posts yet. Create your first post in the admin panel.</p>
        </div>
      )}
    </div>
  );
}
