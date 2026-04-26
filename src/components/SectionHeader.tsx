interface SectionHeaderProps {
  label?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export default function SectionHeader({
  label, title, subtitle, centered = false,
}: SectionHeaderProps) {
  return (
    <div className={centered ? 'text-center' : ''}>
      {label && (
        <p className="text-caption font-sans font-semibold uppercase tracking-widest text-burgundy-600 mb-3">
          {label}
        </p>
      )}
      <h1 className="font-serif text-display font-bold text-charcoal mb-4">
        {title}
      </h1>
      {subtitle && (
        <p className="text-body text-slate max-w-article leading-relaxed mx-auto">
          {subtitle}
        </p>
      )}
      <div className={centered ? 'divider mt-8' : 'divider-left mt-6'} />
    </div>
  );
}
