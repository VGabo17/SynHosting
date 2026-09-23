import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { StatusBadge } from "@/components/status-badge";
import { ServiceActions } from "@/components/service-actions";
import {
  SERVICE_TYPE_META,
  formatDisk,
  formatPrice,
  formatRam,
} from "@/lib/services";

export const dynamic = "force-dynamic";

const CONFIG_LABELS: Record<string, string> = {
  version: "Versión",
  serverType: "Tipo de servidor",
  repoUrl: "Repositorio",
  runtime: "Runtime",
  entrypoint: "Entrypoint",
  mode: "Modo",
};

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();

  const service = await prisma.service.findFirst({
    where: user.role === "ADMIN" ? { id } : { id, userId: user.id },
    include: {
      plan: true,
      node: true,
      events: { orderBy: { createdAt: "desc" }, take: 20 },
    },
  });
  if (!service) notFound();

  const meta = SERVICE_TYPE_META[service.type];
  const config = (service.config ?? {}) as Record<string, string>;

  return (
    <div className="max-w-5xl space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold">{service.name}</h2>
              <StatusBadge status={service.status} />
            </div>
            <p className="mt-1 text-sm text-slate-400">
              {meta.label} · {service.plan.name}
            </p>
          </div>
          <ServiceActions serviceId={service.id} status={service.status} />
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Dirección", service.ipAddress && service.port ? `${service.ipAddress}:${service.port}` : "Pendiente"],
            ["CPU", `${service.plan.cpuCores} vCPU`],
            ["RAM", formatRam(service.plan.ramMb)],
            ["Disco", formatDisk(service.plan.diskMb)],
            ["Nodo", service.node?.name ?? "Sin asignar"],
            ["Región", service.node?.region ?? "—"],
            ["Precio", `${formatPrice(service.plan.priceCents)}/mes`],
            [
              "Renovación",
              service.expiresAt
                ? service.expiresAt.toLocaleDateString("es-ES")
                : "—",
            ],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-white/5 p-3">
              <dt className="text-xs text-slate-500">{label}</dt>
              <dd className="mt-1 text-sm font-medium">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h3 className="font-semibold">Configuración</h3>
          <dl className="mt-4 space-y-3 text-sm">
            {Object.entries(config).map(([key, value]) => (
              <div key={key} className="flex justify-between gap-4">
                <dt className="text-slate-400">{CONFIG_LABELS[key] ?? key}</dt>
                <dd className="truncate font-mono text-slate-200">{value}</dd>
              </div>
            ))}
            {Object.keys(config).length === 0 && (
              <p className="text-slate-400">Sin configuración adicional.</p>
            )}
          </dl>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h3 className="font-semibold">Actividad reciente</h3>
          <ul className="mt-4 space-y-3 text-sm">
            {service.events.map((event) => (
              <li key={event.id} className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                <div>
                  <p className="text-slate-200">{event.message}</p>
                  <p className="text-xs text-slate-500">
                    {event.createdAt.toLocaleString("es-ES")}
                    {event.actor ? ` · ${event.actor}` : ""}
                  </p>
                </div>
              </li>
            ))}
            {service.events.length === 0 && (
              <p className="text-slate-400">Sin eventos registrados.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
