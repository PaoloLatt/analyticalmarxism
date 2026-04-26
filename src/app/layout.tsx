import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
