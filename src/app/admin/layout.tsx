import { AppShell, type NavItem } from "@/components/app-shell";
import { requireAdmin } from "@/lib/session";

const navItems: NavItem[] = [
  { href: "/admin", label: "Resumen", exact: true },
  { href: "/admin/users", label: "Usuarios" },
  { href: "/admin/plans", label: "Planes" },
  { href: "/admin/services", label: "Servicios" },
  { href: "/admin/nodes", label: "Nodos" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <AppShell navItems={navItems} user={user}>
      {children}
    </AppShell>
  );
}
