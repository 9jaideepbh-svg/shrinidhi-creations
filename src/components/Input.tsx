import React from 'react';
import { cn } from '@/src/lib/utils';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div className="flex flex-col space-y-2 w-full">
        <input
          ref={ref}
          className={cn(
            "bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-primary transition-colors font-body text-sm",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';
