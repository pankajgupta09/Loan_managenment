import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const inputVariants = cva(
  "flex w-full rounded-lg border bg-white px-3 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-ring disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-neutral-300 hover:border-neutral-400 focus:border-primary-500",
        error: "border-error-300 text-error-900 placeholder:text-error-400 focus:border-error-500 bg-error-50",
        success: "border-success-300 text-success-900 placeholder:text-success-400 focus:border-success-500 bg-success-50",
      },
      inputSize: {
        sm: "h-8 px-2 text-xs",
        md: "h-10 px-3 text-sm",
        lg: "h-12 px-4 text-base",
      }
    },
    defaultVariants: {
      variant: "default",
      inputSize: "md",
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  inputSize?: "sm" | "md" | "lg";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, inputSize, label, helperText, error, leftIcon, rightIcon, ...props }, ref) => {
    const inputVariant = error ? "error" : variant;
    
    return (
      <div className="space-y-1">
        {label && (
          <label className="text-sm font-medium text-neutral-700">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
              {leftIcon}
            </div>
          )}
          <input
            className={cn(
              inputVariants({ variant: inputVariant, inputSize, className }),
              leftIcon && "pl-10",
              rightIcon && "pr-10"
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
              {rightIcon}
            </div>
          )}
        </div>
        {(error || helperText) && (
          <p className={cn(
            "text-xs",
            error ? "text-error-600" : "text-neutral-600"
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input, inputVariants };