'use client';

import { useEffect, useState } from 'react';
import { Twitter, Linkedin, Link2, Check } from 'lucide-react';
import { track } from '@/lib/analytics';

interface ShareButtonsProps {
  title: string;
  slug: string;
}

function FacebookIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function hasSocialConsent() {
  if (typeof document === 'undefined') return false;
  const match = document.cookie.match(/(?:^|;\s*)cookie_consent=([^;]+)/);
  if (!match) return false;
  try { return JSON.parse(decodeURIComponent(match[1]))?.social === true; }
  catch { return false; }
}

export default function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied]   = useState(false);
  const [consent, setConsent] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setConsent(hasSocialConsent());
    const sync = () => setConsent(hasSocialConsent());
    window.addEventListener('cookieConsentUpdated', sync);
    return () => window.removeEventListener('cookieConsentUpdated', sync);
  }, []);

  if (!mounted) return null;

  const url  = typeof window !== 'undefined' ? `${window.location.origin}/blog/${slug}` : `/blog/${slug}`;
  const enc  = encodeURIComponent;
  const links = {
    twitter:  `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`,
  };

  function handleShare(platform: string, href: string) {
    track.shareClicked(platform, slug);
    window.open(href, '_blank', 'noopener,noreferrer,width=600,height=450');
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  const btn =
    'inline-flex items-center gap-1.5 px-2.5 py-1 text-[0.73rem] font-medium rounded border border-zinc-200 text-zinc-500 hover:border-zinc-400 hover:text-zinc-900 transition-colors';

  if (!consent) {
    return (
      <div className="text-[0.73rem] text-zinc-400 border border-zinc-200 rounded px-3 py-2">
        Enable social cookies in{' '}
        <button
          onClick={() => document.getElementById('open-cookie-settings')?.click()}
          className="text-[#E24B4A] underline"
        >
          Cookie Settings
        </button>{' '}
        to share this post.
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-[0.65rem] font-medium uppercase tracking-widest text-zinc-400 mr-1">
        Share:
      </span>
      <button onClick={() => handleShare('twitter', links.twitter)} className={btn}>
        <Twitter size={12} /> Twitter/X
      </button>
      <button onClick={() => handleShare('facebook', links.facebook)} className={btn}>
        <FacebookIcon /> Facebook
      </button>
      <button onClick={() => handleShare('linkedin', links.linkedin)} className={btn}>
        <Linkedin size={12} /> LinkedIn
      </button>
      <button onClick={copyLink} className={btn}>
        {copied ? <Check size={12} /> : <Link2 size={12} />}
        {copied ? 'Copied!' : 'Copy link'}
      </button>
    </div>
  );
}
