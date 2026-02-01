'use client';

import { cn } from '@/lib/utils';
import { TestimonialCard, type Testimonial } from './TestimonialCard';
import { FEATURED_TESTIMONIALS, TESTIMONIALS } from './testimonialData';

interface TestimonialsSectionProps {
  title?: string;
  subtitle?: string;
  testimonials?: Testimonial[];
  variant?: 'default' | 'compact';
  columns?: 2 | 3 | 4;
  maxItems?: number;
  showAllLink?: boolean;
  className?: string;
}

export function TestimonialsSection({
  title = 'Results That Speak',
  subtitle = 'Real players. Real improvements. Measurable results.',
  testimonials = FEATURED_TESTIMONIALS,
  variant = 'default',
  columns = 2,
  maxItems,
  showAllLink = false,
  className,
}: TestimonialsSectionProps) {
  const displayTestimonials = maxItems
    ? testimonials.slice(0, maxItems)
    : testimonials;

  return (
    <section className={cn('py-12', className)}>
      {/* Header */}
      {(title || subtitle) && (
        <div className="text-center mb-8">
          {title && (
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-gray-400 max-w-2xl mx-auto">{subtitle}</p>
          )}
        </div>
      )}

      {/* Grid */}
      <div
        className={cn(
          'grid gap-4',
          columns === 2 && 'grid-cols-1 md:grid-cols-2',
          columns === 3 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
          columns === 4 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
        )}
      >
        {displayTestimonials.map((testimonial) => (
          <TestimonialCard
            key={testimonial.id}
            testimonial={testimonial}
            variant={variant}
          />
        ))}
      </div>

      {/* View all link */}
      {showAllLink && (
        <div className="text-center mt-8">
          <a
            href="/testimonials"
            className="text-gold-500 hover:text-gold-400 transition-colors text-sm font-medium"
          >
            View all testimonials &rarr;
          </a>
        </div>
      )}
    </section>
  );
}

// Compact inline version for checkout pages
export function TestimonialsInline({
  testimonials = FEATURED_TESTIMONIALS.slice(0, 3),
  className,
}: {
  testimonials?: Testimonial[];
  className?: string;
}) {
  return (
    <div className={cn('space-y-3', className)}>
      <p className="text-sm text-gray-400 font-medium uppercase tracking-wider mb-4">
        Trusted by players at every level
      </p>
      {testimonials.map((t) => (
        <div
          key={t.id}
          className="flex items-start gap-3 p-3 bg-bb-card/50 rounded-lg border border-bb-border/50"
        >
          {/* Initials */}
          <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-500 text-xs font-semibold shrink-0">
            {t.playerName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gold-500 text-sm font-semibold">{t.result}</p>
            <p className="text-white text-xs mt-1 leading-snug">{t.details}</p>
            <p className="text-gray-500 text-xs mt-1">
              {t.playerName} • {t.context}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// Stats bar version
export function TestimonialsStats({ className }: { className?: string }) {
  const stats = [
    { value: '47%', label: 'Tobias Harris over 100 3s' },
    { value: '60%', label: 'OG Anunoby in one month' },
    { value: '2x', label: 'Average improvement' },
  ];

  return (
    <div
      className={cn(
        'grid grid-cols-3 gap-4 p-4 bg-bb-card rounded-lg border border-bb-border',
        className
      )}
    >
      {stats.map((stat, i) => (
        <div key={i} className="text-center">
          <p className="text-2xl font-bold text-gold-500">{stat.value}</p>
          <p className="text-xs text-gray-400">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
