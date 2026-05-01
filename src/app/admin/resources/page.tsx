'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';

interface Resource { id: string; title: string; description: string | null; url: string | null; type: string; difficulty: string; }
interface GlossaryTerm { id: string; term: string; definition: string; relatedTerms: string | null; }

const EMPTY_R = { title: '', description: '', url: '', type: 'book', difficulty: 'introductory' };
const EMPTY_G = { term: '', definition: '', relatedTerms: '' };

const fieldCls = 'w-full px-3 py-2 border border-sand rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-burgundy-200';
const labelCls = 'block text-caption font-semibold text-slate uppercase tracking-wider mb-1';

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [glossary, setGlossary] = useState<GlossaryTerm[]>([]);
  const [editR, setEditR] = useState<string | null>(null);
  const [createR, setCreateR] = useState(false);
  const [formR, setFormR] = useState(EMPTY_R);
  const [editG, setEditG] = useState<string | null>(null);
  const [createG, setCreateG] = useState(false);
  const [formG, setFormG] = useState(EMPTY_G);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const [rRes, gRes] = await Promise.all([fetch('/api/resources'), fetch('/api/glossary')]);
    setResources(await rRes.json());
    setGlossary(await gRes.json());
    setLoading(false);
  };
  useEffect(() => { fetchData(); }, []);

  // ── Resources CRUD ──
  const saveResource = async () => {
    const payload = { ...formR, description: formR.description || null, url: formR.url || null };
    if (createR) await fetch('/api/resources', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    else if (editR) await fetch(`/api/resources/${editR}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    setCreateR(false); setEditR(null); setFormR(EMPTY_R); fetchData();
  };
  const deleteResource = async (id: string) => {
    if (!confirm('Delete this resource?')) return;
    await fetch(`/api/resources/${id}`, { method: 'DELETE' }); fetchData();
  };

  // ── Glossary CRUD ──
  const saveGlossary = async () => {
    const payload = { ...formG, relatedTerms: formG.relatedTerms || null };
    if (createG) await fetch('/api/glossary', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    else if (editG) await fetch(`/api/glossary/${editG}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    setCreateG(false); setEditG(null); setFormG(EMPTY_G); fetchData();
  };
  const deleteGlossary = async (id: string) => {
    if (!confirm('Delete this term?')) return;
    await fetch(`/api/glossary/${id}`, { method: 'DELETE' }); fetchData();
  };

  if (loading) return <p className="text-muted text-small">Loading…</p>;

  return (
    <div className="space-y-12">

      {/* ── Reading Resources ── */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-headline font-semibold text-charcoal">Reading Resources</h2>
          <button onClick={() => { setEditR(null); setFormR(EMPTY_R); setCreateR(true); }} className="inline-flex items-center gap-2 px-4 py-2.5 bg-burgundy-600 hover:bg-burgundy-500 text-cream rounded-lg text-small font-medium transition-colors">
            <Plus size={14} /> Add Resource
          </button>
        </div>

        {(createR || editR) && (
          <div className="bg-white border border-sand/60 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-sans font-semibold text-body text-charcoal">{createR ? 'Add Resource' : 'Edit Resource'}</h3>
              <button onClick={() => { setCreateR(false); setEditR(null); setFormR(EMPTY_R); }} className="text-muted hover:text-charcoal"><X size={18} /></button>
            </div>
            <div className="grid gap-4">
              <div>
                <label className={labelCls}>Title</label>
                <input value={formR.title} onChange={e => setFormR(f => ({ ...f, title: e.target.value }))} className={fieldCls} placeholder="Book or resource title" />
              </div>
              <div>
                <label className={labelCls}>Description</label>
                <textarea value={formR.description} onChange={e => setFormR(f => ({ ...f, description: e.target.value }))} rows={2} className={fieldCls} placeholder="Short description…" />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>URL (optional)</label>
                  <input type="url" value={formR.url} onChange={e => setFormR(f => ({ ...f, url: e.target.value }))} className={fieldCls} placeholder="https://…" />
                </div>
                <div>
                  <label className={labelCls}>Type</label>
                  <select value={formR.type} onChange={e => setFormR(f => ({ ...f, type: e.target.value }))} className={fieldCls}>
                    <option value="book">Book</option>
                    <option value="paper">Paper</option>
                    <option value="video">Video</option>
                    <option value="course">Course</option>
                    <option value="website">Website</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Difficulty</label>
                  <select value={formR.difficulty} onChange={e => setFormR(f => ({ ...f, difficulty: e.target.value }))} className={fieldCls}>
                    <option value="introductory">Introductory</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <button onClick={saveResource} className="inline-flex items-center gap-2 px-5 py-2.5 bg-burgundy-600 hover:bg-burgundy-500 text-cream rounded-lg text-small font-medium transition-colors"><Save size={14} /> {createR ? 'Add' : 'Save'}</button>
                <button onClick={() => { setCreateR(false); setEditR(null); setFormR(EMPTY_R); }} className="px-5 py-2.5 border border-sand text-slate hover:text-charcoal rounded-lg text-small font-medium transition-colors">Cancel</button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white border border-sand/60 rounded-lg overflow-hidden">
          {resources.length === 0 ? (
            <p className="px-5 py-10 text-center text-muted text-small">No resources yet.</p>
          ) : (
            <div className="divide-y divide-sand/40">
              {resources.map(r => (
                <div key={r.id} className="px-5 py-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-body font-medium text-charcoal truncate">{r.title}</p>
                    <p className="text-caption text-muted">{r.type} · {r.difficulty}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => { setCreateR(false); setEditR(r.id); setFormR({ title: r.title, description: r.description ?? '', url: r.url ?? '', type: r.type, difficulty: r.difficulty }); }} className="p-2 text-muted hover:text-burgundy-600 transition-colors"><Pencil size={14} /></button>
                    <button onClick={() => deleteResource(r.id)} className="p-2 text-muted hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Glossary ── */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-headline font-semibold text-charcoal">Glossary</h2>
          <button onClick={() => { setEditG(null); setFormG(EMPTY_G); setCreateG(true); }} className="inline-flex items-center gap-2 px-4 py-2.5 bg-navy-600 hover:bg-navy-400 text-cream rounded-lg text-small font-medium transition-colors">
            <Plus size={14} /> Add Term
          </button>
        </div>

        {(createG || editG) && (
          <div className="bg-white border border-sand/60 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-sans font-semibold text-body text-charcoal">{createG ? 'Add Term' : 'Edit Term'}</h3>
              <button onClick={() => { setCreateG(false); setEditG(null); setFormG(EMPTY_G); }} className="text-muted hover:text-charcoal"><X size={18} /></button>
            </div>
            <div className="grid gap-4">
              <div>
                <label className={labelCls}>Term</label>
                <input value={formG.term} onChange={e => setFormG(f => ({ ...f, term: e.target.value }))} className={fieldCls} placeholder="e.g. Exploitation" />
              </div>
              <div>
                <label className={labelCls}>Definition</label>
                <textarea value={formG.definition} onChange={e => setFormG(f => ({ ...f, definition: e.target.value }))} rows={4} className={fieldCls} placeholder="Clear, concise definition…" />
              </div>
              <div>
                <label className={labelCls}>Related Terms (comma-separated, optional)</label>
                <input value={formG.relatedTerms} onChange={e => setFormG(f => ({ ...f, relatedTerms: e.target.value }))} className={fieldCls} placeholder="Class, Labour Theory of Value" />
              </div>
              <div className="flex gap-3 pt-1">
                <button onClick={saveGlossary} className="inline-flex items-center gap-2 px-5 py-2.5 bg-burgundy-600 hover:bg-burgundy-500 text-cream rounded-lg text-small font-medium transition-colors"><Save size={14} /> {createG ? 'Add' : 'Save'}</button>
                <button onClick={() => { setCreateG(false); setEditG(null); setFormG(EMPTY_G); }} className="px-5 py-2.5 border border-sand text-slate hover:text-charcoal rounded-lg text-small font-medium transition-colors">Cancel</button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white border border-sand/60 rounded-lg overflow-hidden">
          {glossary.length === 0 ? (
            <p className="px-5 py-10 text-center text-muted text-small">No glossary terms yet.</p>
          ) : (
            <div className="divide-y divide-sand/40">
              {glossary.map(g => (
                <div key={g.id} className="px-5 py-4 flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-body font-medium text-charcoal">{g.term}</p>
                    <p className="text-caption text-muted line-clamp-2">{g.definition}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 mt-0.5">
                    <button onClick={() => { setCreateG(false); setEditG(g.id); setFormG({ term: g.term, definition: g.definition, relatedTerms: g.relatedTerms ?? '' }); }} className="p-2 text-muted hover:text-burgundy-600 transition-colors"><Pencil size={14} /></button>
                    <button onClick={() => deleteGlossary(g.id)} className="p-2 text-muted hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
