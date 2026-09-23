import { PlanTier, ServiceStatus, ServiceType } from "@prisma/client";

export type PlanCategory = {
  slug: string;
  label: string;
  title: string;
  description: string;
  type: ServiceType;
  tier: PlanTier | null;
};

export const PLAN_CATEGORIES: PlanCategory[] = [
  {
    slug: "minecraft-budget",
    label: "Minecraft Budget",
    title: "Minecraft Budget",
    description:
      "Servidores económicos con recursos compartidos, ideales para survival con amigos y plugins ligeros.",
    type: ServiceType.MINECRAFT,
    tier: PlanTier.BUDGET,
  },
  {
    slug: "minecraft-premium",
    label: "Minecraft Premium",
    title: "Minecraft Premium",
    description:
      "CPU dedicada, backups frecuentes e IP dedicada para redes, modpacks pesados y comunidades grandes.",
    type: ServiceType.MINECRAFT,
    tier: PlanTier.PREMIUM,
  },
  {
    slug: "discord",
    label: "Bot de Discord",
    title: "Hosting para bots de Discord",
    description:
      "Despliega tu bot desde un repositorio Git, con reinicio automático, sharding y variables cifradas.",
    type: ServiceType.DISCORD_BOT,
    tier: null,
  },
  {
    slug: "telegram",
    label: "Bot de Telegram",
    title: "Hosting para bots de Telegram",
    description:
      "Long polling o webhooks con TLS gestionado, métricas y reinicio automático ante fallos.",
    type: ServiceType.TELEGRAM_BOT,
    tier: null,
  },
];

export function planCategoryFromSlug(slug: string): PlanCategory | null {
  return PLAN_CATEGORIES.find((category) => category.slug === slug) ?? null;
}

export const SERVICE_TYPES = [
  ServiceType.MINECRAFT,
  ServiceType.DISCORD_BOT,
  ServiceType.TELEGRAM_BOT,
] as const;

type ServiceTypeMeta = {
  label: string;
  slug: string;
  tagline: string;
  accent: string;
  badge: string;
};

export const SERVICE_TYPE_META: Record<ServiceType, ServiceTypeMeta> = {
  MINECRAFT: {
    label: "Minecraft",
    slug: "minecraft",
    tagline: "Servidores con CPU dedicada, backups y consola en vivo.",
    accent: "from-cyan-400 to-violet-500",
    badge: "bg-cyan-500/10 text-cyan-300 ring-cyan-500/30",
  },
  DISCORD_BOT: {
    label: "Bot de Discord",
    slug: "discord",
    tagline: "Despliega tu bot desde Git y mantenlo online 24/7.",
    accent: "from-violet-500 to-fuchsia-400",
    badge: "bg-violet-500/10 text-violet-300 ring-violet-500/30",
  },
  TELEGRAM_BOT: {
    label: "Bot de Telegram",
    slug: "telegram",
    tagline: "Webhooks o long polling con reinicio automático.",
    accent: "from-sky-400 to-cyan-300",

    badge: "bg-sky-500/10 text-sky-300 ring-sky-500/30",
  },
};

export const SERVICE_STATUS_META: Record<
  ServiceStatus,
  { label: string; badge: string; dot: string }
> = {
  PROVISIONING: {
    label: "Aprovisionando",
    badge: "bg-amber-500/10 text-amber-300 ring-amber-500/30",
    dot: "bg-amber-400",
  },
  RUNNING: {
    label: "En línea",
    badge: "bg-emerald-500/10 text-emerald-300 ring-emerald-500/30",

    dot: "bg-emerald-400",
  },
  STOPPED: {
    label: "Detenido",
    badge: "bg-slate-500/10 text-slate-300 ring-slate-500/30",
    dot: "bg-slate-400",
  },
  SUSPENDED: {
    label: "Suspendido",
    badge: "bg-rose-500/10 text-rose-300 ring-rose-500/30",
    dot: "bg-rose-400",
  },
  DELETED: {
    label: "Eliminado",
    badge: "bg-slate-700/40 text-slate-400 ring-slate-600/30",
    dot: "bg-slate-600",
  },
};

export function serviceTypeFromSlug(slug: string): ServiceType | null {
  const entry = Object.entries(SERVICE_TYPE_META).find(
    ([, meta]) => meta.slug === slug,
  );
  return entry ? (entry[0] as ServiceType) : null;
}

export function formatPrice(priceCents: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: priceCents % 100 === 0 ? 0 : 2,
  }).format(priceCents / 100);
}

export function formatRam(ramMb: number): string {
  return ramMb >= 1024 ? `${ramMb / 1024} GB` : `${ramMb} MB`;
}

export function formatDisk(diskMb: number): string {
  return diskMb >= 1024 ? `${Math.round(diskMb / 1024)} GB` : `${diskMb} MB`;
}
