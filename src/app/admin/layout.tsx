import Link from 'next/link';
import { LayoutDashboard, FileText, Users, BarChart3, BookOpen, ArrowLeft } from 'lucide-react';

const ADMIN_NAV = [
  { label: 'Dashboard',   href: '/admin',           icon: LayoutDashboard },
  { label: 'Posts',        href: '/admin/posts',     icon: FileText },
  { label: 'Thinkers',    href: '/admin/thinkers',  icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-parchment">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Admin header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-small text-muted hover:text-charcoal transition-colors"
            >
              <ArrowLeft size={14} /> Back to site
            </Link>
            <div className="w-px h-5 bg-sand" />
            <h1 className="font-serif text-title font-semibold text-charcoal">Admin Panel</h1>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-48 shrink-0">
            <nav className="space-y-1">
              {ADMIN_NAV.map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-small font-medium text-slate hover:bg-white hover:text-charcoal transition-colors"
                >
                  <Icon size={16} />
                  {label}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
