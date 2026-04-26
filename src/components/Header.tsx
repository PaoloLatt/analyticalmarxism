'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Blog',              href: '/blog' },
  { label: 'Visual Explainers', href: '/visual-explainers' },
  { label: 'Thinkers',          href: '/thinkers' },
  { label: 'Articles',          href: '/articles' },
  { label: 'Resources',         href: '/resources' },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur-md border-b border-sand">
      <div className="max-w-wide mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo / Wordmark */}
          <Link href="/" className="flex items-center gap-3 group">
            <span className="w-8 h-8 rounded bg-burgundy-600 flex items-center justify-center text-white font-serif font-bold text-sm">
              AM
            </span>
            <span className="font-serif text-title font-semibold tracking-tight text-charcoal hidden sm:block">
              Analytical Marxism
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-small font-medium text-slate hover:text-burgundy-600 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 text-slate hover:text-charcoal"
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {open && (
          <nav className="lg:hidden pb-6 border-t border-sand pt-4 flex flex-col gap-4">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-body font-medium text-slate hover:text-burgundy-600 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
