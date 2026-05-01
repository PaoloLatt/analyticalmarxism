'use client';

import { useState, useEffect, useCallback } from 'react';
import { Save, CheckCircle, ExternalLink } from 'lucide-react';

const SOCIAL_KEYS = [
  { key: 'social.twitter',   label: 'Twitter / X',  placeholder: 'https://twitter.com/yourhandle'  },
  { key: 'social.facebook',  label: 'Facebook',      placeholder: 'https://facebook.com/yourpage'   },
  { key: 'social.linkedin',  label: 'LinkedIn',      placeholder: 'https://linkedin.com/company/...' },
  { key: 'social.instagram', label: 'Instagram',     placeholder: 'https://instagram.com/yourhandle' },
  { key: 'social.youtube',   label: 'YouTube',       placeholder: 'https://youtube.com/@yourchannel' },
];

const fieldCls = 'w-full px-3 py-2 border border-zinc-200 rounded text-[0.8125rem] text-zinc-900 bg-white focus:outline-none focus:ring-1 focus:ring-[#E24B4A] focus:border-[#E24B4A]';
const labelCls = 'block text-[0.7rem] font-medium uppercase tracking-wider text-zinc-400 mb-1';

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[0.875rem] font-medium text-zinc-900 mb-4 pb-3" style={{ borderBottom: '0.5px solid #E4E4E7' }}>
      {children}
    </h2>
  );
}

function EnvBadge({ name }: { name: string }) {
  const value = typeof window === 'undefined' ? '' : '';
  return (
    <div className="flex items-center justify-between py-2.5 px-3 bg-zinc-50 rounded border border-zinc-100">
      <div>
        <p className="text-[0.8rem] font-mono text-zinc-700">{name}</p>
        <p className="text-[0.7rem] text-zinc-400 mt-0.5">Set in your hosting environment variables</p>
      </div>
      <a
        href="https://vercel.com/dashboard"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-[0.7rem] text-[#E24B4A] hover:text-[#C73B3A] transition-colors shrink-0 ml-4"
      >
        Manage <ExternalLink size={10} />
      </a>
    </div>
  );
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);

  const load = useCallback(async () => {
    const res  = await fetch('/api/settings');
    const data = await res.json();
    setSettings(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const set = (key: string, value: string) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  const save = async () => {
    setSaving(true);
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) return <p className="text-[0.8125rem] text-zinc-400">Loading…</p>;

  return (
    <div className="max-w-2xl space-y-10">
      <div>
        <h1 className="text-[1.25rem] font-medium text-zinc-900 mb-1">Settings</h1>
        <p className="text-[0.8125rem] text-zinc-400">
          Configure social links, tracking, and site metadata.
        </p>
      </div>

      {/* ── Social Links ── */}
      <section>
        <SectionHeading>Social Links</SectionHeading>
        <div className="space-y-3">
          {SOCIAL_KEYS.map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className={labelCls}>{label}</label>
              <input
                type="url"
                value={settings[key] ?? ''}
                onChange={(e) => set(key, e.target.value)}
                placeholder={placeholder}
                className={fieldCls}
              />
            </div>
          ))}
        </div>
        <p className="text-[0.7rem] text-zinc-400 mt-2">
          These URLs appear in the top bar social icons. Changes take effect on the next page load.
        </p>
      </section>

      {/* ── Site Info ── */}
      <section>
        <SectionHeading>Site Info</SectionHeading>
        <div>
          <label className={labelCls}>Tagline</label>
          <input
            type="text"
            value={settings['site.tagline'] ?? ''}
            onChange={(e) => set('site.tagline', e.target.value)}
            placeholder="Clarity about capitalism"
            className={fieldCls}
          />
        </div>
      </section>

      {/* ── Tracking ── */}
      <section>
        <SectionHeading>Tracking &amp; Analytics</SectionHeading>
        <div className="space-y-2">
          <EnvBadge name="NEXT_PUBLIC_GTM_ID" />
          <EnvBadge name="NEXT_PUBLIC_GA4_ID" />
        </div>
        <div className="mt-4 bg-zinc-50 border border-zinc-100 rounded p-4 text-[0.78rem] text-zinc-600 leading-relaxed">
          <p className="font-medium text-zinc-900 mb-1">How tracking works</p>
          <p>
            GTM and GA4 are loaded only after a visitor accepts analytics cookies.
            Set <code className="font-mono bg-zinc-100 px-1 py-0.5 rounded text-[0.72rem]">NEXT_PUBLIC_GTM_ID</code> and{' '}
            <code className="font-mono bg-zinc-100 px-1 py-0.5 rounded text-[0.72rem]">NEXT_PUBLIC_GA4_ID</code>{' '}
            in your{' '}
            <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-[#E24B4A] underline">
              Vercel environment variables
            </a>{' '}
            and redeploy. No code changes required.
          </p>
        </div>
      </section>

      {/* ── Cookie Consent ── */}
      <section>
        <SectionHeading>Cookie Consent</SectionHeading>
        <div className="bg-zinc-50 border border-zinc-100 rounded p-4 text-[0.78rem] text-zinc-600 leading-relaxed space-y-2">
          <p className="font-medium text-zinc-900">Three consent categories</p>
          <ul className="space-y-1 list-disc ml-4">
            <li><strong>Necessary</strong> — always active, stores the consent cookie itself</li>
            <li><strong>Analytics</strong> — controls GTM / GA4 loading</li>
            <li><strong>Social</strong> — controls visibility of share buttons</li>
          </ul>
          <p className="mt-2">
            Consent is stored as a browser cookie (<code className="font-mono bg-zinc-100 px-1 py-0.5 rounded text-[0.72rem]">cookie_consent</code>) with a 365-day expiry.
            Visitors can update preferences at any time via the "Cookie Settings" link in the footer.
          </p>
        </div>
      </section>

      {/* ── Save ── */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2 bg-[#E24B4A] hover:bg-[#C73B3A] text-white text-[0.8125rem] font-medium rounded transition-colors disabled:opacity-50"
        >
          <Save size={13} /> {saving ? 'Saving…' : 'Save Changes'}
        </button>
        {saved && (
          <span className="flex items-center gap-1.5 text-[0.78rem] text-emerald-600">
            <CheckCircle size={13} /> Saved
          </span>
        )}
      </div>
    </div>
  );
}
