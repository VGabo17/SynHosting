"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand";
import { logoutAction } from "@/app/actions/auth";

export type NavItem = { href: string; label: string; exact?: boolean };

function SidebarContent({
  navItems,
  user,
  pathname,
  onNavigate,
}: {
  navItems: NavItem[];
  user: { name?: string | null; email?: string | null; role: string };
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <>
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
              onClick={onNavigate}
              className={`block rounded-xl px-3 py-2 text-sm transition ${
                active
                  ? "bg-gradient-to-r from-cyan-400/15 to-violet-500/15 text-cyan-200"
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
    </>
  );
}

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
  const [open, setOpen] = useState(false);
  const title =
    [...navItems]
      .sort((a, b) => b.href.length - a.href.length)
      .find((item) => pathname.startsWith(item.href))?.label ?? "Panel";

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-white/5 bg-white/[0.02] p-6 lg:flex">
        <SidebarContent navItems={navItems} user={user} pathname={pathname} />
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col border-r border-violet-400/20 bg-[#070b16] p-6">
            <SidebarContent
              navItems={navItems}
              user={user}
              pathname={pathname}
              onNavigate={() => setOpen(false)}
            />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between gap-3 border-b border-white/5 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={open}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 text-slate-950 lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <h1 className="truncate text-lg font-semibold">{title}</h1>
          </div>
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
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
