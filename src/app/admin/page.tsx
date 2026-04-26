import { prisma } from '@/lib/db';
import Link from 'next/link';
import { FileText, Users, BarChart3, BookOpen, Plus } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Admin' };
export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [postCount, thinkerCount, infographicCount, articleCount, recentPosts] = await Promise.all([
    prisma.post.count(),
    prisma.thinker.count(),
    prisma.infographic.count(),
    prisma.article.count(),
    prisma.post.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 5,
      include: { author: true },
    }),
  ]);

  const stats = [
    { label: 'Posts',        count: postCount,        icon: FileText,  color: 'text-burgundy-600 bg-burgundy-50' },
    { label: 'Thinkers',    count: thinkerCount,      icon: Users,     color: 'text-navy-600 bg-navy-50' },
    { label: 'Infographics',count: infographicCount,  icon: BarChart3, color: 'text-emerald-700 bg-emerald-50' },
    { label: 'Articles',    count: articleCount,       icon: BookOpen,  color: 'text-amber-700 bg-amber-50' },
  ];

  return (
    <div>
      <h2 className="font-serif text-headline font-semibold text-charcoal mb-6">Dashboard</h2>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, count, icon: Icon, color }) => (
          <div key={label} className="bg-white border border-sand/60 rounded-lg p-5">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${color}`}>
              <Icon size={18} />
            </div>
            <p className="font-mono text-headline font-bold text-charcoal">{count}</p>
            <p className="text-small text-muted">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3 mb-10">
        <Link
          href="/admin/posts?new=true"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-burgundy-600 hover:bg-burgundy-500 text-cream rounded-lg text-small font-medium transition-colors"
        >
          <Plus size={14} /> New Post
        </Link>
        <Link
          href="/admin/thinkers?new=true"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-navy-600 hover:bg-navy-400 text-cream rounded-lg text-small font-medium transition-colors"
        >
          <Plus size={14} /> New Thinker
        </Link>
      </div>

      {/* Recent posts */}
      <div className="bg-white border border-sand/60 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-sand/60">
          <h3 className="font-sans font-semibold text-body text-charcoal">Recent Posts</h3>
        </div>
        {recentPosts.length > 0 ? (
          <div className="divide-y divide-sand/40">
            {recentPosts.map((post) => (
              <div key={post.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-small font-medium text-charcoal">{post.title}</p>
                  <p className="text-caption text-muted">
                    {post.category} · {post.published ? 'Published' : 'Draft'}
                  </p>
                </div>
                <Link
                  href={`/admin/posts?edit=${post.id}`}
                  className="text-caption text-burgundy-600 hover:text-burgundy-500 font-medium"
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="px-5 py-8 text-center text-muted text-small">No posts yet.</p>
        )}
      </div>
    </div>
  );
}
