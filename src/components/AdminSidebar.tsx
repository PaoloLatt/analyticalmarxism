'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Users, Share2, ArrowLeft } from 'lucide-react';

const ADMIN_NAV = [
  { label: 'Dashboard', href: '/admin',           icon: LayoutDashboard },
  { label: 'Posts',     href: '/admin/posts',     icon: FileText        },
  { label: 'Thinkers',  href: '/admin/thinkers',  icon: Users           },
  { label: 'Social',    href: '/admin/social',    icon: Share2          },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  }

  return (
    <aside className="w-52 shrink-0 bg-charcoal text-parchment flex flex-col">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-slate/20">
        <Link href="/admin" className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded bg-burgundy-600 flex items-center justify-center text-white font-serif font-bold text-xs shrink-0">
            AM
          </span>
          <div>
            <p className="text-[0.78rem] font-serif font-semibold text-cream leading-tight">
              Analytical Marxism
            </p>
            <p className="text-[0.65rem] text-sand/60 mt-0.5">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2.5 space-y-0.5">
        {ADMIN_NAV.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2.5 px-3 py-2 rounded text-[0.8125rem] font-medium transition-colors ${
              isActive(href)
                ? 'bg-burgundy-700 text-cream'
                : 'text-sand/70 hover:bg-white/10 hover:text-cream'
            }`}
          >
            <Icon size={14} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Back to site */}
      <div className="p-4 border-t border-slate/20">
        <Link
          href="/"
          className="flex items-center gap-2 text-[0.75rem] text-sand/60 hover:text-sand transition-colors"
        >
          <ArrowLeft size={13} /> Back to site
        </Link>
      </div>
    </aside>
  );
}
