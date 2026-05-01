'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, Star, Save, X } from 'lucide-react';

interface Infographic {
  id: string; slug: string; title: string; description: string;
  imageUrl: string | null; videoUrl: string | null; embedHtml: string | null;
  type: string; published: boolean; featured: boolean;
  thinkerId: string | null; thinker?: { name: string } | null;
}
interface Thinker { id: string; name: string; }

const EMPTY = { title: '', slug: '', description: '', imageUrl: '', videoUrl: '', embedHtml: '', type: 'infographic', published: false, featured: false, thinkerId: '' };

const fieldCls = 'w-full px-3 py-2 border border-sand rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-burgundy-200';
const labelCls = 'block text-caption font-semibold text-slate uppercase tracking-wider mb-1';

export default function AdminVisualsPage() {
  const [items, setItems] = useState<Infographic[]>([]);
  const [thinkers, setThinkers] = useState<Thinker[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const [iRes, tRes] = await Promise.all([fetch('/api/infographics'), fetch('/api/thinkers')]);
    setItems(await iRes.json());
    setThinkers(await tRes.json());
    setLoading(false);
  };
  useEffect(() => { fetchData(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setCreating(true); };
  const openEdit = (i: Infographic) => {
    setCreating(false); setEditing(i.id);
    setForm({ title: i.title, slug: i.slug, description: i.description, imageUrl: i.imageUrl ?? '', videoUrl: i.videoUrl ?? '', embedHtml: i.embedHtml ?? '', type: i.type, published: i.published, featured: i.featured, thinkerId: i.thinkerId ?? '' });
  };
  const cancel = () => { setEditing(null); setCreating(false); setForm(EMPTY); };

  const autoSlug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const handleSave = async () => {
    const payload = { ...form, imageUrl: form.imageUrl || null, videoUrl: form.videoUrl || null, embedHtml: form.embedHtml || null, thinkerId: form.thinkerId || null };
    if (creating) await fetch('/api/infographics', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    else if (editing) await fetch(`/api/infographics/${editing}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    cancel(); fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this visual?')) return;
    await fetch(`/api/infographics/${id}`, { method: 'DELETE' }); fetchData();
  };

  const togglePublish = async (i: Infographic) => {
    await fetch(`/api/infographics/${i.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ published: !i.published }) });
    fetchData();
  };

  const showForm = creating || editing;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-headline font-semibold text-charcoal">Visual Explainers</h2>
        <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2.5 bg-burgundy-600 hover:bg-burgundy-500 text-cream rounded-lg text-small font-medium transition-colors">
          <Plus size={14} /> New Visual
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-sand/60 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-sans font-semibold text-body text-charcoal">{creating ? 'Create Visual' : 'Edit Visual'}</h3>
            <button onClick={cancel} className="text-muted hover:text-charcoal"><X size={18} /></button>
          </div>

          <div className="grid gap-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Title</label>
                <input value={form.title} onChange={e => { const t = e.target.value; setForm(f => ({ ...f, title: t, ...(creating ? { slug: autoSlug(t) } : {}) })); }} className={fieldCls} placeholder="Visual title" />
              </div>
              <div>
                <label className={labelCls}>Slug</label>
                <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className={`${fieldCls} font-mono`} placeholder="visual-slug" />
              </div>
            </div>

            <div>
              <label className={labelCls}>Description</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className={fieldCls} placeholder="Brief description of what this shows…" />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Type</label>
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className={fieldCls}>
                  <option value="infographic">Infographic</option>
                  <option value="diagram">Diagram</option>
                  <option value="video">Video</option>
                  <option value="interactive">Interactive</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Related Thinker (optional)</label>
                <select value={form.thinkerId} onChange={e => setForm(f => ({ ...f, thinkerId: e.target.value }))} className={fieldCls}>
                  <option value="">None</option>
                  {thinkers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className={labelCls}>Image URL (optional)</label>
              <input type="url" value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} className={fieldCls} placeholder="https://…/image.png" />
            </div>

            <div>
              <label className={labelCls}>Video URL (optional, for embed)</label>
              <input type="url" value={form.videoUrl} onChange={e => setForm(f => ({ ...f, videoUrl: e.target.value }))} className={fieldCls} placeholder="https://youtube.com/embed/…" />
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-small text-slate cursor-pointer">
                <input type="checkbox" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} className="rounded border-sand" /> Published
              </label>
              <label className="flex items-center gap-2 text-small text-slate cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="rounded border-sand" /> Featured
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={handleSave} className="inline-flex items-center gap-2 px-5 py-2.5 bg-burgundy-600 hover:bg-burgundy-500 text-cream rounded-lg text-small font-medium transition-colors"><Save size={14} /> {creating ? 'Create' : 'Save'}</button>
              <button onClick={cancel} className="px-5 py-2.5 border border-sand text-slate hover:text-charcoal rounded-lg text-small font-medium transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-sand/60 rounded-lg overflow-hidden">
        {loading ? (
          <p className="px-5 py-12 text-center text-muted text-small">Loading…</p>
        ) : items.length === 0 ? (
          <p className="px-5 py-12 text-center text-muted text-small">No visuals yet. Create your first one above.</p>
        ) : (
          <div className="divide-y divide-sand/40">
            {items.map(item => (
              <div key={item.id} className="px-5 py-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-body font-medium text-charcoal truncate">{item.title}</p>
                    {item.featured && <Star size={12} className="text-amber-500 shrink-0" />}
                  </div>
                  <p className="text-caption text-muted">
                    {item.type} · {item.published ? 'Published' : 'Draft'}
                    {item.thinker && ` · ${item.thinker.name}`}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => togglePublish(item)} className="p-2 text-muted hover:text-charcoal transition-colors" title={item.published ? 'Unpublish' : 'Publish'}>
                    {item.published ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button onClick={() => openEdit(item)} className="p-2 text-muted hover:text-burgundy-600 transition-colors"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-muted hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
