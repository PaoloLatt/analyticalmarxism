import { supabase } from '@/lib/db';
import SectionHeader from '@/components/SectionHeader';
import { BookOpen, FileText, Play, Globe, GraduationCap } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Resources' };
export const dynamic = 'force-dynamic';

const TYPE_ICON: Record<string, typeof BookOpen> = {
  book: BookOpen,
  paper: FileText,
  video: Play,
  website: Globe,
  course: GraduationCap,
};

const DIFFICULTY_LABEL: Record<string, string> = {
  introductory: 'Introductory',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export default async function ResourcesPage() {
  const [{ data: resources }, { data: glossary }] = await Promise.all([
    supabase.from('Resource').select('*').order('createdAt', { ascending: false }),
    supabase.from('GlossaryTerm').select('*').order('term'),
  ]);

  const items = resources ?? [];
  const glossaryItems = glossary ?? [];

  // Group resources by difficulty
  const grouped = {
    introductory: items.filter((r: any) => r.difficulty === 'introductory'),
    intermediate: items.filter((r: any) => r.difficulty === 'intermediate'),
    advanced:     items.filter((r: any) => r.difficulty === 'advanced'),
  };

  return (
    <div className="max-w-wide mx-auto px-6 lg:px-10 py-16 lg:py-22">
      <SectionHeader
        label="Go Deeper"
        title="Resources"
        subtitle="Curated reading lists, key texts, videos, and a glossary of terms to navigate the Analytical Marxist tradition."
        centered
      />

      {/* Reading Lists by difficulty */}
      {items.length > 0 && (
        <section className="mt-16">
          {Object.entries(grouped).map(([level, levelItems]) =>
            levelItems.length > 0 ? (
              <div key={level} className="mb-12">
                <h2 className="font-serif text-headline font-semibold text-charcoal mb-6">
                  {DIFFICULTY_LABEL[level]}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {levelItems.map((r: any) => {
                    const Icon = TYPE_ICON[r.type] ?? FileText;
                    return (
                      <div
                        key={r.id}
                        className="bg-white border border-sand/60 rounded-lg p-5 flex gap-4 items-start card-lift"
                      >
                        <div className="shrink-0 w-10 h-10 rounded bg-parchment flex items-center justify-center">
                          <Icon size={18} className="text-burgundy-600" />
                        </div>
                        <div>
                          <h3 className="font-sans font-semibold text-charcoal text-body">
                            {r.url ? (
                              <a href={r.url} target="_blank" rel="noopener noreferrer" className="hover:text-burgundy-600 transition-colors">
                                {r.title} ↗
                              </a>
                            ) : (
                              r.title
                            )}
                          </h3>
                          {r.description && (
                            <p className="text-small text-slate mt-1">{r.description}</p>
                          )}
                          <span className="inline-block mt-2 text-caption font-mono uppercase text-muted">
                            {r.type}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null
          )}
        </section>
      )}

      {/* Glossary */}
      {glossaryItems.length > 0 && (
        <section className="mt-16">
          <h2 className="font-serif text-headline font-semibold text-charcoal mb-8 text-center">
            Glossary
          </h2>
          <div className="max-w-article mx-auto divide-y divide-sand">
            {glossaryItems.map((g: any) => (
              <div key={g.id} className="py-6">
                <dt className="font-serif font-semibold text-title text-charcoal mb-2">
                  {g.term}
                </dt>
                <dd className="text-body text-slate leading-relaxed">
                  {g.definition}
                </dd>
              </div>
            ))}
          </div>
        </section>
      )}

      {items.length === 0 && glossaryItems.length === 0 && (
        <div className="text-center py-20 text-muted">
          <p className="text-body">No resources or glossary terms yet.</p>
        </div>
      )}
    </div>
  );
}
