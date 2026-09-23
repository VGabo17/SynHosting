"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bot, ChevronDown, Menu, Send, Server, X } from "lucide-react";
import { Logo } from "@/components/brand";

type MenuLink = {
  href: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

const serviceMenu: MenuLink[] = [
  {
    href: "/planes/minecraft-budget",
    label: "Minecraft Budget",
    description: "Servidores económicos para jugar con amigos.",
    icon: Server,
  },
  {
    href: "/planes/minecraft-premium",
    label: "Minecraft Premium",
    description: "CPU dedicada para redes y modpacks pesados.",
    icon: Server,
  },
  {
    href: "/planes/discord",
    label: "Bot de Discord",
    description: "Despliega tu bot desde Git y mantenlo 24/7.",
    icon: Bot,
  },
  {
    href: "/planes/telegram",
    label: "Bot de Telegram",
    description: "Webhooks o long polling con reinicio automático.",
    icon: Send,
  },
];

export function SiteHeader({ isAuthenticated }: { isAuthenticated: boolean }) {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[#05070d]/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Logo />

        <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              type="button"
              onClick={() => setServicesOpen((value) => !value)}
              className="flex items-center gap-1 hover:text-white"
              aria-expanded={servicesOpen}
            >
              Servicios
              <ChevronDown
                className={`h-4 w-4 transition ${servicesOpen ? "rotate-180" : ""}`}
              />
            </button>
            {servicesOpen && (
              <div className="absolute left-1/2 top-full w-80 -translate-x-1/2 pt-3">
                <div className="rounded-2xl border border-violet-400/20 bg-[#0a0f1c] p-2 shadow-2xl shadow-violet-500/10">
                  {serviceMenu.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setServicesOpen(false)}
                      className="flex gap-3 rounded-xl p-3 transition hover:bg-white/5"
                    >
                      <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500 text-slate-950">
                        <item.icon className="h-4 w-4" />
                      </span>
                      <span>
                        <span className="block text-sm font-medium text-white">
                          {item.label}
                        </span>
                        <span className="block text-xs text-slate-400">
                          {item.description}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <a href="#planes" className="hover:text-white">
            Planes
          </a>
          <a href="#infraestructura" className="hover:text-white">
            Infraestructura
          </a>
        </nav>

        <div className="hidden items-center gap-3 text-sm md:flex">
          {isAuthenticated ? (
            <Link
              href="/dashboard"
              className="rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-2 font-semibold text-slate-950"
            >
              Mi panel
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-slate-300 hover:text-white">
                Entrar
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-2 font-semibold text-slate-950"
              >
                Crear cuenta
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 text-slate-950 md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/5 bg-[#05070d] md:hidden">
          <div className="space-y-2 px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-300">
              Servicios
            </p>
            {serviceMenu.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500 text-slate-950">
                  <item.icon className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-sm font-medium">{item.label}</span>
                  <span className="block text-xs text-slate-400">
                    {item.description}
                  </span>
                </span>
              </Link>
            ))}

            <div className="flex flex-col gap-2 pt-3 text-sm">
              <a
                href="#planes"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-white/10 px-4 py-2.5 text-center"
              >
                Planes
              </a>
              <a
                href="#infraestructura"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-white/10 px-4 py-2.5 text-center"
              >
                Infraestructura
              </a>
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-2.5 text-center font-semibold text-slate-950"
                >
                  Mi panel
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="rounded-xl border border-white/10 px-4 py-2.5 text-center"
                  >
                    Entrar
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-2.5 text-center font-semibold text-slate-950"
                  >
                    Crear cuenta
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
