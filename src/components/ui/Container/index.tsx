import { cn } from '@/lib/utils/cn';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  as?: React.ElementType;
}

const sizeClasses = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-screen-3xl',
};

/**
 * Responsive container with horizontal padding and max-width.
 */
export function Container({
  size = 'xl',
  as: Tag = 'div',
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        'mx-auto w-full',
        'px-5 sm:px-8 lg:px-12 xl:px-16',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
