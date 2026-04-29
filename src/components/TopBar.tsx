'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, Search, Twitter, Linkedin, Youtube } from 'lucide-react';
import { SOCIAL_LINKS } from '@/lib/config';

interface TopBarProps {
  onMenuClick: () => void;
}

const PATH_LABELS: Record<string, string> = {
  blog:                'Blog & Commentary',
  'visual-explainers': 'Visual Explainers',
  thinkers:            'Thinkers',
  articles:            'Articles & Essays',
  resources:           'Resources',
  'privacy-policy':    'Privacy Policy',
};

function humanize(segment: string): string {
  return PATH_LABELS[segment] ?? segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

/* Simple SVG icons for platforms not in lucide-react */
function FacebookIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

const SOCIAL_ICONS = [
  { key: 'twitter',   Icon: () => <Twitter   size={13} />, href: SOCIAL_LINKS.twitter.href,   label: SOCIAL_LINKS.twitter.label   },
  { key: 'facebook',  Icon: () => <FacebookIcon />,        href: SOCIAL_LINKS.facebook.href,  label: SOCIAL_LINKS.facebook.label  },
  { key: 'instagram', Icon: () => <InstagramIcon />,       href: SOCIAL_LINKS.instagram.href, label: SOCIAL_LINKS.instagram.label },
  { key: 'linkedin',  Icon: () => <Linkedin  size={13} />, href: SOCIAL_LINKS.linkedin.href,  label: SOCIAL_LINKS.linkedin.label  },
  { key: 'youtube',   Icon: () => <Youtube   size={13} />, href: SOCIAL_LINKS.youtube.href,   label: SOCIAL_LINKS.youtube.label   },
];

export default function TopBar({ onMenuClick }: TopBarProps) {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  return (
    <header className="sticky top-0 z-30 h-11 flex items-center bg-cream/95 backdrop-blur-sm border-b border-sand px-4 gap-3 shrink-0">
      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-1 text-slate hover:text-charcoal shrink-0"
        aria-label="Open navigation"
      >
        <Menu size={18} />
      </button>

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-[0.73rem] text-muted flex-1 min-w-0 overflow-hidden">
        <Link href="/" className="hover:text-charcoal transition-colors shrink-0">
          Home
        </Link>
        {segments.map((seg, i) => {
          const href  = '/' + segments.slice(0, i + 1).join('/');
          const isLast = i === segments.length - 1;
          return (
            <span key={href} className="flex items-center gap-1 min-w-0">
              <span className="text-sand/70 mx-0.5">/</span>
              {isLast ? (
                <span className="text-charcoal font-medium truncate">{humanize(seg)}</span>
              ) : (
                <Link href={href} className="hover:text-charcoal transition-colors shrink-0">
                  {humanize(seg)}
                </Link>
              )}
            </span>
          );
        })}
      </nav>

      {/* Right: search + social */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          className="p-1 text-muted hover:text-charcoal transition-colors"
          aria-label="Search"
        >
          <Search size={15} />
        </button>
        <div className="hidden sm:flex items-center gap-1.5 border-l border-sand pl-2.5">
          {SOCIAL_ICONS.map(({ key, Icon, href, label }) => (
            <a
              key={key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="p-1 text-muted hover:text-burgundy-600 transition-colors"
            >
              <Icon />
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
