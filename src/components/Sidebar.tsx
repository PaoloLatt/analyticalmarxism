'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  BookOpen, BarChart3, Users, FileText, Library, ChevronDown, X,
} from 'lucide-react';

interface ThinkerItem { name: string; slug: string; }

interface SidebarProps {
  thinkers: ThinkerItem[];
  isOpen: boolean;
  onClose: () => void;
}

interface NavChild { label: string; href: string; }

interface NavSection {
  key: string;
  label: string;
  href: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  children: NavChild[];
}

export default function Sidebar({ thinkers, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const sections: NavSection[] = [
    {
      key: 'blog',
      label: 'Blog & Commentary',
      href: '/blog',
      Icon: BookOpen,
      children: [
        { label: 'Explainers', href: '/blog?cat=explainer' },
        { label: 'Commentary', href: '/blog?cat=commentary' },
        { label: 'Readings',   href: '/blog?cat=reading'   },
      ],
    },
    {
      key: 'visual-explainers',
      label: 'Visual Explainers',
      href: '/visual-explainers',
      Icon: BarChart3,
      children: [],
    },
    {
      key: 'thinkers',
      label: 'Thinkers',
      href: '/thinkers',
      Icon: Users,
      children: thinkers.map((t) => ({ label: t.name, href: `/thinkers/${t.slug}` })),
    },
    {
      key: 'articles',
      label: 'Articles & Essays',
      href: '/articles',
      Icon: FileText,
      children: [],
    },
    {
      key: 'resources',
      label: 'Resources',
      href: '/resources',
      Icon: Library,
      children: [
        { label: 'Reading Lists', href: '/resources#reading-lists' },
        { label: 'Glossary',      href: '/resources#glossary'      },
      ],
    },
  ];

  const [openSections, setOpenSections] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    const seg = pathname.split('/').filter(Boolean)[0] ?? '';
    if (seg === 'blog') initial.add('blog');
    if (seg === 'thinkers') initial.add('thinkers');
    if (seg === 'resources') initial.add('resources');
    return initial;
  });

  useEffect(() => {
    const seg = pathname.split('/').filter(Boolean)[0] ?? '';
    if (['blog', 'thinkers', 'resources'].includes(seg)) {
      setOpenSections((prev) => new Set([...prev, seg]));
    }
  }, [pathname]);

  function toggleSection(key: string) {
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
    <div className="flex flex-col h-full overflow-y-auto bg-cream border-r border-sand">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-sand shrink-0">
        <Link href="/" className="flex items-center gap-2.5" onClick={onClose}>
          <span className="w-7 h-7 rounded bg-burgundy-600 flex items-center justify-center text-white font-serif font-bold text-xs shrink-0">
            AM
          </span>
          <span className="font-serif text-[0.9rem] font-semibold leading-tight text-charcoal">
            Analytical<br />Marxism
          </span>
        </Link>
        <button
          onClick={onClose}
          className="lg:hidden p-1 text-muted hover:text-charcoal"
          aria-label="Close menu"
        >
          <X size={17} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2.5 space-y-0.5 overflow-y-auto">
        {sections.map((section) => {
          const active   = isActive(section.href);
          const expanded = openSections.has(section.key);
          const hasKids  = section.children.length > 0;

          return (
            <div key={section.key}>
              <div className={`flex items-center rounded-md text-[0.8rem] font-medium transition-colors ${
                active ? 'bg-burgundy-50 text-burgundy-700' : 'text-slate hover:bg-parchment hover:text-charcoal'
              }`}>
                <Link
                  href={section.href}
                  onClick={onClose}
                  className="flex items-center gap-2.5 flex-1 px-3 py-2"
                >
                  <section.Icon
                    size={14}
                    className={active ? 'text-burgundy-600' : 'text-muted'}
                  />
                  <span>{section.label}</span>
                </Link>
                {hasKids && (
                  <button
                    onClick={() => toggleSection(section.key)}
                    className="px-2 py-2 text-muted hover:text-charcoal"
                    aria-label={expanded ? 'Collapse' : 'Expand'}
                  >
                    <ChevronDown
                      size={12}
                      className={`transition-transform duration-200 ${expanded ? 'rotate-0' : '-rotate-90'}`}
                    />
                  </button>
                )}
              </div>

              {hasKids && expanded && (
                <div className="ml-6 mt-0.5 mb-1 space-y-0.5 border-l border-sand pl-3">
                  {section.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={onClose}
                      className={`block px-2 py-1.5 rounded text-[0.76rem] transition-colors ${
                        isChildActive(child.href)
                          ? 'text-burgundy-700 font-semibold'
                          : 'text-muted hover:text-charcoal'
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
      <div className="p-3 border-t border-sand text-[0.7rem] text-muted space-y-1 shrink-0">
        <Link href="/privacy-policy" className="block hover:text-charcoal transition-colors">
          Privacy Policy
        </Link>
        <Link href="/admin" className="block hover:text-charcoal transition-colors">
          Admin Panel
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop: fixed sidebar */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 fixed left-0 top-0 h-screen z-40">
        {content}
      </aside>

      {/* Mobile: overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-charcoal/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Mobile: drawer */}
      <aside
        className={`fixed left-0 top-0 h-screen w-60 z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {content}
      </aside>
    </>
  );
}
