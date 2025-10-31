import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'card' | 'table-cell' | 'avatar';
}

function Skeleton({ className, variant = 'default', ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-muted/10",
        // Variants
        variant === 'default' && "rounded-md min-h-[20px]",
        variant === 'card' && "rounded-xl min-h-[120px]",
        variant === 'table-cell' && "rounded-md h-5 w-24",
        variant === 'avatar' && "rounded-full h-10 w-10",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
