import React from 'react';
import { cn } from '@/src/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', ...props }, ref) => {
    const variants = {
      primary: "bg-primary text-on-primary hover:bg-primary-container",
      secondary: "bg-transparent border border-outline-variant/15 text-primary hover:bg-surface-container-low",
      tertiary: "bg-transparent text-primary editorial-underline",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center px-10 py-5 text-sm tracking-widest uppercase font-bold font-label transition-colors duration-300 rounded-none",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
