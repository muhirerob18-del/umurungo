import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  fullPage?: boolean;
  label?: string;
}

const sizeMap = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-[3px]",
};

export function LoadingSpinner({
  size = "md",
  className,
  fullPage = false,
  label,
}: LoadingSpinnerProps) {
  const spinner = (
    <div
      className={cn(
        "rounded-full border-primary/20 border-t-primary animate-spin",
        sizeMap[size],
        className,
      )}
      role="status"
      aria-label={label ?? "Loading"}
    />
  );

  if (fullPage) {
    return (
      <div
        className="fixed inset-0 flex flex-col items-center justify-center gap-3 bg-background/80 backdrop-blur-sm z-50"
        data-ocid="global.loading_state"
      >
        {spinner}
        {label && <p className="text-sm text-muted-foreground">{label}</p>}
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center py-12"
      data-ocid="loading_state"
    >
      <div className="flex flex-col items-center gap-3">
        {spinner}
        {label && <p className="text-sm text-muted-foreground">{label}</p>}
      </div>
    </div>
  );
}
