import type { Metadata } from 'next';
import LayoutShell from '@/components/LayoutShell';
import GTMScript from '@/components/GTMScript';
import CookieConsent from '@/components/CookieConsent';
import { prisma } from '@/lib/db';
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
  const [thinkers, settingsRows] = await Promise.all([
    prisma.thinker.findMany({
      where: { published: true },
      orderBy: { name: 'asc' },
      select: { name: true, slug: true },
    }),
    prisma.siteSettings.findMany({
      where: { key: { startsWith: 'social.' } },
    }),
  ]);

  // Build social links: DB values override config defaults
  const socialLinks: Record<string, string> = { ...SOCIAL_LINKS };
  for (const { key, value } of settingsRows) {
    const platform = key.replace('social.', '');
    socialLinks[platform] = value;
  }

  return (
    <html lang="en">
      <body className="bg-white text-zinc-900 font-sans antialiased">
        <GTMScript />
        <LayoutShell thinkers={thinkers} socialLinks={socialLinks}>
          {children}
        </LayoutShell>
        <CookieConsent />
      </body>
    </html>
  );
}
