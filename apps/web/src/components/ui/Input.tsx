import React, { forwardRef, type InputHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-slate-700"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={twMerge(
            clsx(
              'w-full px-3 py-2 text-xs rounded-md border bg-white text-slate-900 transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-1',
              error
                ? 'border-rose-400 focus:ring-rose-500'
                : 'border-[var(--border)] focus:ring-[var(--primary)]',
              className,
            ),
          )}
          style={{ borderColor: error ? undefined : 'var(--border)' }}
          {...props}
        />
        {error && <p className="text-[11px] text-rose-600 font-medium">{error}</p>}
        {helperText && !error && (
          <p className="text-[10px] text-slate-400">{helperText}</p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
