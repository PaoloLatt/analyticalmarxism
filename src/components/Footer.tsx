import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-charcoal text-parchment">
      <div className="max-w-wide mx-auto px-6 lg:px-8 py-10 lg:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="w-7 h-7 rounded bg-burgundy-500 flex items-center justify-center text-white font-serif font-bold text-xs">
                AM
              </span>
              <span className="font-serif text-[0.95rem] font-semibold text-cream">
                Analytical Marxism
              </span>
            </div>
            <p className="text-[0.78rem] text-sand/70 leading-relaxed">
              Clarity about capitalism. Exploring Marxist questions with the
              tools of analytic philosophy and social science.
            </p>
          </div>

          {/* Content */}
          <div>
            <h4 className="text-[0.65rem] font-sans font-semibold uppercase tracking-widest text-sand/50 mb-3">
              Content
            </h4>
            <ul className="space-y-1.5 text-[0.78rem]">
              <li><Link href="/blog"             className="text-parchment/60 hover:text-cream transition-colors">Blog &amp; Commentary</Link></li>
              <li><Link href="/visual-explainers" className="text-parchment/60 hover:text-cream transition-colors">Visual Explainers</Link></li>
              <li><Link href="/articles"          className="text-parchment/60 hover:text-cream transition-colors">Articles &amp; Essays</Link></li>
            </ul>
          </div>

          {/* Reference */}
          <div>
            <h4 className="text-[0.65rem] font-sans font-semibold uppercase tracking-widest text-sand/50 mb-3">
              Reference
            </h4>
            <ul className="space-y-1.5 text-[0.78rem]">
              <li><Link href="/thinkers"  className="text-parchment/60 hover:text-cream transition-colors">Thinkers</Link></li>
              <li><Link href="/resources" className="text-parchment/60 hover:text-cream transition-colors">Reading Lists</Link></li>
              <li><Link href="/resources#glossary" className="text-parchment/60 hover:text-cream transition-colors">Glossary</Link></li>
            </ul>
          </div>

          {/* Project */}
          <div>
            <h4 className="text-[0.65rem] font-sans font-semibold uppercase tracking-widest text-sand/50 mb-3">
              Project
            </h4>
            <ul className="space-y-1.5 text-[0.78rem]">
              <li><Link href="/admin"          className="text-parchment/60 hover:text-cream transition-colors">Admin Panel</Link></li>
              <li><Link href="/privacy-policy" className="text-parchment/60 hover:text-cream transition-colors">Privacy Policy</Link></li>
              <li>
                {/* Opens cookie preferences modal (Phase 3) */}
                <button
                  id="open-cookie-settings"
                  className="text-parchment/60 hover:text-cream transition-colors text-left"
                >
                  Cookie Settings
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate/20 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[0.68rem] text-muted">
          <span>
            &copy; {new Date().getFullYear()} Analytical Marxism. An open educational project.
          </span>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-sand transition-colors">Privacy Policy</Link>
            <button id="open-cookie-settings-bottom" className="hover:text-sand transition-colors">
              Cookie Settings
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
