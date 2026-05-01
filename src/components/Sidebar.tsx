'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { X } from 'lucide-react';

interface ThinkerItem { name: string; slug: string; }

interface SidebarProps {
  thinkers: ThinkerItem[];
  isOpen: boolean;
  onClose: () => void;
}

const NAV = [
  { label: 'Blog',              href: '/blog'             },
  { label: 'Visual Explainers', href: '/visual-explainers'},
  { label: 'Thinkers',          href: '/thinkers'         },
  { label: 'Articles',          href: '/articles'         },
  { label: 'Resources',         href: '/resources'        },
];

export default function Sidebar({ thinkers, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  function isActive(href: string) {
    return pathname === href || (href !== '/' && pathname.startsWith(href + '/'));
  }

  const linkCls = (href: string) =>
    `block px-5 py-1.5 text-[0.8rem] transition-colors ${
      isActive(href) ? 'text-white font-medium' : 'text-zinc-400 hover:text-white'
    }`;

  const content = (
    <div className="flex flex-col h-full bg-[#18181B] overflow-y-auto">
      {/* Wordmark */}
      <div className="flex items-center justify-between px-5 pt-6 pb-5 shrink-0">
        <Link
          href="/"
          onClick={onClose}
          className="text-[0.6rem] font-medium uppercase tracking-[0.2em] text-white leading-snug"
        >
          Analytical<br />Marxism
        </Link>
        <button
          onClick={onClose}
          className="lg:hidden p-1 text-zinc-500 hover:text-white transition-colors"
          aria-label="Close menu"
        >
          <X size={16} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 pb-4">
        {NAV.map(({ label, href }) => (
          <div key={href}>
            <Link href={href} onClick={onClose} className={linkCls(href)}>
              {label}
            </Link>

            {/* Thinker sub-nav — visible when on any /thinkers page */}
            {href === '/thinkers' && isActive('/thinkers') && thinkers.length > 0 && (
              <div className="ml-3 mb-1">
                {thinkers.map((t) => (
                  <Link
                    key={t.slug}
                    href={`/thinkers/${t.slug}`}
                    onClick={onClose}
                    className={`block px-5 py-1 text-[0.73rem] transition-colors ${
                      pathname === `/thinkers/${t.slug}`
                        ? 'text-white'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {t.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Bottom links */}
      <div className="px-5 py-4 border-t border-zinc-800 text-[0.68rem] text-zinc-600 space-y-1.5 shrink-0">
        <Link href="/privacy-policy" className="block hover:text-zinc-400 transition-colors">
          Privacy Policy
        </Link>
        <Link href="/admin" className="block hover:text-zinc-400 transition-colors">
          Admin
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden lg:flex flex-col w-[200px] shrink-0 fixed left-0 top-0 h-screen z-40">
        {content}
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed left-0 top-0 h-screen w-[200px] z-50 lg:hidden transform transition-transform duration-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {content}
      </aside>
    </>
  );
}
