import React, { useState } from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '../ui/Button';

interface BulletListManagerProps {
  label?: string;
  bullets: string[];
  onChange: (updated: string[]) => void;
  placeholder?: string;
}

export function BulletListManager({
  label = 'Key Impact & Responsibilities (STAR Method)',
  bullets,
  onChange,
  placeholder = 'e.g., Architected Next.js microservice reducing API latency by 35%...',
}: BulletListManagerProps) {
  const [newBullet, setNewBullet] = useState('');

  const handleAdd = () => {
    if (!newBullet.trim()) return;
    onChange([...bullets, newBullet.trim()]);
    setNewBullet('');
  };

  const handleUpdate = (index: number, val: string) => {
    const updated = [...bullets];
    updated[index] = val;
    onChange(updated);
  };

  const handleRemove = (index: number) => {
    onChange(bullets.filter((_, i) => i !== index));
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= bullets.length) return;
    const updated = [...bullets];
    const [moved] = updated.splice(index, 1);
    if (moved !== undefined) {
      updated.splice(target, 0, moved);
      onChange(updated);
    }
  };

  return (
    <div className="space-y-2 pt-1">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
          {label}
        </label>
        <span className="text-[10px] text-slate-400 font-mono">
          {bullets.length} {bullets.length === 1 ? 'bullet' : 'bullets'}
        </span>
      </div>

      {/* Existing Bullet Items */}
      <div className="space-y-1.5">
        {bullets.map((b, idx) => (
          <div key={idx} className="flex items-start gap-1.5 group">
            <div className="flex flex-col mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => handleMove(idx, 'up')}
                disabled={idx === 0}
                className="p-0.5 text-slate-400 hover:text-slate-800 disabled:opacity-20 cursor-pointer"
                title="Move up"
              >
                <ChevronUp className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => handleMove(idx, 'down')}
                disabled={idx === 0 || idx === bullets.length - 1}
                className="p-0.5 text-slate-400 hover:text-slate-800 disabled:opacity-20 cursor-pointer"
                title="Move down"
              >
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>

            <textarea
              rows={2}
              value={b}
              onChange={(e) => handleUpdate(idx, e.target.value)}
              className="flex-1 px-2.5 py-1.5 text-xs rounded border bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-[var(--primary)] resize-y"
              style={{ borderColor: 'var(--border)' }}
            />

            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer mt-0.5"
              title="Delete bullet"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Add New Bullet Input */}
      <div className="flex items-center gap-2 pt-1">
        <input
          type="text"
          value={newBullet}
          onChange={(e) => setNewBullet(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAdd();
            }
          }}
          placeholder={placeholder}
          className="flex-1 px-3 py-1.5 text-xs rounded border bg-slate-50/70 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[var(--primary)] placeholder:text-slate-400"
          style={{ borderColor: 'var(--border)' }}
        />
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleAdd}
          disabled={!newBullet.trim()}
        >
          <Plus className="w-3 h-3" />
          <span>Add</span>
        </Button>
      </div>
    </div>
  );
}
