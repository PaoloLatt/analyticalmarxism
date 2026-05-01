'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronDown, X } from 'lucide-react';

interface ThinkerItem { name: string; slug: string; }

interface SidebarProps {
  thinkers: ThinkerItem[];
  isOpen: boolean;
  onClose: () => void;
}

interface NavSection {
  key: string;
  label: string;
  href: string;
  children: { label: string; href: string }[];
}

export default function Sidebar({ thinkers, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const sections: NavSection[] = [
    {
      key: 'blog',
      label: 'Blog & Commentary',
      href: '/blog',
      children: [
        { label: 'Explainers', href: '/blog?cat=explainer'  },
        { label: 'Commentary', href: '/blog?cat=commentary' },
        { label: 'Readings',   href: '/blog?cat=reading'    },
      ],
    },
    {
      key: 'visual-explainers',
      label: 'Visual Explainers',
      href: '/visual-explainers',
      children: [],
    },
    {
      key: 'thinkers',
      label: 'Thinkers',
      href: '/thinkers',
      children: thinkers.map((t) => ({ label: t.name, href: `/thinkers/${t.slug}` })),
    },
    {
      key: 'articles',
      label: 'Articles & Essays',
      href: '/articles',
      children: [],
    },
    {
      key: 'resources',
      label: 'Resources',
      href: '/resources',
      children: [
        { label: 'Reading Lists', href: '/resources#reading-lists' },
        { label: 'Glossary',      href: '/resources#glossary'      },
      ],
    },
  ];

  function activeSection() {
    const seg = pathname.split('/').filter(Boolean)[0] ?? '';
    return seg;
  }

  const [openSections, setOpenSections] = useState<Set<string>>(() => {
    const s = new Set<string>();
    const seg = pathname.split('/').filter(Boolean)[0] ?? '';
    if (['blog', 'thinkers', 'resources'].includes(seg)) s.add(seg);
    return s;
  });

  useEffect(() => {
    const seg = pathname.split('/').filter(Boolean)[0] ?? '';
    if (['blog', 'thinkers', 'resources'].includes(seg)) {
      setOpenSections((prev) => new Set([...prev, seg]));
    }
  }, [pathname]);

  function toggle(key: string) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  function isActive(href: string) {
    const base = href.split('?')[0].split('#')[0];
    return pathname === base || (base !== '/' && pathname.startsWith(base + '/'));
  }

  function isChildActive(href: string) {
    const base = href.split('?')[0].split('#')[0];
    return pathname === base;
  }

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
        {sections.map(({ key, label, href, children }) => {
          const active   = isActive(href);
          const expanded = openSections.has(key);
          const hasKids  = children.length > 0;

          return (
            <div key={key}>
              <div className="flex items-center">
                <Link
                  href={href}
                  onClick={onClose}
                  className={`flex-1 px-5 py-1.5 text-[0.8rem] transition-colors ${
                    active ? 'text-white font-medium' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {label}
                </Link>
                {hasKids && (
                  <button
                    onClick={() => toggle(key)}
                    className="px-3 py-1.5 text-zinc-600 hover:text-zinc-300 transition-colors"
                    aria-label={expanded ? 'Collapse' : 'Expand'}
                  >
                    <ChevronDown
                      size={11}
                      className={`transition-transform duration-150 ${expanded ? 'rotate-0' : '-rotate-90'}`}
                    />
                  </button>
                )}
              </div>

              {hasKids && expanded && (
                <div className="ml-3 mb-1">
                  {children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={onClose}
                      className={`block px-5 py-1 text-[0.73rem] transition-colors ${
                        isChildActive(child.href)
                          ? 'text-white'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
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
