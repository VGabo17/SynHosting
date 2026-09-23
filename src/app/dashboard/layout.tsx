import { AppShell, type NavItem } from "@/components/app-shell";
import { requireUser } from "@/lib/session";

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Resumen", exact: true },
  { href: "/dashboard/minecraft", label: "Minecraft" },
  { href: "/dashboard/discord", label: "Bots de Discord" },
  { href: "/dashboard/telegram", label: "Bots de Telegram" },
  { href: "/dashboard/new", label: "Nuevo servicio" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <AppShell navItems={navItems} user={user}>
      {children}
    </AppShell>
  );
}
