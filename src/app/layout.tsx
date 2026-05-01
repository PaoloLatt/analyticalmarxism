import type { Metadata } from 'next';
import LayoutShell from '@/components/LayoutShell';
import GTMScript from '@/components/GTMScript';
import CookieConsent from '@/components/CookieConsent';
import { supabase } from '@/lib/db';
import { SOCIAL_LINKS } from '@/lib/config';
import './globals.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: {
    default: 'Analytical Marxism — Clarity about capitalism',
    template: '%s | Analytical Marxism',
  },
  description:
    'Exploring Marxist questions with the tools of analytic philosophy, game theory, and social science. Blog posts, visual explainers, thinker profiles, and long-form articles on the September Group tradition.',
  keywords: [
    'analytical marxism',
    'G.A. Cohen',
    'Jon Elster',
    'John Roemer',
    'Erik Olin Wright',
    'September Group',
    'political philosophy',
    'exploitation',
    'class theory',
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [{ data: thinkers }, { data: settingsRows }] = await Promise.all([
    supabase
      .from('Thinker')
      .select('name, slug')
      .eq('published', true)
      .order('name'),
    supabase
      .from('SiteSettings')
      .select('key, value')
      .like('key', 'social.%'),
  ]);

  // Build social links: DB values override config defaults
  const socialLinks: Record<string, string> = { ...SOCIAL_LINKS };
  for (const row of settingsRows ?? []) {
    const platform = (row.key as string).replace('social.', '');
    socialLinks[platform] = row.value as string;
  }

  return (
    <html lang="en">
      <body className="bg-white text-zinc-900 font-sans antialiased">
        <GTMScript />
        <LayoutShell thinkers={thinkers ?? []} socialLinks={socialLinks}>
          {children}
        </LayoutShell>
        <CookieConsent />
      </body>
    </html>
  );
}
