'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, Star, Save, X } from 'lucide-react';

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  difficulty: string;
  published: boolean;
  featured: boolean;
  authorId: string | null;
  author?: { id: string; name: string } | null;
  tags?: { id: string; name: string }[];
  createdAt: string;
}

interface Thinker {
  id: string;
  name: string;
}

const EMPTY_POST = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  category: 'explainer',
  difficulty: 'introductory',
  published: false,
  featured: false,
  authorId: '',
  tagNames: '',
};

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [thinkers, setThinkers] = useState<Thinker[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(EMPTY_POST);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const [postsRes, thinkersRes] = await Promise.all([
      fetch('/api/posts'),
      fetch('/api/thinkers'),
    ]);
    setPosts(await postsRes.json());
    setThinkers(await thinkersRes.json());
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_POST);
    setCreating(true);
  };

  const openEdit = (post: Post) => {
    setCreating(false);
    setEditing(post.id);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      difficulty: post.difficulty,
      published: post.published,
      featured: post.featured,
      authorId: post.authorId || '',
      tagNames: post.tags?.map(t => t.name).join(', ') || '',
    });
  };

  const cancel = () => {
    setEditing(null);
    setCreating(false);
    setForm(EMPTY_POST);
  };

  const handleSave = async () => {
    const payload = {
      ...form,
      authorId: form.authorId || null,
      tagNames: form.tagNames ? form.tagNames.split(',').map(s => s.trim()).filter(Boolean) : [],
    };

    if (creating) {
      await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } else if (editing) {
      await fetch(`/api/posts/${editing}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }
    cancel();
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const togglePublish = async (post: Post) => {
    await fetch(`/api/posts/${post.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !post.published }),
    });
    fetchData();
  };

  const autoSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const showForm = creating || editing;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-headline font-semibold text-charcoal">Posts</h2>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-burgundy-600 hover:bg-burgundy-500 text-cream rounded-lg text-small font-medium transition-colors"
        >
          <Plus size={14} /> New Post
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-sand/60 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-sans font-semibold text-body text-charcoal">
              {creating ? 'Create Post' : 'Edit Post'}
            </h3>
            <button onClick={cancel} className="text-muted hover:text-charcoal">
              <X size={18} />
            </button>
          </div>

          <div className="grid gap-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-caption font-semibold text-slate uppercase tracking-wider mb-1">Title</label>
                <input
                  value={form.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setForm(f => ({
                      ...f,
                      title,
                      ...(creating ? { slug: autoSlug(title) } : {}),
                    }));
                  }}
                  className="w-full px-3 py-2 border border-sand rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-burgundy-200"
                  placeholder="Post title"
                />
              </div>
              <div>
                <label className="block text-caption font-semibold text-slate uppercase tracking-wider mb-1">Slug</label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm(f => ({ ...f, slug: e.target.value }))}
                  className="w-full px-3 py-2 border border-sand rounded-lg text-body font-mono focus:outline-none focus:ring-2 focus:ring-burgundy-200"
                  placeholder="post-slug"
                />
              </div>
            </div>

            <div>
              <label className="block text-caption font-semibold text-slate uppercase tracking-wider mb-1">Excerpt</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => setForm(f => ({ ...f, excerpt: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 border border-sand rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-burgundy-200"
                placeholder="Short summary..."
              />
            </div>

            <div>
              <label className="block text-caption font-semibold text-slate uppercase tracking-wider mb-1">Content (Markdown)</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))}
                rows={12}
                className="w-full px-3 py-2 border border-sand rounded-lg text-body font-mono text-small focus:outline-none focus:ring-2 focus:ring-burgundy-200"
                placeholder="Write in Markdown..."
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-caption font-semibold text-slate uppercase tracking-wider mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-sand rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-burgundy-200"
                >
                  <option value="explainer">Explainer</option>
                  <option value="commentary">Commentary</option>
                  <option value="reading">Reading</option>
                </select>
              </div>
              <div>
                <label className="block text-caption font-semibold text-slate uppercase tracking-wider mb-1">Difficulty</label>
                <select
                  value={form.difficulty}
                  onChange={(e) => setForm(f => ({ ...f, difficulty: e.target.value }))}
                  className="w-full px-3 py-2 border border-sand rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-burgundy-200"
                >
                  <option value="introductory">Introductory</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-caption font-semibold text-slate uppercase tracking-wider mb-1">Author (Thinker)</label>
                <select
                  value={form.authorId}
                  onChange={(e) => setForm(f => ({ ...f, authorId: e.target.value }))}
                  className="w-full px-3 py-2 border border-sand rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-burgundy-200"
                >
                  <option value="">None</option>
                  {thinkers.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-caption font-semibold text-slate uppercase tracking-wider mb-1">Tags (comma-separated)</label>
              <input
                value={form.tagNames}
                onChange={(e) => setForm(f => ({ ...f, tagNames: e.target.value }))}
                className="w-full px-3 py-2 border border-sand rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-burgundy-200"
                placeholder="exploitation, class, game theory"
              />
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-small text-slate cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => setForm(f => ({ ...f, published: e.target.checked }))}
                  className="rounded border-sand"
                />
                Published
              </label>
              <label className="flex items-center gap-2 text-small text-slate cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm(f => ({ ...f, featured: e.target.checked }))}
                  className="rounded border-sand"
                />
                Featured
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-burgundy-600 hover:bg-burgundy-500 text-cream rounded-lg text-small font-medium transition-colors"
              >
                <Save size={14} /> {creating ? 'Create' : 'Save'}
              </button>
              <button
                onClick={cancel}
                className="px-5 py-2.5 border border-sand text-slate hover:text-charcoal rounded-lg text-small font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Posts list */}
      <div className="bg-white border border-sand/60 rounded-lg overflow-hidden">
        {loading ? (
          <p className="px-5 py-12 text-center text-muted text-small">Loading...</p>
        ) : posts.length === 0 ? (
          <p className="px-5 py-12 text-center text-muted text-small">No posts yet. Create your first one above.</p>
        ) : (
          <div className="divide-y divide-sand/40">
            {posts.map((post) => (
              <div key={post.id} className="px-5 py-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-body font-medium text-charcoal truncate">{post.title}</p>
                    {post.featured && <Star size={12} className="text-amber-500 shrink-0" />}
                  </div>
                  <p className="text-caption text-muted">
                    {post.category} · {post.difficulty} · {post.published ? 'Published' : 'Draft'}
                    {post.author && ` · ${post.author.name}`}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => togglePublish(post)}
                    className="p-2 text-muted hover:text-charcoal transition-colors"
                    title={post.published ? 'Unpublish' : 'Publish'}
                  >
                    {post.published ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button
                    onClick={() => openEdit(post)}
                    className="p-2 text-muted hover:text-burgundy-600 transition-colors"
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-2 text-muted hover:text-red-600 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
