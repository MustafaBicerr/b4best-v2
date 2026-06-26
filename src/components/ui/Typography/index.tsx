import { cn } from '@/lib/utils/cn';

// ─── Eyebrow ──────────────────────────────────────────────────────────────────

interface EyebrowProps extends React.HTMLAttributes<HTMLParagraphElement> {
  onDark?: boolean;
}

export function Eyebrow({ onDark = false, className, children, ...props }: EyebrowProps) {
  return (
    <p
      className={cn(
        'font-accent text-eyebrow font-semibold uppercase tracking-[0.25em]',
        onDark ? 'text-gold' : 'text-gold',
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

// ─── Display (hero-level headings) ────────────────────────────────────────────

interface DisplayProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3';
  onDark?: boolean;
}

export function Display({
  as: Tag = 'h1',
  onDark = false,
  className,
  children,
  ...props
}: DisplayProps) {
  return (
    <Tag
      className={cn(
        'font-display font-light leading-[1.05] text-pretty',
        '[font-size:var(--text-hero)]',
        onDark ? 'text-on-dark' : 'text-dark',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

// ─── Heading ──────────────────────────────────────────────────────────────────

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h2' | 'h3' | 'h4';
  size?: 'display' | 'section' | 'subsection';
  onDark?: boolean;
}

export function Heading({
  as: Tag = 'h2',
  size = 'section',
  onDark = false,
  className,
  children,
  ...props
}: HeadingProps) {
  const sizeClass = {
    display: '[font-size:var(--text-display)]',
    section: '[font-size:var(--text-section)]',
    subsection: '[font-size:var(--text-subsection)]',
  }[size];

  return (
    <Tag
      className={cn(
        'font-display font-normal leading-[1.08] text-balance',
        sizeClass,
        onDark ? 'text-on-dark' : 'text-dark',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

// ─── Body ─────────────────────────────────────────────────────────────────────

interface BodyProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: 'sm' | 'md' | 'lg';
  onDark?: boolean;
  muted?: boolean;
}

export function Body({
  size = 'md',
  onDark = false,
  muted = false,
  className,
  children,
  ...props
}: BodyProps) {
  const sizeClass = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }[size];

  return (
    <p
      className={cn(
        'font-body font-normal leading-relaxed text-pretty',
        sizeClass,
        muted && !onDark && 'text-muted',
        muted && onDark && 'text-on-dark/70',
        !muted && onDark && 'text-on-dark',
        !muted && !onDark && 'text-dark',
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

// ─── Label ────────────────────────────────────────────────────────────────────

interface LabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  onDark?: boolean;
}

export function Label({ onDark = false, className, children, ...props }: LabelProps) {
  return (
    <span
      className={cn(
        'font-accent text-xs font-medium uppercase tracking-[0.2em]',
        onDark ? 'text-on-dark/60' : 'text-muted',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
