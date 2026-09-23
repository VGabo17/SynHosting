"use client";

import { useTransition } from "react";
import { ServiceStatus } from "@prisma/client";
import {
  deleteServiceAction,
  setServicePowerAction,
} from "@/app/actions/services";

export function ServiceActions({
  serviceId,
  status,
}: {
  serviceId: string;
  status: ServiceStatus;
}) {
  const [pending, startTransition] = useTransition();
  const isRunning = status === ServiceStatus.RUNNING;

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        disabled={pending || status === ServiceStatus.DELETED}
        onClick={() =>
          startTransition(() =>
            setServicePowerAction(serviceId, isRunning ? "stop" : "start").then(
              () => undefined,
            ),
          )
        }
        className="rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:opacity-90 disabled:opacity-50"
      >
        {isRunning ? "Detener" : "Iniciar"}
      </button>
      <button
        type="button"
        disabled={pending || status === ServiceStatus.DELETED}
        onClick={() => {
          if (!confirm("¿Seguro que quieres eliminar este servicio?")) return;
          startTransition(() =>
            deleteServiceAction(serviceId).then(() => undefined),
          );
        }}
        className="rounded-xl border border-rose-500/40 px-4 py-2 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/10 disabled:opacity-50"
      >
        Eliminar
      </button>
    </div>
  );
}
