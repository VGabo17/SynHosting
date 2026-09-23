import Link from "next/link";
import {
  Activity,
  Bot,
  Cpu,
  Globe2,
  LifeBuoy,
  Send,
  Server,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Logo } from "@/components/brand";
import { PlanCard } from "@/components/plan-card";
import { SiteHeader } from "@/components/site-header";
import { PLAN_CATEGORIES, SERVICE_TYPE_META, SERVICE_TYPES } from "@/lib/services";
import type { ServiceType } from "@prisma/client";

export const dynamic = "force-dynamic";

const typeIcon: Record<ServiceType, React.ComponentType<{ className?: string }>> =
  {
    MINECRAFT: Server,
    DISCORD_BOT: Bot,
    TELEGRAM_BOT: Send,
  };

const features = [
  {
    icon: Zap,
    title: "Despliegue en 60 segundos",
    body: "Elige plan, configura y tu servicio queda aprovisionado automáticamente en el nodo con menos carga.",
  },
  {
    icon: Cpu,
    title: "CPU Ryzen y NVMe",
    body: "Hardware de alta frecuencia pensado para el tick rate de Minecraft y la latencia de los bots.",
  },
  {
    icon: ShieldCheck,
    title: "Protección anti-DDoS",
    body: "Filtrado en el borde de la red incluido en todos los planes, sin coste adicional.",
  },
  {
    icon: Activity,
    title: "Métricas en tiempo real",
    body: "CPU, RAM y estado del contenedor desde el panel, con historial de eventos por servicio.",
  },
  {
    icon: Globe2,
    title: "Nodos en varias regiones",
    body: "Coloca tu servicio cerca de tu comunidad para reducir el ping al mínimo.",
  },
  {
    icon: LifeBuoy,
    title: "Soporte técnico real",
    body: "Un equipo que entiende de Java, Node y Python, no solo de tickets.",
  },
];

export default async function LandingPage() {
  const [session, plans] = await Promise.all([
    auth(),
    prisma.plan.findMany({
      where: { isActive: true },
      orderBy: [{ type: "asc" }, { priceCents: "asc" }],
    }),
  ]);

  const plansByCategory = PLAN_CATEGORIES.map((category) => ({
    category,
    plans: plans.filter(
      (plan) =>
        plan.type === category.type &&
        (category.tier === null || plan.tier === category.tier),
    ),
  }));

  return (
    <div className="glow-grid min-h-screen">
      <SiteHeader isAuthenticated={Boolean(session?.user)} />

      <main>
        <section className="mx-auto max-w-6xl px-6 pt-20 pb-24 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
            <Zap className="h-3.5 w-3.5" /> Aprovisionamiento automático en
            segundos
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
            Hosting para tus{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
              servidores y bots
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            Minecraft, bots de Discord y bots de Telegram en una sola
            plataforma: un panel, una factura y la misma infraestructura de alto
            rendimiento.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/register"
              className="rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90"
            >
              Empezar gratis
            </Link>
            <a
              href="#planes"
              className="rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold transition hover:bg-white/5"
            >
              Ver planes
            </a>
          </div>
          <dl className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              ["99.9%", "Uptime"],
              ["<20 ms", "Latencia UE"],
              ["24/7", "Soporte"],
              ["60 s", "Despliegue"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <dt className="text-2xl font-bold text-cyan-400">{value}</dt>
                <dd className="text-xs text-slate-400">{label}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="servicios" className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-3xl font-bold tracking-tight">
            Un panel, tres tipos de servicio
          </h2>
          <p className="mt-3 max-w-2xl text-slate-400">
            Cada servicio tiene su propia vista, su configuración y sus métricas.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {SERVICE_TYPES.map((type) => {
              const meta = SERVICE_TYPE_META[type];
              const Icon = typeIcon[type];
              const category = PLAN_CATEGORIES.find(
                (item) => item.type === type,
              );
              return (
                <Link
                  key={type}
                  href={`/planes/${category?.slug ?? ""}`}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-violet-400/40 hover:bg-white/[0.06]"
                >
                  <span
                    className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${meta.accent} text-slate-950`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold">{meta.label}</h3>
                  <p className="mt-2 text-sm text-slate-400">{meta.tagline}</p>
                </Link>
              );
            })}
          </div>
        </section>

        <section id="planes" className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-3xl font-bold tracking-tight">Planes</h2>
          <p className="mt-3 max-w-2xl text-slate-400">
            Sin permanencia. Cambia de plan o cancela cuando quieras.
          </p>
          {plansByCategory.map(({ category, plans: categoryPlans }) =>
            categoryPlans.length === 0 ? null : (
              <div key={category.slug} className="mt-12">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-violet-300">
                    {category.label}
                  </h3>
                  <Link
                    href={`/planes/${category.slug}`}
                    className="text-sm text-cyan-300 hover:text-cyan-200"
                  >
                    Ver detalle →
                  </Link>
                </div>
                <div className="mt-5 grid gap-5 md:grid-cols-3">
                  {categoryPlans.map((plan, index) => (
                    <PlanCard
                      key={plan.id}
                      plan={plan}
                      highlighted={
                        categoryPlans.length > 1 &&
                        index === categoryPlans.length - 1
                      }
                    />
                  ))}
                </div>
              </div>
            ),
          )}
          {plans.length === 0 && (
            <p className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-slate-400">
              Todavía no hay planes publicados. Un administrador puede crearlos
              desde el panel de administración.
            </p>
          )}
        </section>

        <section id="infraestructura" className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-3xl font-bold tracking-tight">
            Infraestructura pensada para escalar
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <feature.icon className="h-5 w-5 text-cyan-400" />
                <h3 className="mt-4 font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{feature.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 to-violet-500/10 p-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Lanza tu primer servicio hoy
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-300">
              Crea tu cuenta, elige un plan y ten tu servidor o bot online en
              menos de un minuto.
            </p>
            <Link
              href="/register"
              className="mt-8 inline-block rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90"
            >
              Crear cuenta gratis
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-slate-500 sm:flex-row">
          <Logo />
          <p>© {new Date().getFullYear()} SynHosting. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
