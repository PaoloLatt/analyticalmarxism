import Link from 'next/link';

interface ThinkerCardProps {
  slug: string;
  name: string;
  shortBio: string;
  nationality?: string | null;
  birthYear?: number | null;
  deathYear?: number | null;
  photoUrl?: string | null;
}

export default function ThinkerCard({
  slug, name, shortBio, nationality, birthYear, deathYear, photoUrl,
}: ThinkerCardProps) {
  const lifespan = birthYear
    ? `${birthYear}–${deathYear ?? 'present'}`
    : null;

  return (
    <Link
      href={`/thinkers/${slug}`}
      className="group block bg-white rounded-lg border border-sand/60 overflow-hidden card-lift"
    >
      {/* Photo / Placeholder */}
      <div className="aspect-[4/3] bg-parchment flex items-center justify-center overflow-hidden">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <span className="font-serif text-display text-sand/60">
            {name.split(' ').map(w => w[0]).join('')}
          </span>
        )}
      </div>

      <div className="p-6">
        <h3 className="font-serif text-title font-semibold text-charcoal group-hover:text-burgundy-600 transition-colors mb-1">
          {name}
        </h3>

        <div className="flex items-center gap-2 text-small text-muted mb-3">
          {nationality && <span>{nationality}</span>}
          {nationality && lifespan && <span className="text-sand">·</span>}
          {lifespan && <span>{lifespan}</span>}
        </div>

        <p className="text-body text-slate leading-relaxed line-clamp-3">
          {shortBio}
        </p>
      </div>
    </Link>
  );
}
