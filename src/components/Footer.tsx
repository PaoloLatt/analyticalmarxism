import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-charcoal text-parchment mt-22">
      <div className="max-w-wide mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded bg-burgundy-500 flex items-center justify-center text-white font-serif font-bold text-sm">
                AM
              </span>
              <span className="font-serif text-title font-semibold text-cream">
                Analytical Marxism
              </span>
            </div>
            <p className="text-small text-sand leading-relaxed">
              Clarity about capitalism. Exploring Marxist questions with the tools
              of analytic philosophy and social science.
            </p>
          </div>

          {/* Sections */}
          <div>
            <h4 className="font-sans text-caption font-semibold uppercase tracking-widest text-sand mb-4">
              Content
            </h4>
            <ul className="space-y-2 text-small">
              <li><Link href="/blog"              className="text-parchment/70 hover:text-cream transition-colors">Blog &amp; Commentary</Link></li>
              <li><Link href="/visual-explainers"  className="text-parchment/70 hover:text-cream transition-colors">Visual Explainers</Link></li>
              <li><Link href="/articles"           className="text-parchment/70 hover:text-cream transition-colors">Articles &amp; Essays</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-sans text-caption font-semibold uppercase tracking-widest text-sand mb-4">
              Reference
            </h4>
            <ul className="space-y-2 text-small">
              <li><Link href="/thinkers"  className="text-parchment/70 hover:text-cream transition-colors">Thinkers</Link></li>
              <li><Link href="/resources" className="text-parchment/70 hover:text-cream transition-colors">Reading Lists</Link></li>
              <li><Link href="/resources" className="text-parchment/70 hover:text-cream transition-colors">Glossary</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-sans text-caption font-semibold uppercase tracking-widest text-sand mb-4">
              Project
            </h4>
            <ul className="space-y-2 text-small">
              <li><Link href="/admin"    className="text-parchment/70 hover:text-cream transition-colors">Admin Panel</Link></li>
              <li><a href="#" className="text-parchment/70 hover:text-cream transition-colors">About</a></li>
              <li><a href="#" className="text-parchment/70 hover:text-cream transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate/30 mt-12 pt-8 text-center text-caption text-muted">
          &copy; {new Date().getFullYear()} Analytical Marxism. An open educational project.
        </div>
      </div>
    </footer>
  );
}
