import Link from "next/link";
import { Check, Cpu, Gauge, HardDrive, Users } from "lucide-react";
import {
  SERVICE_TYPE_META,
  formatDisk,
  formatPrice,
  formatRam,
} from "@/lib/services";
import type { Plan } from "@prisma/client";

export function PlanCard({
  plan,
  highlighted = false,
  href = "/register",
  ctaLabel = "Contratar",
}: {
  plan: Plan;
  highlighted?: boolean;
  href?: string;
  ctaLabel?: string;
}) {
  const meta = SERVICE_TYPE_META[plan.type];

  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-6 ${
        highlighted
          ? "border-violet-400/40 bg-violet-400/[0.07]"
          : "border-white/10 bg-white/[0.03]"
      }`}
    >
      {highlighted && (
        <span className="absolute -top-3 left-6 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-3 py-1 text-xs font-semibold text-slate-950">
          Más popular
        </span>
      )}
      <span
        className={`w-fit rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${meta.badge}`}
      >
        {meta.label} · {plan.tier === "PREMIUM" ? "Premium" : "Budget"}
      </span>
      <h3 className="mt-4 text-xl font-semibold">{plan.name}</h3>
      <p className="mt-1 text-sm text-slate-400">{plan.description}</p>
      <p className="mt-5 flex items-baseline gap-1">
        <span className="text-3xl font-bold">{formatPrice(plan.priceCents)}</span>
        <span className="text-sm text-slate-400">/mes</span>
      </p>
      <ul className="mt-5 space-y-2 text-sm text-slate-300">
        <li className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-cyan-400" /> {plan.cpuCores} vCPU
        </li>
        <li className="flex items-center gap-2">
          <Gauge className="h-4 w-4 text-cyan-400" /> {formatRam(plan.ramMb)} RAM
        </li>
        <li className="flex items-center gap-2">
          <HardDrive className="h-4 w-4 text-cyan-400" />{" "}
          {formatDisk(plan.diskMb)} NVMe
        </li>
        {plan.maxPlayers ? (
          <li className="flex items-center gap-2">
            <Users className="h-4 w-4 text-cyan-400" /> Hasta {plan.maxPlayers}{" "}
            jugadores
          </li>
        ) : null}
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2">
            <Check className="h-4 w-4 text-violet-300" /> {feature}
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className={`mt-6 rounded-xl px-4 py-2.5 text-center text-sm font-semibold transition ${
          highlighted
            ? "bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-950 hover:opacity-90"
            : "border border-white/15 text-slate-100 hover:bg-white/5"
        }`}
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
