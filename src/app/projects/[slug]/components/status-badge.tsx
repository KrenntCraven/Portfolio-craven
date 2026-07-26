/**
 * StatusBadge — a small delivery-status pill (Completed / In Progress /
 * Archived). Server-safe and shared by the hero and the metadata rail.
 */
import type { ProjectStatus } from "../../../backend/types";

const STATUS_STYLES: Record<ProjectStatus, { dot: string; badge: string }> = {
  Completed: {
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  },
  "In Progress": {
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700 ring-amber-600/20",
  },
  Archived: {
    dot: "bg-neutral-400",
    badge: "bg-neutral-100 text-neutral-600 ring-neutral-500/20",
  },
};

export function StatusBadge({
  status,
  className,
}: {
  status: ProjectStatus;
  className?: string;
}) {
  const style = STATUS_STYLES[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${style.badge} ${className ?? ""}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
}
