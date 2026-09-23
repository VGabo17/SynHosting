"use client";

import { useActionState, useTransition } from "react";
import { PlanTier, Role, ServiceStatus, ServiceType } from "@prisma/client";
import {
  setServiceStatusAction,
  setUserRoleAction,
  togglePlanAction,
  upsertPlanAction,
  type AdminFormState,
} from "@/app/actions/admin";
import { SubmitButton } from "@/components/submit-button";
import { SERVICE_STATUS_META, SERVICE_TYPE_META } from "@/lib/services";

const controlClass =
  "rounded-lg border border-white/10 bg-slate-950/60 px-2.5 py-1.5 text-xs outline-none focus:border-cyan-400/60";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60";

export function UserRoleSelect({
  userId,
  role,
}: {
  userId: string;
  role: Role;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      className={controlClass}
      defaultValue={role}
      disabled={pending}
      onChange={(event) =>
        startTransition(() =>
          setUserRoleAction(userId, event.target.value as Role).then(
            () => undefined,
          ),
        )
      }
    >
      <option value={Role.USER}>Cliente</option>
      <option value={Role.ADMIN}>Administrador</option>
    </select>
  );
}

export function ServiceStatusSelect({
  serviceId,
  status,
}: {
  serviceId: string;
  status: ServiceStatus;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      className={controlClass}
      defaultValue={status}
      disabled={pending}
      onChange={(event) =>
        startTransition(() =>
          setServiceStatusAction(
            serviceId,
            event.target.value as ServiceStatus,
          ).then(() => undefined),
        )
      }
    >
      {Object.entries(SERVICE_STATUS_META).map(([value, meta]) => (
        <option key={value} value={value}>
          {meta.label}
        </option>
      ))}
    </select>
  );
}

export function PlanToggle({
  planId,
  isActive,
}: {
  planId: string;
  isActive: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(() =>
          togglePlanAction(planId, !isActive).then(() => undefined),
        )
      }
      className={`rounded-lg px-3 py-1.5 text-xs ring-1 transition ${
        isActive
          ? "bg-cyan-500/10 text-cyan-300 ring-cyan-500/30"
          : "bg-slate-500/10 text-slate-300 ring-slate-500/30"
      }`}
    >
      {isActive ? "Activo" : "Inactivo"}
    </button>
  );
}

export function PlanForm() {
  const [state, formAction] = useActionState<AdminFormState, FormData>(
    upsertPlanAction,
    undefined,
  );

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-sm text-rose-300">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2.5 text-sm text-cyan-300">
          {state.success}
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <input className={inputClass} name="name" placeholder="Nombre" required />
        <input
          className={inputClass}
          name="slug"
          placeholder="slug-del-plan"
          required
        />
        <select className={inputClass} name="type" defaultValue={ServiceType.MINECRAFT}>
          {Object.entries(SERVICE_TYPE_META).map(([value, meta]) => (
            <option key={value} value={value}>
              {meta.label}
            </option>
          ))}
        </select>
        <select className={inputClass} name="tier" defaultValue={PlanTier.BUDGET}>
          <option value={PlanTier.BUDGET}>Budget</option>
          <option value={PlanTier.PREMIUM}>Premium</option>
        </select>
        <input
          className={inputClass}
          name="priceCents"
          type="number"
          min={0}
          placeholder="Precio en céntimos"
          required
        />
        <input
          className={inputClass}
          name="cpuCores"
          type="number"
          step="0.5"
          min={0.5}
          placeholder="vCPU"
          required
        />
        <input
          className={inputClass}
          name="ramMb"
          type="number"
          min={128}
          placeholder="RAM (MB)"
          required
        />
        <input
          className={inputClass}
          name="diskMb"
          type="number"
          min={512}
          placeholder="Disco (MB)"
          required
        />
        <input
          className={inputClass}
          name="maxPlayers"
          type="number"
          min={0}
          placeholder="Slots (solo Minecraft)"
        />
      </div>
      <input
        className={inputClass}
        name="description"
        placeholder="Descripción"
        required
      />
      <input
        className={inputClass}
        name="features"
        placeholder="Características separadas por comas"
      />
      <SubmitButton pendingLabel="Guardando…">Guardar plan</SubmitButton>
    </form>
  );
}
