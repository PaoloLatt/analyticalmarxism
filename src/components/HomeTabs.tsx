'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BarChart3, Layers, Play, Zap } from 'lucide-react';
import BlogCard from '@/components/BlogCard';
import ThinkerCard from '@/components/ThinkerCard';

type Tab = 'blog' | 'articles' | 'thinkers' | 'visuals';

interface HomeTabsProps {
  posts: any[];
  articles: any[];
  thinkers: any[];
  visuals: any[];
}

const TABS: { key: Tab; label: string; href: string }[] = [
  { key: 'blog',     label: 'Blog',     href: '/blog'              },
  { key: 'articles', label: 'Articles', href: '/articles'          },
  { key: 'thinkers', label: 'Thinkers', href: '/thinkers'          },
  { key: 'visuals',  label: 'Visuals',  href: '/visual-explainers' },
];

const VISUAL_ICONS: Record<string, React.ElementType> = {
  infographic: BarChart3,
  diagram: Layers,
  video: Play,
  interactive: Zap,
};

export default function HomeTabs({ posts, articles, thinkers, visuals }: HomeTabsProps) {
  const [active, setActive] = useState<Tab>('blog');
  const activeTab = TABS.find(t => t.key === active)!;

  return (
    <div>
      {/* Tab navigation */}
      <div className="flex items-center justify-between mb-7">
        <div className="flex gap-1.5">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`px-4 py-1.5 text-[0.8rem] font-medium rounded transition-colors ${
                active === key
                  ? 'bg-[#E24B4A] text-white'
                  : 'bg-white border text-zinc-500 hover:text-zinc-800 hover:border-zinc-400'
              }`}
              style={active === key ? {} : { borderColor: '#E4E4E7' }}
            >
              {label}
            </button>
          ))}
        </div>
        <Link
          href={activeTab.href}
          className="hidden sm:inline-flex items-center gap-1 text-[0.78rem] text-zinc-400 hover:text-zinc-900 transition-colors"
        >
          See all <ArrowRight size={12} />
        </Link>
      </div>

      {/* Blog */}
      {active === 'blog' && (
        posts.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post: any) => (
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
        ) : <EmptyState message="No posts yet." />
      )}

      {/* Articles */}
      {active === 'articles' && (
        articles.length > 0 ? (
          <div className="divide-y" style={{ borderColor: '#F4F4F5' }}>
            {articles.map((a: any) => (
              <Link
                key={a.id}
                href={`/articles/${a.slug}`}
                className="group flex items-start gap-5 py-4 first:pt-0"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="text-[0.875rem] font-medium text-zinc-900 group-hover:text-[#E24B4A] transition-colors leading-snug mb-1">
                    {a.title}
                  </h3>
                  {a.subtitle && (
                    <p className="text-[0.78rem] text-zinc-400 italic mb-1">{a.subtitle}</p>
                  )}
                  <p className="text-[0.8rem] text-zinc-500 leading-relaxed line-clamp-2">{a.excerpt}</p>
                </div>
                <span className="text-[0.72rem] text-zinc-300 shrink-0 mt-0.5">{a.author}</span>
              </Link>
            ))}
          </div>
        ) : <EmptyState message="No articles yet." />
      )}

      {/* Thinkers */}
      {active === 'thinkers' && (
        thinkers.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {thinkers.map((t: any) => <ThinkerCard key={t.id} {...t} />)}
          </div>
        ) : <EmptyState message="No thinkers yet." />
      )}

      {/* Visuals */}
      {active === 'visuals' && (
        visuals.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {visuals.map((v: any) => {
              const Icon = VISUAL_ICONS[v.type] ?? BarChart3;
              return (
                <div
                  key={v.id}
                  className="bg-[#FAFAFA] rounded-[6px] overflow-hidden"
                  style={{ border: '0.5px solid #E4E4E7' }}
                >
                  <div className="aspect-video bg-zinc-100 flex items-center justify-center relative">
                    {v.imageUrl ? (
                      <img src={v.imageUrl} alt={v.title} className="w-full h-full object-cover" />
                    ) : (
                      <Icon size={32} className="text-zinc-300" />
                    )}
                    <span className="absolute top-2 left-2 text-[0.65rem] font-medium bg-white/90 text-zinc-600 px-2 py-0.5 rounded-sm">
                      {v.type}
                    </span>
                  </div>
                  <div className="p-3.5">
                    <h3 className="text-[0.875rem] font-medium text-zinc-900 mb-1">{v.title}</h3>
                    <p className="text-[0.8rem] text-zinc-500 line-clamp-2">{v.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : <EmptyState message="No visual explainers yet." />
      )}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-12 text-center text-zinc-400 border border-zinc-100 rounded bg-zinc-50">
      <p className="text-[0.8125rem]">{message}</p>
    </div>
  );
}
