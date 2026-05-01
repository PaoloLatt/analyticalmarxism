'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Users, Share2, ArrowLeft } from 'lucide-react';

const ADMIN_NAV = [
  { label: 'Dashboard', href: '/admin',          icon: LayoutDashboard },
  { label: 'Posts',     href: '/admin/posts',    icon: FileText        },
  { label: 'Thinkers',  href: '/admin/thinkers', icon: Users           },
  { label: 'Social',    href: '/admin/social',   icon: Share2          },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  }

  return (
    <aside className="w-[200px] shrink-0 flex flex-col" style={{ backgroundColor: '#18181B' }}>
      {/* Wordmark */}
      <div className="px-5 pt-6 pb-5" style={{ borderBottom: '0.5px solid #27272A' }}>
        <Link href="/admin">
          <p className="text-[0.6rem] font-medium uppercase tracking-[0.2em] text-white leading-snug">
            Analytical<br />Marxism
          </p>
          <p className="text-[0.62rem] mt-1" style={{ color: '#52525B' }}>Admin Panel</p>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3">
        {ADMIN_NAV.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2.5 px-5 py-1.5 text-[0.8rem] transition-colors ${
              isActive(href)
                ? 'text-white font-medium'
                : 'hover:text-white'
            }`}
            style={{ color: isActive(href) ? undefined : '#A1A1AA' }}
          >
            <Icon size={13} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Back to site */}
      <div className="px-5 py-4" style={{ borderTop: '0.5px solid #27272A' }}>
        <Link
          href="/"
          className="flex items-center gap-2 text-[0.72rem] transition-colors hover:text-zinc-400"
          style={{ color: '#52525B' }}
        >
          <ArrowLeft size={12} /> Back to site
        </Link>
      </div>
    </aside>
  );
}
