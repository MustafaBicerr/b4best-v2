import { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
  loading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: [
    'bg-gold text-dark',
    'hover:bg-gold-dark',
    'active:scale-[0.98]',
    'focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2',
  ].join(' '),
  secondary: [
    'bg-dark text-on-dark border border-border',
    'hover:bg-surface',
    'active:scale-[0.98]',
  ].join(' '),
  ghost: [
    'bg-transparent text-dark',
    'hover:bg-cream-dark',
    'active:scale-[0.98]',
  ].join(' '),
  outline: [
    'bg-transparent text-gold border border-gold',
    'hover:bg-gold hover:text-dark',
    'active:scale-[0.98]',
  ].join(' '),
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-5 py-2.5 text-xs tracking-[0.12em]',
  md: 'px-8 py-3.5 text-xs tracking-[0.15em]',
  lg: 'px-10 py-4 text-sm tracking-[0.15em]',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2',
          'font-accent font-medium uppercase',
          'transition-all duration-300',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <>
            <span className="sr-only">Loading</span>
            <span
              className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
              aria-hidden="true"
            />
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
