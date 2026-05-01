import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#18181B' }}>
      <div className="max-w-wide mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <p className="text-[0.6rem] font-medium uppercase tracking-[0.18em] text-white mb-3">
              Analytical Marxism
            </p>
            <p className="text-[0.75rem] leading-relaxed" style={{ color: '#A1A1AA' }}>
              Clarity about capitalism. Exploring Marxist questions with the
              tools of analytic philosophy and social science.
            </p>
          </div>

          {/* Content */}
          <div>
            <h4 className="text-[0.6rem] font-medium uppercase tracking-widest mb-3" style={{ color: '#52525B' }}>
              Content
            </h4>
            <ul className="space-y-1.5 text-[0.75rem]">
              <li><Link href="/blog"             className="transition-colors hover:text-white" style={{ color: '#A1A1AA' }}>Blog</Link></li>
              <li><Link href="/visual-explainers" className="transition-colors hover:text-white" style={{ color: '#A1A1AA' }}>Visual Explainers</Link></li>
              <li><Link href="/articles"          className="transition-colors hover:text-white" style={{ color: '#A1A1AA' }}>Articles</Link></li>
            </ul>
          </div>

          {/* Reference */}
          <div>
            <h4 className="text-[0.6rem] font-medium uppercase tracking-widest mb-3" style={{ color: '#52525B' }}>
              Reference
            </h4>
            <ul className="space-y-1.5 text-[0.75rem]">
              <li><Link href="/thinkers"          className="transition-colors hover:text-white" style={{ color: '#A1A1AA' }}>Thinkers</Link></li>
              <li><Link href="/resources"         className="transition-colors hover:text-white" style={{ color: '#A1A1AA' }}>Reading Lists</Link></li>
              <li><Link href="/resources#glossary" className="transition-colors hover:text-white" style={{ color: '#A1A1AA' }}>Glossary</Link></li>
            </ul>
          </div>

          {/* Project */}
          <div>
            <h4 className="text-[0.6rem] font-medium uppercase tracking-widest mb-3" style={{ color: '#52525B' }}>
              Project
            </h4>
            <ul className="space-y-1.5 text-[0.75rem]">
              <li><Link href="/admin"          className="transition-colors hover:text-white" style={{ color: '#A1A1AA' }}>Admin Panel</Link></li>
              <li><Link href="/privacy-policy" className="transition-colors hover:text-white" style={{ color: '#A1A1AA' }}>Privacy Policy</Link></li>
              <li>
                <button
                  id="open-cookie-settings"
                  className="transition-colors hover:text-white text-left"
                  style={{ color: '#A1A1AA', fontSize: '0.75rem' }}
                >
                  Cookie Settings
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[0.65rem]"
          style={{ borderTop: '0.5px solid #27272A', color: '#52525B' }}
        >
          <span>
            &copy; {new Date().getFullYear()} Analytical Marxism. An open educational project.
          </span>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-zinc-400 transition-colors">Privacy Policy</Link>
            <button id="open-cookie-settings-bottom" className="hover:text-zinc-400 transition-colors">
              Cookie Settings
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
