"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand";
import { logoutAction } from "@/app/actions/auth";

export type NavItem = { href: string; label: string; exact?: boolean };

export function AppShell({
  navItems,
  user,
  children,
}: {
  navItems: NavItem[];
  user: { name?: string | null; email?: string | null; role: string };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const title =
    [...navItems]
      .sort((a, b) => b.href.length - a.href.length)
      .find((item) => pathname.startsWith(item.href))?.label ?? "Panel";

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-white/5 bg-white/[0.02] p-6 lg:flex">
        <Logo href="/" />
        <nav className="mt-8 flex-1 space-y-1">
          {navItems.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-xl px-3 py-2 text-sm transition ${
                  active
                    ? "bg-emerald-400/10 text-emerald-300"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="rounded-xl border border-white/10 p-3 text-sm">
          <p className="truncate font-medium">{user.name ?? user.email}</p>
          <p className="truncate text-xs text-slate-500">{user.email}</p>
          <form action={logoutAction} className="mt-3">
            <button
              type="submit"
              className="w-full rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-white/5"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-white/5 px-6">
          <h1 className="text-lg font-semibold">{title}</h1>
          <div className="flex items-center gap-3">
            {user.role === "ADMIN" && (
              <Link
                href="/admin"
                className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-white/5"
              >
                Admin
              </Link>
            )}
            <Link
              href="/dashboard"
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-white/5"
            >
              Panel
            </Link>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
