import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200",
  {
    variants: {
      variant: {
        PRO: "bg-success/10 text-success border border-success/20",
        UAT: "bg-warning/10 text-warning border border-warning/20",
        DEV: "bg-info/10 text-info border border-info/20",
        REQ: "bg-neutral/10 text-neutral border border-neutral/20",
      },
    },
    defaultVariants: {
      variant: "REQ",
    },
  }
);

interface StatusBadgeProps extends VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
  className?: string;
}

export function StatusBadge({ children, variant, className }: StatusBadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)}>
      {children}
    </span>
  );
}
