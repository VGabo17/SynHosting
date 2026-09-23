import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ServiceStatusSelect } from "@/components/admin-controls";
import { SERVICE_TYPE_META } from "@/lib/services";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({
    include: { plan: true, user: true, node: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <h2 className="font-semibold">Servicios ({services.length})</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="pb-3">Servicio</th>
              <th className="pb-3">Cliente</th>
              <th className="pb-3">Tipo</th>
              <th className="pb-3">Plan</th>
              <th className="pb-3">Nodo</th>
              <th className="pb-3">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {services.map((service) => (
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
                <td className="py-3 text-slate-400">
                  {service.node?.name ?? "—"}
                </td>
                <td className="py-3">
                  <ServiceStatusSelect
                    serviceId={service.id}
                    status={service.status}
                  />
                </td>
              </tr>
            ))}
            {services.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-slate-400">
                  Todavía no hay servicios.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
