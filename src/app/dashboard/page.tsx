import Link from "next/link";
import { ServiceStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { ServiceCard } from "@/components/service-card";
import { SERVICE_TYPE_META, SERVICE_TYPES, formatPrice } from "@/lib/services";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireUser();

  const services = await prisma.service.findMany({
    where: { userId: user.id, status: { not: ServiceStatus.DELETED } },
    include: { plan: true },
    orderBy: { createdAt: "desc" },
  });

  const monthlyCents = services.reduce(
    (total, service) => total + service.plan.priceCents,
    0,
  );
  const running = services.filter(
    (service) => service.status === ServiceStatus.RUNNING,
  ).length;

  const stats = [
    { label: "Servicios activos", value: String(services.length) },
    { label: "En línea", value: String(running) },
    { label: "Gasto mensual", value: formatPrice(monthlyCents) },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
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

      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Tus servicios</h2>
          <Link
            href="/dashboard/new"
            className="rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-2 text-sm font-semibold text-slate-950"
          >
            Nuevo servicio
          </Link>
        </div>

        {services.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-dashed border-white/15 p-10 text-center">
            <p className="text-slate-300">Todavía no tienes servicios.</p>
            <p className="mt-1 text-sm text-slate-500">
              Crea un servidor de Minecraft o despliega tu primer bot.
            </p>
            <Link
              href="/dashboard/new"
              className="mt-6 inline-block rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-2.5 text-sm font-semibold text-slate-950"
            >
              Crear servicio
            </Link>
          </div>
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold">Vistas por tipo de servicio</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {SERVICE_TYPES.map((type) => {
            const meta = SERVICE_TYPE_META[type];
            const count = services.filter(
              (service) => service.type === type,
            ).length;
            return (
              <Link
                key={type}
                href={`/dashboard/${meta.slug}`}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-cyan-400/30"
              >
                <p className="font-semibold">{meta.label}</p>
                <p className="mt-1 text-sm text-slate-400">{meta.tagline}</p>
                <p className="mt-4 text-sm text-cyan-300">
                  {count} {count === 1 ? "servicio" : "servicios"}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
