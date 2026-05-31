import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';

const alertVariants = cva(
  "relative rounded-lg border px-4 py-3 text-sm transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-neutral-50 border-neutral-200 text-neutral-800",
        info: "bg-primary-50 border-primary-200 text-primary-800",
        success: "bg-success-50 border-success-200 text-success-800",
        warning: "bg-warning-50 border-warning-200 text-warning-800",
        error: "bg-error-50 border-error-200 text-error-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const iconMap = {
  default: Info,
  info: Info,
  success: CheckCircle,
  warning: AlertCircle,
  error: XCircle,
};

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: boolean;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", title, children, dismissible, onDismiss, icon = true, ...props }, ref) => {
    const IconComponent = iconMap[variant];

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        <div className="flex items-start gap-3">
          {icon && (
            <IconComponent className="h-4 w-4 flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1 min-w-0">
            {title && (
              <h5 className="font-medium mb-1 text-current">
                {title}
              </h5>
            )}
            <div className="text-current">
              {children}
            </div>
          </div>
          {dismissible && (
            <button
              onClick={onDismiss}
              className="flex-shrink-0 ml-2 p-1 rounded-md hover:bg-black/10 transition-colors focus-ring"
              aria-label="Dismiss alert"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  }
);

Alert.displayName = "Alert";

export { Alert, alertVariants };