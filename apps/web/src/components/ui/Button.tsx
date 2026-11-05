import React, { forwardRef, type ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold rounded-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

    const variants = {
      primary:
        'text-white shadow-xs hover:opacity-95 focus-visible:ring-[var(--primary)]',
      secondary:
        'text-white shadow-xs hover:opacity-95 focus-visible:ring-[var(--secondary)]',
      outline:
        'border bg-white text-slate-700 shadow-xs hover:bg-slate-50 focus-visible:ring-slate-400',
      ghost:
        'text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-300',
      danger:
        'bg-rose-600 text-white shadow-xs hover:bg-rose-700 focus-visible:ring-rose-500',
    };

    const variantStyles = {
      primary: { backgroundColor: 'var(--primary)' },
      secondary: { backgroundColor: 'var(--secondary)' },
      outline: { borderColor: 'var(--border)' },
      ghost: {},
      danger: {},
    }[variant];

    const sizes = {
      sm: 'text-xs px-2.5 py-1.5 gap-1.5',
      md: 'text-xs px-3.5 py-2 gap-2',
      lg: 'text-sm px-5 py-2.5 gap-2',
      icon: 'p-2 w-8 h-8',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        style={variantStyles}
        className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
        {...props}
      >
        {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
