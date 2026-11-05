import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../ui/Button';

interface SectionHeaderProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionHeader({
  title,
  description,
  actionLabel,
  onAction,
}: SectionHeaderProps) {
  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b gap-2"
      style={{ borderColor: 'var(--border)' }}
    >
      <div>
        <h2 className="text-sm font-bold text-slate-900 tracking-tight">{title}</h2>
        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
      </div>

      {actionLabel && onAction && (
        <Button type="button" size="sm" variant="primary" onClick={onAction}>
          <Plus className="w-3.5 h-3.5" />
          <span>{actionLabel}</span>
        </Button>
      )}
    </div>
  );
}
