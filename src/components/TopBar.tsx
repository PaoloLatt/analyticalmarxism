'use client';

import { Menu, Twitter, Linkedin, Youtube } from 'lucide-react';
import { SOCIAL_LINKS } from '@/lib/config';
import Breadcrumb from './Breadcrumb';

interface TopBarProps {
  onMenuClick: () => void;
}

function FacebookIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

const SOCIAL_ICONS = [
  { key: 'twitter',   Icon: () => <Twitter size={16} />,   href: SOCIAL_LINKS.twitter,   label: 'Twitter / X' },
  { key: 'facebook',  Icon: () => <FacebookIcon />,         href: SOCIAL_LINKS.facebook,  label: 'Facebook'    },
  { key: 'instagram', Icon: () => <InstagramIcon />,        href: SOCIAL_LINKS.instagram, label: 'Instagram'   },
  { key: 'linkedin',  Icon: () => <Linkedin size={16} />,  href: SOCIAL_LINKS.linkedin,  label: 'LinkedIn'    },
  { key: 'youtube',   Icon: () => <Youtube size={16} />,   href: SOCIAL_LINKS.youtube,   label: 'YouTube'     },
];

export default function TopBar({ onMenuClick }: TopBarProps) {
  return (
    <header
      className="sticky top-0 z-30 h-12 flex items-center bg-white px-4 gap-3 shrink-0"
      style={{ borderBottom: '0.5px solid #E4E4E7' }}
    >
      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-1 text-zinc-400 hover:text-zinc-900 shrink-0 transition-colors"
        aria-label="Open navigation"
      >
        <Menu size={18} />
      </button>

      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Social icons */}
      <div className="hidden sm:flex items-center gap-0.5 shrink-0">
        {SOCIAL_ICONS.map(({ key, Icon, href, label }) => (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="p-1.5 transition-colors"
            style={{ color: '#A1A1AA' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#18181B')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#A1A1AA')}
          >
            <Icon />
          </a>
        ))}
      </div>
    </header>
  );
}
