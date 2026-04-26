'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';

interface Thinker {
  id: string;
  slug: string;
  name: string;
  shortBio: string;
  fullBio: string;
  contribution: string;
  keyWorks: string;
  nationality: string | null;
  birthYear: number | null;
  deathYear: number | null;
  photoUrl: string | null;
  published: boolean;
}

const EMPTY = {
  name: '', slug: '', shortBio: '', fullBio: '', contribution: '',
  keyWorks: '[]', nationality: '', birthYear: '', deathYear: '',
  photoUrl: '', published: true,
};

export default function AdminThinkersPage() {
  const [thinkers, setThinkers] = useState<Thinker[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const res = await fetch('/api/thinkers');
    setThinkers(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY);
    setCreating(true);
  };

  const openEdit = (t: Thinker) => {
    setCreating(false);
    setEditing(t.id);
    setForm({
      name: t.name,
      slug: t.slug,
      shortBio: t.shortBio,
      fullBio: t.fullBio,
      contribution: t.contribution,
      keyWorks: t.keyWorks,
      nationality: t.nationality || '',
      birthYear: t.birthYear?.toString() || '',
      deathYear: t.deathYear?.toString() || '',
      photoUrl: t.photoUrl || '',
      published: t.published,
    });
  };

  const cancel = () => { setEditing(null); setCreating(false); setForm(EMPTY); };

  const autoSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const handleSave = async () => {
    const payload = {
      ...form,
      birthYear: form.birthYear ? parseInt(form.birthYear) : null,
      deathYear: form.deathYear ? parseInt(form.deathYear) : null,
      nationality: form.nationality || null,
      photoUrl: form.photoUrl || null,
    };

    if (creating) {
      await fetch('/api/thinkers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } else if (editing) {
      await fetch(`/api/thinkers/${editing}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }
    cancel();
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this thinker?')) return;
    await fetch(`/api/thinkers/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const showForm = creating || editing;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-headline font-semibold text-charcoal">Thinkers</h2>
        <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2.5 bg-navy-600 hover:bg-navy-400 text-cream rounded-lg text-small font-medium transition-colors">
          <Plus size={14} /> New Thinker
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-sand/60 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-sans font-semibold text-body text-charcoal">
              {creating ? 'Add Thinker' : 'Edit Thinker'}
            </h3>
            <button onClick={cancel} className="text-muted hover:text-charcoal"><X size={18} /></button>
          </div>

          <div className="grid gap-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-caption font-semibold text-slate uppercase tracking-wider mb-1">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setForm(f => ({ ...f, name, ...(creating ? { slug: autoSlug(name) } : {}) }));
                  }}
                  className="w-full px-3 py-2 border border-sand rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-navy-200"
                />
              </div>
              <div>
                <label className="block text-caption font-semibold text-slate uppercase tracking-wider mb-1">Slug</label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm(f => ({ ...f, slug: e.target.value }))}
                  className="w-full px-3 py-2 border border-sand rounded-lg text-body font-mono focus:outline-none focus:ring-2 focus:ring-navy-200"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-caption font-semibold text-slate uppercase tracking-wider mb-1">Nationality</label>
                <input value={form.nationality} onChange={(e) => setForm(f => ({ ...f, nationality: e.target.value }))}
                  className="w-full px-3 py-2 border border-sand rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-navy-200" />
              </div>
              <div>
                <label className="block text-caption font-semibold text-slate uppercase tracking-wider mb-1">Birth Year</label>
                <input type="number" value={form.birthYear} onChange={(e) => setForm(f => ({ ...f, birthYear: e.target.value }))}
                  className="w-full px-3 py-2 border border-sand rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-navy-200" />
              </div>
              <div>
                <label className="block text-caption font-semibold text-slate uppercase tracking-wider mb-1">Death Year</label>
                <input type="number" value={form.deathYear} onChange={(e) => setForm(f => ({ ...f, deathYear: e.target.value }))}
                  placeholder="Leave empty if alive"
                  className="w-full px-3 py-2 border border-sand rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-navy-200" />
              </div>
            </div>

            <div>
              <label className="block text-caption font-semibold text-slate uppercase tracking-wider mb-1">Photo URL</label>
              <input value={form.photoUrl} onChange={(e) => setForm(f => ({ ...f, photoUrl: e.target.value }))}
                className="w-full px-3 py-2 border border-sand rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-navy-200"
                placeholder="https://..." />
            </div>

            <div>
              <label className="block text-caption font-semibold text-slate uppercase tracking-wider mb-1">Short Bio</label>
              <textarea value={form.shortBio} onChange={(e) => setForm(f => ({ ...f, shortBio: e.target.value }))}
                rows={2} className="w-full px-3 py-2 border border-sand rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-navy-200" />
            </div>

            <div>
              <label className="block text-caption font-semibold text-slate uppercase tracking-wider mb-1">Contribution</label>
              <textarea value={form.contribution} onChange={(e) => setForm(f => ({ ...f, contribution: e.target.value }))}
                rows={3} className="w-full px-3 py-2 border border-sand rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-navy-200"
                placeholder="Their key intellectual contribution..." />
            </div>

            <div>
              <label className="block text-caption font-semibold text-slate uppercase tracking-wider mb-1">Full Bio (Markdown)</label>
              <textarea value={form.fullBio} onChange={(e) => setForm(f => ({ ...f, fullBio: e.target.value }))}
                rows={8} className="w-full px-3 py-2 border border-sand rounded-lg text-body font-mono text-small focus:outline-none focus:ring-2 focus:ring-navy-200" />
            </div>

            <div>
              <label className="block text-caption font-semibold text-slate uppercase tracking-wider mb-1">Key Works (JSON)</label>
              <textarea value={form.keyWorks} onChange={(e) => setForm(f => ({ ...f, keyWorks: e.target.value }))}
                rows={4} className="w-full px-3 py-2 border border-sand rounded-lg text-body font-mono text-small focus:outline-none focus:ring-2 focus:ring-navy-200"
                placeholder='[{"title":"...","year":1978,"description":"..."}]' />
            </div>

            <label className="flex items-center gap-2 text-small text-slate cursor-pointer">
              <input type="checkbox" checked={form.published} onChange={(e) => setForm(f => ({ ...f, published: e.target.checked }))} className="rounded border-sand" />
              Published
            </label>

            <div className="flex gap-3 pt-2">
              <button onClick={handleSave} className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy-600 hover:bg-navy-400 text-cream rounded-lg text-small font-medium transition-colors">
                <Save size={14} /> {creating ? 'Create' : 'Save'}
              </button>
              <button onClick={cancel} className="px-5 py-2.5 border border-sand text-slate hover:text-charcoal rounded-lg text-small font-medium transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Thinkers list */}
      <div className="bg-white border border-sand/60 rounded-lg overflow-hidden">
        {loading ? (
          <p className="px-5 py-12 text-center text-muted text-small">Loading...</p>
        ) : thinkers.length === 0 ? (
          <p className="px-5 py-12 text-center text-muted text-small">No thinkers yet.</p>
        ) : (
          <div className="divide-y divide-sand/40">
            {thinkers.map((t) => (
              <div key={t.id} className="px-5 py-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-parchment flex items-center justify-center font-serif text-small text-muted shrink-0">
                  {t.name.split(' ').map(w => w[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-body font-medium text-charcoal truncate">{t.name}</p>
                  <p className="text-caption text-muted truncate">{t.shortBio}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => openEdit(t)} className="p-2 text-muted hover:text-navy-600 transition-colors"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(t.id)} className="p-2 text-muted hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
