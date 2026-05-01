'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, Save, X } from 'lucide-react';

interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  author: string;
  excerpt: string;
  content: string;
  published: boolean;
  createdAt: string;
}

const EMPTY = {
  title: '', slug: '', subtitle: '', author: '', excerpt: '', content: '', published: false,
};

const fieldCls = 'w-full px-3 py-2 border border-sand rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-burgundy-200';
const labelCls = 'block text-caption font-semibold text-slate uppercase tracking-wider mb-1';

export default function AdminArticlesPage() {
  const [items, setItems] = useState<Article[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const res = await fetch('/api/articles');
    setItems(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setCreating(true); };
  const openEdit = (a: Article) => {
    setCreating(false); setEditing(a.id);
    setForm({ title: a.title, slug: a.slug, subtitle: a.subtitle ?? '', author: a.author, excerpt: a.excerpt, content: a.content, published: a.published });
  };
  const cancel = () => { setEditing(null); setCreating(false); setForm(EMPTY); };

  const autoSlug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const handleSave = async () => {
    const payload = { ...form, subtitle: form.subtitle || null };
    if (creating) {
      await fetch('/api/articles', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    } else if (editing) {
      await fetch(`/api/articles/${editing}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    }
    cancel(); fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this article?')) return;
    await fetch(`/api/articles/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const togglePublish = async (a: Article) => {
    await fetch(`/api/articles/${a.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ published: !a.published }) });
    fetchData();
  };

  const showForm = creating || editing;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-headline font-semibold text-charcoal">Articles & Essays</h2>
        <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2.5 bg-burgundy-600 hover:bg-burgundy-500 text-cream rounded-lg text-small font-medium transition-colors">
          <Plus size={14} /> New Article
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-sand/60 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-sans font-semibold text-body text-charcoal">{creating ? 'Create Article' : 'Edit Article'}</h3>
            <button onClick={cancel} className="text-muted hover:text-charcoal"><X size={18} /></button>
          </div>

          <div className="grid gap-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Title</label>
                <input value={form.title} onChange={(e) => { const t = e.target.value; setForm(f => ({ ...f, title: t, ...(creating ? { slug: autoSlug(t) } : {}) })); }} className={fieldCls} placeholder="Article title" />
              </div>
              <div>
                <label className={labelCls}>Slug</label>
                <input value={form.slug} onChange={(e) => setForm(f => ({ ...f, slug: e.target.value }))} className={`${fieldCls} font-mono`} placeholder="article-slug" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Subtitle (optional)</label>
                <input value={form.subtitle} onChange={(e) => setForm(f => ({ ...f, subtitle: e.target.value }))} className={fieldCls} placeholder="A secondary title or framing" />
              </div>
              <div>
                <label className={labelCls}>Author</label>
                <input value={form.author} onChange={(e) => setForm(f => ({ ...f, author: e.target.value }))} className={fieldCls} placeholder="Author name" />
              </div>
            </div>

            <div>
              <label className={labelCls}>Excerpt</label>
              <textarea value={form.excerpt} onChange={(e) => setForm(f => ({ ...f, excerpt: e.target.value }))} rows={2} className={fieldCls} placeholder="Short summary…" />
            </div>

            <div>
              <label className={labelCls}>Content (Markdown)</label>
              <textarea value={form.content} onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))} rows={14} className={`${fieldCls} font-mono text-small`} placeholder="Write in Markdown…" />
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-small text-slate cursor-pointer">
                <input type="checkbox" checked={form.published} onChange={(e) => setForm(f => ({ ...f, published: e.target.checked }))} className="rounded border-sand" />
                Published
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={handleSave} className="inline-flex items-center gap-2 px-5 py-2.5 bg-burgundy-600 hover:bg-burgundy-500 text-cream rounded-lg text-small font-medium transition-colors">
                <Save size={14} /> {creating ? 'Create' : 'Save'}
              </button>
              <button onClick={cancel} className="px-5 py-2.5 border border-sand text-slate hover:text-charcoal rounded-lg text-small font-medium transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-sand/60 rounded-lg overflow-hidden">
        {loading ? (
          <p className="px-5 py-12 text-center text-muted text-small">Loading…</p>
        ) : items.length === 0 ? (
          <p className="px-5 py-12 text-center text-muted text-small">No articles yet. Create your first one above.</p>
        ) : (
          <div className="divide-y divide-sand/40">
            {items.map((a) => (
              <div key={a.id} className="px-5 py-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-body font-medium text-charcoal truncate">{a.title}</p>
                  <p className="text-caption text-muted">{a.author} · {a.published ? 'Published' : 'Draft'}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => togglePublish(a)} className="p-2 text-muted hover:text-charcoal transition-colors" title={a.published ? 'Unpublish' : 'Publish'}>
                    {a.published ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button onClick={() => openEdit(a)} className="p-2 text-muted hover:text-burgundy-600 transition-colors"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(a.id)} className="p-2 text-muted hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
