import React, { type HTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Card({
  className,
  style,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      style={{ borderColor: 'var(--border)', ...style }}
      className={twMerge(
        clsx('rounded-xl border bg-white shadow-xs transition-shadow', className),
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge(clsx('flex flex-col space-y-1.5 p-4 sm:p-5', className))}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={twMerge(
        clsx('text-sm font-bold leading-none tracking-tight text-slate-900', className),
      )}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={twMerge(clsx('text-xs text-slate-500 leading-normal', className))}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={twMerge(clsx('p-4 sm:p-5 pt-0', className))} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge(clsx('flex items-center p-4 sm:p-5 pt-0', className))}
      {...props}
    />
  );
}
