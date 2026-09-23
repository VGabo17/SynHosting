import { PrismaClient, Role, ServiceType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const plans = [
  {
    slug: "mc-iron",
    name: "Iron",
    type: ServiceType.MINECRAFT,
    description: "Para jugar con amigos y mods ligeros.",
    priceCents: 399,
    cpuCores: 1,
    ramMb: 2048,
    diskMb: 20480,
    maxPlayers: 20,
    features: ["Backups diarios", "Consola en vivo", "Anti-DDoS"],
  },
  {
    slug: "mc-diamond",
    name: "Diamond",
    type: ServiceType.MINECRAFT,
    description: "Comunidades medianas con plugins y mundos grandes.",
    priceCents: 899,
    cpuCores: 2,
    ramMb: 6144,
    diskMb: 51200,
    maxPlayers: 60,
    features: ["Backups cada 6 h", "Subdominio gratis", "Soporte prioritario"],
  },
  {
    slug: "mc-netherite",
    name: "Netherite",
    type: ServiceType.MINECRAFT,
    description: "Redes y modpacks pesados con CPU dedicada.",
    priceCents: 1799,
    cpuCores: 4,
    ramMb: 12288,
    diskMb: 102400,
    maxPlayers: 200,
    features: ["CPU dedicada", "Backups horarios", "IP dedicada"],
  },
  {
    slug: "discord-starter",
    name: "Bot Starter",
    type: ServiceType.DISCORD_BOT,
    description: "Bots pequeños con comandos y eventos básicos.",
    priceCents: 199,
    cpuCores: 0.5,
    ramMb: 512,
    diskMb: 5120,
    features: ["Despliegue desde Git", "Reinicio automático"],
  },
  {
    slug: "discord-pro",
    name: "Bot Pro",
    type: ServiceType.DISCORD_BOT,
    description: "Bots con base de datos y varios shards.",
    priceCents: 599,
    cpuCores: 1,
    ramMb: 2048,
    diskMb: 20480,
    features: ["Sharding", "Logs 7 días", "Variables cifradas"],
  },
  {
    slug: "telegram-starter",
    name: "Telegram Starter",
    type: ServiceType.TELEGRAM_BOT,
    description: "Long polling para bots de uso personal.",
    priceCents: 199,
    cpuCores: 0.5,
    ramMb: 512,
    diskMb: 5120,
    features: ["Long polling", "Reinicio automático"],
  },
  {
    slug: "telegram-pro",
    name: "Telegram Pro",
    type: ServiceType.TELEGRAM_BOT,
    description: "Webhooks con TLS gestionado y alta disponibilidad.",
    priceCents: 549,
    cpuCores: 1,
    ramMb: 2048,
    diskMb: 20480,
    features: ["Webhooks TLS", "Métricas", "Logs 7 días"],
  },
];

const nodes = [
  {
    name: "node-eu-1",
    hostname: "eu1.synhosting.net",
    region: "Frankfurt",
    cpuCores: 32,
    ramMb: 131072,
    diskMb: 2097152,
  },
  {
    name: "node-eu-2",
    hostname: "eu2.synhosting.net",
    region: "Madrid",
    cpuCores: 24,
    ramMb: 98304,
    diskMb: 1048576,
  },
];

async function main() {
  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { slug: plan.slug },
      create: plan,
      update: plan,
    });
  }

  for (const node of nodes) {
    await prisma.node.upsert({
      where: { name: node.name },
      create: node,
      update: node,
    });
  }

  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@synhosting.net";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "admin12345";

  await prisma.user.upsert({
    where: { email: adminEmail },
    create: {
      email: adminEmail,
      name: "Administrador",
      role: Role.ADMIN,
      passwordHash: await bcrypt.hash(adminPassword, 12),
    },
    update: { role: Role.ADMIN },
  });

  console.log(`Seed completo. Admin: ${adminEmail}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
