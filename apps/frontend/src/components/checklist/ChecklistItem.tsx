import { AlertCircle, CheckCircle2, Circle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface DashboardChecklistItem {
  id: string;
  title: string;
  description: string;
  stage: number;
  category?: string;
  completed: boolean;
  overdue: boolean;
}

interface ChecklistItemProps {
  item: DashboardChecklistItem;
  onToggle: (id: string) => void;
}

export function ChecklistItem({ item, onToggle }: ChecklistItemProps) {
  const StatusIcon = item.overdue ? AlertCircle : item.completed ? CheckCircle2 : Circle;

  return (
    <button
      type="button"
      onClick={() => onToggle(item.id)}
      className={cn(
        'w-full rounded-xl border p-4 text-left transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        item.overdue
          ? 'border-amber-300 bg-amber-50/70'
          : item.completed
            ? 'border-emerald-300 bg-emerald-50/70'
            : 'border-border bg-card hover:bg-muted/40',
      )}
      aria-label={`Toggle checklist item: ${item.title}`}
    >
      <div className="flex items-start gap-3">
        <StatusIcon
          className={cn(
            'mt-0.5 h-5 w-5 shrink-0',
            item.overdue ? 'text-amber-600' : item.completed ? 'text-emerald-600' : 'text-muted-foreground',
          )}
          aria-hidden
        />

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <p className={cn('font-medium', item.completed && 'line-through text-muted-foreground')}>{item.title}</p>
            {item.overdue && <Badge variant="destructive">OVERDUE</Badge>}
            {item.category ? <Badge variant="outline">{item.category}</Badge> : null}
          </div>
          <p className={cn('text-sm text-muted-foreground', item.completed && 'line-through')}>{item.description}</p>
        </div>
      </div>
    </button>
  );
}
