import { prisma } from '@/lib/db';
import SectionHeader from '@/components/SectionHeader';
import { BarChart3, Play, Layers, Zap } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Visual Explainers' };
export const dynamic = 'force-dynamic';

const TYPE_ICON: Record<string, typeof BarChart3> = {
  infographic: BarChart3,
  diagram: Layers,
  video: Play,
  interactive: Zap,
};

export default async function VisualExplainersPage() {
  const items = await prisma.infographic.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    include: { thinker: true, tags: true },
  });

  return (
    <div className="max-w-wide mx-auto px-6 lg:px-10 py-16 lg:py-22">
      <SectionHeader
        label="See It Clearly"
        title="Visual Explainers"
        subtitle="Infographics, diagrams, and videos that make Analytical Marxism's key arguments accessible at a glance."
        centered
      />

      {items.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-12 stagger">
          {items.map((item) => {
            const Icon = TYPE_ICON[item.type] ?? BarChart3;
            return (
              <div
                key={item.id}
                id={item.slug}
                className="bg-white border border-sand/60 rounded-lg overflow-hidden card-lift scroll-mt-24"
              >
                {/* Preview area */}
                <div className="aspect-video bg-parchment flex items-center justify-center relative">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  ) : item.videoUrl ? (
                    <div className="w-full h-full">
                      <iframe
                        src={item.videoUrl}
                        className="w-full h-full"
                        allowFullScreen
                        title={item.title}
                      />
                    </div>
                  ) : (
                    <Icon size={40} className="text-sand" />
                  )}

                  {/* Type badge overlay */}
                  <span className="absolute top-3 left-3 badge bg-white/90 text-charcoal border-0 shadow-sm">
                    <Icon size={12} className="inline mr-1 -mt-0.5" />
                    {item.type}
                  </span>
                </div>

                <div className="p-6">
                  <h3 className="font-serif text-title font-semibold text-charcoal mb-2">
                    {item.title}
                  </h3>
                  <p className="text-small text-slate leading-relaxed mb-3">
                    {item.description}
                  </p>
                  {item.thinker && (
                    <span className="text-caption text-muted">
                      Related: {item.thinker.name}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 text-muted">
          <p className="text-body">No visual explainers yet.</p>
        </div>
      )}
    </div>
  );
}
