import { cn } from '@/lib/utils';

export interface Testimonial {
  id: string;
  playerName: string;
  context: string;
  result: string;
  details: string;
  imageUrl?: string;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  variant?: 'default' | 'compact';
  className?: string;
}

export function TestimonialCard({ testimonial, variant = 'default', className }: TestimonialCardProps) {
  const initials = testimonial.playerName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  return (
    <div
      className={cn(
        'bg-bb-card border border-bb-border rounded-lg p-6 flex flex-col',
        variant === 'compact' ? 'p-4' : 'p-6',
        className
      )}
    >
      {/* Result highlight */}
      <p className={cn(
        'text-gold-500 font-semibold mb-2',
        variant === 'compact' ? 'text-sm' : 'text-base'
      )}>
        {testimonial.result}
      </p>

      {/* Details */}
      <p className={cn(
        'text-white leading-relaxed mb-4',
        variant === 'compact' ? 'text-xs' : 'text-sm'
      )}>
        {testimonial.details}
      </p>

      {/* Attribution */}
      <div className="flex items-center gap-3 mt-auto pt-4 border-t border-bb-border">
        {/* Avatar placeholder */}
        {testimonial.imageUrl ? (
          <img
            src={testimonial.imageUrl}
            alt={testimonial.playerName}
            className={cn(
              'rounded-full object-cover',
              variant === 'compact' ? 'w-8 h-8' : 'w-10 h-10'
            )}
          />
        ) : (
          <div
            className={cn(
              'rounded-full bg-gold-500/20 flex items-center justify-center text-gold-500 font-semibold',
              variant === 'compact' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm'
            )}
          >
            {initials}
          </div>
        )}

        <div>
          <p className={cn(
            'text-white font-medium',
            variant === 'compact' ? 'text-xs' : 'text-sm'
          )}>
            {testimonial.playerName}
          </p>
          <p className={cn(
            'text-gray-400',
            variant === 'compact' ? 'text-xs' : 'text-xs'
          )}>
            {testimonial.context}
          </p>
        </div>
      </div>
    </div>
  );
}
