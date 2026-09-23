import type { ServiceStatus } from "@prisma/client";
import { SERVICE_STATUS_META } from "@/lib/services";

export function StatusBadge({ status }: { status: ServiceStatus }) {
  const meta = SERVICE_STATUS_META[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${meta.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}
