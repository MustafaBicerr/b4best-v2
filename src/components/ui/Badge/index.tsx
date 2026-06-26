import { cn } from '@/lib/utils/cn';

type BadgeVariant = 'gold' | 'dark' | 'outline' | 'ghost';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  gold: 'bg-gold text-dark',
  dark: 'bg-dark text-on-dark',
  outline: 'border border-gold text-gold bg-transparent',
  ghost: 'bg-cream-dark text-muted',
};

export function Badge({ variant = 'gold', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center',
        'font-accent text-[0.65rem] font-semibold uppercase tracking-[0.2em]',
        'px-3 py-1',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
