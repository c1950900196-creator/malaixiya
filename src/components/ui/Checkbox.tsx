import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, checked, ...props }, ref) => {
    return (
      <label className="inline-flex items-center cursor-pointer group">
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            checked={checked}
            className={cn(
              'peer sr-only',
              className
            )}
            {...props}
          />
          <div className={cn(
            'w-5 h-5 rounded border-2 border-gray-300 dark:border-border-dark',
            'bg-white dark:bg-surface-dark',
            'peer-checked:bg-primary peer-checked:border-primary',
            'peer-focus:ring-2 peer-focus:ring-primary peer-focus:ring-offset-2 dark:peer-focus:ring-offset-zinc-900',
            'transition-all duration-200',
            'flex items-center justify-center'
          )}>
            <Check 
              className={cn(
                'w-3.5 h-3.5 text-white transition-all duration-200',
                checked ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
              )} 
            />
          </div>
        </div>
        {label && (
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
            {label}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

