import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../ui/Button';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div
      className="p-8 rounded-xl border border-dashed text-center bg-slate-50/60 flex flex-col items-center justify-center space-y-2"
      style={{ borderColor: 'var(--border)' }}
    >
      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-1">
        {icon}
      </div>
      <h3 className="text-xs font-bold text-slate-800">{title}</h3>
      <p className="text-xs text-slate-500 max-w-xs">{description}</p>
      {actionLabel && onAction && (
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onAction}
          className="mt-2"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{actionLabel}</span>
        </Button>
      )}
    </div>
  );
}
