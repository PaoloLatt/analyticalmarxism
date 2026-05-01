'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const PATH_LABELS: Record<string, string> = {
  blog:                'Blog',
  'visual-explainers': 'Visual Explainers',
  thinkers:            'Thinkers',
  articles:            'Articles',
  resources:           'Resources',
  'privacy-policy':    'Privacy Policy',
  admin:               'Admin',
};

function humanize(seg: string): string {
  return PATH_LABELS[seg] ?? seg.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function Breadcrumb() {
  const pathname  = usePathname();
  const segments  = pathname.split('/').filter(Boolean);

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1 flex-1 min-w-0 overflow-hidden"
      style={{ fontSize: '11px', color: '#A1A1AA' }}
    >
      <Link href="/" className="hover:text-zinc-900 transition-colors shrink-0">
        Home
      </Link>
      {segments.map((seg, i) => {
        const href   = '/' + segments.slice(0, i + 1).join('/');
        const isLast = i === segments.length - 1;
        return (
          <span key={href} className="flex items-center gap-1 min-w-0">
            <span className="mx-0.5" style={{ color: '#D4D4D8' }}>/</span>
            {isLast ? (
              <span className="text-zinc-900 font-medium truncate">{humanize(seg)}</span>
            ) : (
              <Link href={href} className="hover:text-zinc-900 transition-colors shrink-0">
                {humanize(seg)}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
