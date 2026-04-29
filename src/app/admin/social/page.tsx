'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Send, Twitter, Linkedin, Youtube, Globe } from 'lucide-react';

interface SocialAccount {
  id: string;
  platform: string;
  accountName: string;
  enabled: boolean;
  createdAt: string;
}

interface SocialPost {
  id: string;
  platform: string;
  content: string;
  status: string;
  publishedAt: string | null;
  externalId: string | null;
  createdAt: string;
  account?: SocialAccount;
}

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  twitter:  <Twitter  size={14} />,
  linkedin: <Linkedin size={14} />,
  facebook: <Globe    size={14} />,
};

const STATUS_STYLES: Record<string, string> = {
  draft:     'bg-sand text-slate',
  scheduled: 'bg-amber-100 text-amber-800',
  published: 'bg-emerald-100 text-emerald-800',
  failed:    'bg-red-100 text-red-700',
};

export default function AdminSocialPage() {
  const [accounts, setAccounts]       = useState<SocialAccount[]>([]);
  const [posts, setPosts]             = useState<SocialPost[]>([]);
  const [loading, setLoading]         = useState(true);

  // New account form
  const [newPlatform,     setNewPlatform]     = useState('twitter');
  const [newAccountName,  setNewAccountName]  = useState('');

  // Compose form
  const [composePlatform, setComposePlatform] = useState('twitter');
  const [composeContent,  setComposeContent]  = useState('');
  const [composePostId,   setComposePostId]   = useState('');
  const [publishing,      setPublishing]      = useState(false);

  const load = useCallback(async () => {
    const [acRes, poRes] = await Promise.all([
      fetch('/api/social/accounts'),
      fetch('/api/social/posts'),
    ]);
    setAccounts(await acRes.json());
    setPosts(await poRes.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function addAccount() {
    if (!newAccountName.trim()) return;
    await fetch('/api/social/accounts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ platform: newPlatform, accountName: newAccountName }),
    });
    setNewAccountName('');
    load();
  }

  async function removeAccount(id: string) {
    await fetch('/api/social/accounts', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    load();
  }

  async function composePost(publish: boolean) {
    if (!composeContent.trim()) return;
    setPublishing(true);
    const res = await fetch('/api/social/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        platform: composePlatform,
        content:  composeContent,
        postId:   composePostId || null,
      }),
    });
    const created: SocialPost = await res.json();

    if (publish) {
      // TODO: wire to actual platform OAuth flow
      await fetch('/api/social/posts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: created.id, action: 'publish' }),
      });
    }

    setComposeContent('');
    setComposePostId('');
    setPublishing(false);
    load();
  }

  async function deletePost(id: string) {
    await fetch('/api/social/posts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'delete' }),
    });
    load();
  }

  if (loading) {
    return <p className="text-small text-muted">Loading…</p>;
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="font-serif text-[1.4rem] font-bold text-charcoal mb-1">
          Social Media
        </h1>
        <p className="text-small text-muted">
          Manage connected accounts and compose posts. OAuth integration is
          stubbed — see API routes for TODO comments on platform API calls.
        </p>
      </div>

      {/* ── Connected accounts ── */}
      <section>
        <h2 className="font-serif text-[1rem] font-semibold text-charcoal mb-3">
          Connected Accounts
        </h2>

        {accounts.length > 0 ? (
          <ul className="divide-y divide-sand border border-sand rounded mb-4 bg-white">
            {accounts.map((acc) => (
              <li key={acc.id} className="flex items-center gap-3 px-4 py-3">
                <span className="text-muted">{PLATFORM_ICONS[acc.platform] ?? <Globe size={14} />}</span>
                <span className="text-[0.8125rem] font-medium text-charcoal flex-1">
                  {acc.accountName}
                </span>
                <span className="text-[0.72rem] text-muted capitalize">{acc.platform}</span>
                <button
                  onClick={() => removeAccount(acc.id)}
                  className="p-1 text-muted hover:text-red-600 transition-colors"
                  aria-label="Remove account"
                >
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-small text-muted mb-4">No accounts connected yet.</p>
        )}

        {/* Add account */}
        <div className="flex gap-2 items-end">
          <div>
            <label className="block text-[0.72rem] text-muted mb-1">Platform</label>
            <select
              value={newPlatform}
              onChange={(e) => setNewPlatform(e.target.value)}
              className="border border-sand rounded px-2 py-1.5 text-small bg-white"
            >
              <option value="twitter">Twitter / X</option>
              <option value="facebook">Facebook</option>
              <option value="linkedin">LinkedIn</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-[0.72rem] text-muted mb-1">Account name / handle</label>
            <input
              type="text"
              value={newAccountName}
              onChange={(e) => setNewAccountName(e.target.value)}
              placeholder="@handle or page name"
              className="w-full border border-sand rounded px-3 py-1.5 text-small bg-white"
            />
          </div>
          <button
            onClick={addAccount}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-burgundy-600 hover:bg-burgundy-500 text-cream text-small font-medium rounded transition-colors"
          >
            <Plus size={14} /> Add
          </button>
        </div>
        <p className="text-[0.7rem] text-muted mt-2">
          Note: actual OAuth token setup requires platform-specific implementation (see API route TODOs).
        </p>
      </section>

      {/* ── Compose ── */}
      <section>
        <h2 className="font-serif text-[1rem] font-semibold text-charcoal mb-3">
          Compose Post
        </h2>
        <div className="border border-sand rounded bg-white p-4 space-y-3">
          <div className="flex gap-3">
            <div>
              <label className="block text-[0.72rem] text-muted mb-1">Platform</label>
              <select
                value={composePlatform}
                onChange={(e) => setComposePlatform(e.target.value)}
                className="border border-sand rounded px-2 py-1.5 text-small bg-white"
              >
                <option value="twitter">Twitter / X</option>
                <option value="facebook">Facebook</option>
                <option value="linkedin">LinkedIn</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-[0.72rem] text-muted mb-1">
                Linked post ID (optional)
              </label>
              <input
                type="text"
                value={composePostId}
                onChange={(e) => setComposePostId(e.target.value)}
                placeholder="Blog post cuid…"
                className="w-full border border-sand rounded px-3 py-1.5 text-small bg-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-[0.72rem] text-muted mb-1">Content</label>
            <textarea
              rows={4}
              value={composeContent}
              onChange={(e) => setComposeContent(e.target.value)}
              maxLength={280}
              placeholder="What do you want to share?"
              className="w-full border border-sand rounded px-3 py-2 text-small bg-white resize-none"
            />
            <p className="text-[0.7rem] text-muted text-right mt-0.5">
              {composeContent.length} / 280
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => composePost(false)}
              disabled={publishing}
              className="flex items-center gap-1.5 px-4 py-1.5 border border-sand text-slate text-small font-medium rounded hover:bg-parchment transition-colors disabled:opacity-50"
            >
              Save as Draft
            </button>
            <button
              onClick={() => composePost(true)}
              disabled={publishing}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-burgundy-600 hover:bg-burgundy-500 text-cream text-small font-medium rounded transition-colors disabled:opacity-50"
            >
              <Send size={13} /> {publishing ? 'Publishing…' : 'Publish Now'}
            </button>
          </div>
        </div>
      </section>

      {/* ── Post history ── */}
      <section>
        <h2 className="font-serif text-[1rem] font-semibold text-charcoal mb-3">
          Post History
        </h2>
        {posts.length === 0 ? (
          <p className="text-small text-muted">No posts yet.</p>
        ) : (
          <ul className="divide-y divide-sand border border-sand rounded bg-white">
            {posts.map((p) => (
              <li key={p.id} className="px-4 py-3 flex items-start gap-3">
                <span className="text-muted mt-0.5">{PLATFORM_ICONS[p.platform] ?? <Globe size={14} />}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[0.8125rem] text-charcoal truncate">{p.content}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[0.65rem] px-1.5 py-0.5 rounded font-medium ${STATUS_STYLES[p.status] ?? ''}`}>
                      {p.status}
                    </span>
                    <span className="text-[0.68rem] text-muted">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => deletePost(p.id)}
                  className="p-1 text-muted hover:text-red-600 transition-colors shrink-0 mt-0.5"
                  aria-label="Delete post"
                >
                  <Trash2 size={13} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
