import type { Metadata } from 'next';
import LayoutShell from '@/components/LayoutShell';
import GTMScript from '@/components/GTMScript';
import CookieConsent from '@/components/CookieConsent';
import { prisma } from '@/lib/db';
import './globals.css';

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
  const thinkers = await prisma.thinker.findMany({
    where: { published: true },
    orderBy: { name: 'asc' },
    select: { name: true, slug: true },
  });

  return (
    <html lang="en">
      <body className="bg-cream text-charcoal font-sans antialiased">
        <GTMScript />
        <LayoutShell thinkers={thinkers}>{children}</LayoutShell>
        <CookieConsent />
      </body>
    </html>
  );
}
