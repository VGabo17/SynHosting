import Link from "next/link";
import { ServiceStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/status-badge";
import { SERVICE_TYPE_META, formatPrice } from "@/lib/services";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [users, services, plans, nodes, recent, mrrServices] =
    await Promise.all([
      prisma.user.count(),
      prisma.service.count({ where: { status: { not: ServiceStatus.DELETED } } }),
      prisma.plan.count({ where: { isActive: true } }),
      prisma.node.count(),
      prisma.service.findMany({
        include: { plan: true, user: true },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
      prisma.service.findMany({
        where: { status: { not: ServiceStatus.DELETED } },
        select: { plan: { select: { priceCents: true } } },
      }),
    ]);

  const mrr = mrrServices.reduce(
    (total, service) => total + service.plan.priceCents,
    0,
  );

  const stats = [
    { label: "Usuarios", value: String(users) },
    { label: "Servicios activos", value: String(services) },
    { label: "Planes publicados", value: String(plans) },
    { label: "Nodos", value: String(nodes) },
    { label: "MRR estimado", value: formatPrice(mrr) },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
          >
            <p className="text-sm text-slate-400">{stat.label}</p>
            <p className="mt-2 text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Últimos servicios creados</h2>
          <Link
            href="/admin/services"
            className="text-sm text-emerald-400 hover:underline"
          >
            Ver todos
          </Link>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="pb-3">Servicio</th>
                <th className="pb-3">Cliente</th>
                <th className="pb-3">Tipo</th>
                <th className="pb-3">Plan</th>
                <th className="pb-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recent.map((service) => (
                <tr key={service.id}>
                  <td className="py-3">
                    <Link
                      href={`/dashboard/services/${service.id}`}
                      className="hover:text-emerald-300"
                    >
                      {service.name}
                    </Link>
                  </td>
                  <td className="py-3 text-slate-400">{service.user.email}</td>
                  <td className="py-3 text-slate-400">
                    {SERVICE_TYPE_META[service.type].label}
                  </td>
                  <td className="py-3 text-slate-400">{service.plan.name}</td>
                  <td className="py-3">
                    <StatusBadge status={service.status} />
                  </td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-400">
                    Todavía no hay servicios.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
