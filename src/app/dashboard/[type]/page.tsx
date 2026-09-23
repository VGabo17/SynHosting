import Link from "next/link";
import { notFound } from "next/navigation";
import { ServiceStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { ServiceCard } from "@/components/service-card";
import {
  SERVICE_TYPE_META,
  formatPrice,
  serviceTypeFromSlug,
} from "@/lib/services";

export const dynamic = "force-dynamic";

const typeHighlights: Record<string, string[]> = {
  MINECRAFT: [
    "Consola en vivo y gestión de plugins",
    "Backups diarios automáticos",
    "Soporte para Paper, Forge y Fabric",
  ],
  DISCORD_BOT: [
    "Despliegue desde un repositorio Git",
    "Variables de entorno cifradas",
    "Reinicio automático ante fallos",
  ],
  TELEGRAM_BOT: [
    "Modo webhook o long polling",
    "Certificados TLS gestionados",
    "Logs persistentes de los últimos 7 días",
  ],
};

export default async function ServiceTypePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type: slug } = await params;
  const type = serviceTypeFromSlug(slug);
  if (!type) notFound();

  const user = await requireUser();
  const meta = SERVICE_TYPE_META[type];

  const [services, plans] = await Promise.all([
    prisma.service.findMany({
      where: { userId: user.id, type, status: { not: ServiceStatus.DELETED } },
      include: { plan: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.plan.findMany({
      where: { type, isActive: true },
      orderBy: { priceCents: "asc" },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-xl font-semibold">{meta.label}</h2>
        <p className="mt-1 text-sm text-slate-400">{meta.tagline}</p>
        <ul className="mt-4 grid gap-2 text-sm text-slate-300 sm:grid-cols-3">
          {typeHighlights[type].map((highlight) => (
            <li key={highlight} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
              {highlight}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Tus servicios de {meta.label}
          </h3>
          <Link
            href={`/dashboard/new?type=${meta.slug}`}
            className="rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-2 text-sm font-semibold text-slate-950"
          >
            Añadir
          </Link>
        </div>
        {services.length === 0 ? (
          <p className="mt-5 rounded-2xl border border-dashed border-white/15 p-8 text-center text-sm text-slate-400">
            No tienes servicios de {meta.label} todavía.
          </p>
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold">Planes disponibles</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <p className="font-semibold">{plan.name}</p>
              <p className="mt-1 text-sm text-slate-400">{plan.description}</p>
              <p className="mt-3 text-lg font-bold text-cyan-300">
                {formatPrice(plan.priceCents)}
                <span className="text-xs font-normal text-slate-400">/mes</span>
              </p>
            </div>
          ))}
          {plans.length === 0 && (
            <p className="text-sm text-slate-400">
              No hay planes publicados para este tipo de servicio.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
