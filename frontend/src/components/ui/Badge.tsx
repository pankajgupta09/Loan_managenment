import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-neutral-100 text-neutral-800 border border-neutral-200",
        primary: "bg-primary-100 text-primary-800 border border-primary-200",
        success: "bg-success-100 text-success-800 border border-success-200",
        warning: "bg-warning-100 text-warning-800 border border-warning-200",
        error: "bg-error-100 text-error-800 border border-error-200",
        gradient: "bg-gradient-primary text-white shadow-sm",
        outline: "border-2 border-neutral-300 text-neutral-700 bg-transparent",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-1 text-xs",
        lg: "px-3 py-1.5 text-sm",
      },
      interactive: {
        true: "hover:opacity-80 cursor-pointer",
        false: "",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      interactive: false,
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

function Badge({ className, variant, size, interactive, leftIcon, rightIcon, children, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, size, interactive, className }))}
      {...props}
    >
      {leftIcon && <span className="mr-1">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-1">{rightIcon}</span>}
    </div>
  );
}

// Status-specific badge components for loan management
export const StatusBadge = ({ status, ...props }: { status: string } & Omit<BadgeProps, 'variant'>) => {
  const getStatusVariant = (status: string) => {
    switch (status.toUpperCase()) {
      case 'APPLIED':
        return 'primary';
      case 'SANCTIONED':
        return 'warning';
      case 'DISBURSED':
        return 'success';
      case 'CLOSED':
        return 'default';
      case 'REJECTED':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Badge variant={getStatusVariant(status)} {...props}>
      {status}
    </Badge>
  );
};

// Role-specific badge
export const RoleBadge = ({ role, ...props }: { role: string } & Omit<BadgeProps, 'variant'>) => {
  const getRoleVariant = (role: string) => {
    switch (role.toUpperCase()) {
      case 'ADMIN':
        return 'gradient';
      case 'SALES':
        return 'primary';
      case 'SANCTION':
        return 'warning';
      case 'DISBURSEMENT':
        return 'success';
      case 'COLLECTION':
        return 'error';
      case 'BORROWER':
        return 'default';
      default:
        return 'outline';
    }
  };

  return (
    <Badge variant={getRoleVariant(role)} size="sm" {...props}>
      {role}
    </Badge>
  );
};

export { Badge, badgeVariants };