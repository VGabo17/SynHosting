import { prisma } from "@/lib/prisma";
import { PlanForm, PlanToggle } from "@/components/admin-controls";
import {
  SERVICE_TYPE_META,
  formatDisk,
  formatPrice,
  formatRam,
} from "@/lib/services";

export const dynamic = "force-dynamic";

export default async function AdminPlansPage() {
  const plans = await prisma.plan.findMany({
    include: { _count: { select: { services: true } } },
    orderBy: [{ type: "asc" }, { priceCents: "asc" }],
  });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="font-semibold">Planes ({plans.length})</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="pb-3">Plan</th>
                <th className="pb-3">Tipo</th>
                <th className="pb-3">Recursos</th>
                <th className="pb-3">Precio</th>
                <th className="pb-3">Contratados</th>
                <th className="pb-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {plans.map((plan) => (
                <tr key={plan.id}>
                  <td className="py-3">
                    <p>{plan.name}</p>
                    <p className="text-xs text-slate-500">{plan.slug}</p>
                  </td>
                  <td className="py-3 text-slate-400">
                    {SERVICE_TYPE_META[plan.type].label}
                  </td>
                  <td className="py-3 text-slate-400">
                    {plan.cpuCores} vCPU · {formatRam(plan.ramMb)} ·{" "}
                    {formatDisk(plan.diskMb)}
                  </td>
                  <td className="py-3">{formatPrice(plan.priceCents)}</td>
                  <td className="py-3 text-slate-400">{plan._count.services}</td>
                  <td className="py-3">
                    <PlanToggle planId={plan.id} isActive={plan.isActive} />
                  </td>
                </tr>
              ))}
              {plans.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-400">
                    No hay planes creados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="font-semibold">Crear o actualizar plan</h2>
        <p className="mt-1 text-sm text-slate-400">
          Si el slug ya existe, el plan se actualiza.
        </p>
        <div className="mt-5">
          <PlanForm />
        </div>
      </div>
    </div>
  );
}
