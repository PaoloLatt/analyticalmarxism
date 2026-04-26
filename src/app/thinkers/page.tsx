import { prisma } from '@/lib/db';
import SectionHeader from '@/components/SectionHeader';
import ThinkerCard from '@/components/ThinkerCard';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Thinkers' };
export const dynamic = 'force-dynamic';

export default async function ThinkersPage() {
  const thinkers = await prisma.thinker.findMany({
    where: { published: true },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="max-w-wide mx-auto px-6 lg:px-10 py-16 lg:py-22">
      <SectionHeader
        label="The September Group & Beyond"
        title="Key Thinkers"
        subtitle="The philosophers, economists, and social scientists who built the Analytical Marxist tradition — using rational choice theory, analytic philosophy, and mathematical models to clarify Marxist arguments."
        centered
      />

      {thinkers.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-12 stagger">
          {thinkers.map((t) => (
            <ThinkerCard key={t.id} {...t} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted">
          <p className="text-body">No thinkers added yet.</p>
        </div>
      )}
    </div>
  );
}
