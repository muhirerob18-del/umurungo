import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  pageSize: number;
  total?: number;
  hasMore?: boolean;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  page,
  pageSize,
  total,
  hasMore,
  onPageChange,
  className,
}: PaginationProps) {
  const totalPages =
    total !== undefined ? Math.ceil(total / pageSize) : undefined;
  const canPrev = page > 0;
  const canNext =
    hasMore ?? (totalPages !== undefined ? page < totalPages - 1 : false);

  if (!canPrev && !canNext) return null;

  return (
    <div
      className={cn("flex items-center justify-center gap-2 py-6", className)}
    >
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={!canPrev}
        data-ocid="pagination_prev"
        className="gap-1"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>

      {totalPages !== undefined && (
        <span className="text-sm text-muted-foreground px-2">
          Page {page + 1} of {totalPages}
        </span>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={!canNext}
        data-ocid="pagination_next"
        className="gap-1"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
