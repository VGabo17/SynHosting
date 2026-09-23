import Link from "next/link";
import type { Plan, Service } from "@prisma/client";
import { StatusBadge } from "@/components/status-badge";
import { SERVICE_TYPE_META, formatRam } from "@/lib/services";

export function ServiceCard({
  service,
}: {
  service: Service & { plan: Plan };
}) {
  const meta = SERVICE_TYPE_META[service.type];

  return (
    <Link
      href={`/dashboard/services/${service.id}`}
      className="block rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-emerald-400/30 hover:bg-white/[0.05]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-semibold">{service.name}</p>
          <p className="mt-1 text-xs text-slate-500">{service.plan.name}</p>
        </div>
        <StatusBadge status={service.status} />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-400">
        <span className={`rounded-full px-2 py-0.5 ring-1 ${meta.badge}`}>
          {meta.label}
        </span>
        <span>{service.plan.cpuCores} vCPU</span>
        <span>{formatRam(service.plan.ramMb)}</span>
        {service.ipAddress && service.port && (
          <span className="font-mono text-slate-300">
            {service.ipAddress}:{service.port}
          </span>
        )}
      </div>
    </Link>
  );
}
