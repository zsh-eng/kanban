import { cn } from '@/lib/utils';
import { Circle } from 'lucide-react';

export function StyledCircle({ className }: { className?: string }) {
  return (
    <Circle
      className={cn('w-4 h-4 text-muted-foreground flex-shrink-0', className)}
    />
  );
}
