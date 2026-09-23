"use client";

import { useActionState, useState } from "react";
import type { Plan } from "@prisma/client";
import { ServiceType } from "@prisma/client";
import {
  createServiceAction,
  type ServiceFormState,
} from "@/app/actions/services";
import { SubmitButton } from "@/components/submit-button";
import {
  SERVICE_TYPES,
  SERVICE_TYPE_META,
  formatPrice,
  formatRam,
} from "@/lib/services";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="text-slate-300">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

export function NewServiceForm({
  plans,
  defaultType,
  defaultPlanId,
}: {
  plans: Plan[];
  defaultType: ServiceType;
  defaultPlanId?: string;
}) {
  const [state, formAction] = useActionState<ServiceFormState, FormData>(
    createServiceAction,
    undefined,
  );
  const [type, setType] = useState<ServiceType>(defaultType);
  const typePlans = plans.filter((plan) => plan.type === type);
  const [planId, setPlanId] = useState<string>(
    defaultPlanId ?? typePlans[0]?.id ?? "",
  );

  function changeType(next: ServiceType) {
    setType(next);
    setPlanId(plans.find((plan) => plan.type === next)?.id ?? "");
  }

  return (
    <form action={formAction} className="space-y-8">
      {state?.error && (
        <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-sm text-rose-300">
          {state.error}
        </p>
      )}

      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="planId" value={planId} />

      <section>
        <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
          1. Tipo de servicio
        </h3>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {SERVICE_TYPES.map((option) => {
            const meta = SERVICE_TYPE_META[option];
            return (
              <button
                key={option}
                type="button"
                onClick={() => changeType(option)}
                className={`rounded-2xl border p-4 text-left transition ${
                  type === option
                    ? "border-cyan-400/50 bg-cyan-400/10"
                    : "border-white/10 bg-white/[0.03] hover:border-white/25"
                }`}
              >
                <p className="font-semibold">{meta.label}</p>
                <p className="mt-1 text-xs text-slate-400">{meta.tagline}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
          2. Plan
        </h3>
        {typePlans.length === 0 ? (
          <p className="mt-4 text-sm text-slate-400">
            No hay planes disponibles para este tipo de servicio.
          </p>
        ) : (
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {typePlans.map((plan) => (
              <button
                key={plan.id}
                type="button"
                onClick={() => setPlanId(plan.id)}
                className={`rounded-2xl border p-4 text-left transition ${
                  planId === plan.id
                    ? "border-cyan-400/50 bg-cyan-400/10"
                    : "border-white/10 bg-white/[0.03] hover:border-white/25"
                }`}
              >
                <p className="font-semibold">{plan.name}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {plan.cpuCores} vCPU · {formatRam(plan.ramMb)}
                </p>
                <p className="mt-2 text-sm font-bold text-cyan-300">
                  {formatPrice(plan.priceCents)}
                  <span className="text-xs font-normal text-slate-400">
                    /mes
                  </span>
                </p>
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
          3. Configuración
        </h3>

        <Field label="Nombre del servicio">
          <input
            className={inputClass}
            name="name"
            required
            minLength={3}
            placeholder="mi-servidor"
          />
        </Field>

        {type === ServiceType.MINECRAFT && (
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Versión">
              <input
                className={inputClass}
                name="version"
                defaultValue="1.21.1"
                required
              />
            </Field>
            <Field label="Tipo de servidor">
              <select className={inputClass} name="serverType" defaultValue="PAPER">
                <option value="VANILLA">Vanilla</option>
                <option value="PAPER">Paper</option>
                <option value="FORGE">Forge</option>
                <option value="FABRIC">Fabric</option>
              </select>
            </Field>
          </div>
        )}

        {type === ServiceType.DISCORD_BOT && (
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Repositorio Git">
              <input
                className={inputClass}
                name="repoUrl"
                required
                placeholder="https://github.com/usuario/mi-bot"
              />
            </Field>
            <Field label="Runtime">
              <select className={inputClass} name="runtime" defaultValue="NODE">
                <option value="NODE">Node.js</option>
                <option value="PYTHON">Python</option>
                <option value="JAVA">Java</option>
              </select>
            </Field>
            <Field label="Entrypoint">
              <input
                className={inputClass}
                name="entrypoint"
                defaultValue="index.js"
                required
              />
            </Field>
          </div>
        )}

        {type === ServiceType.TELEGRAM_BOT && (
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Repositorio Git">
              <input
                className={inputClass}
                name="repoUrl"
                required
                placeholder="https://github.com/usuario/mi-bot"
              />
            </Field>
            <Field label="Runtime">
              <select className={inputClass} name="runtime" defaultValue="PYTHON">
                <option value="NODE">Node.js</option>
                <option value="PYTHON">Python</option>
                <option value="JAVA">Java</option>
              </select>
            </Field>
            <Field label="Modo">
              <select className={inputClass} name="mode" defaultValue="POLLING">
                <option value="POLLING">Long polling</option>
                <option value="WEBHOOK">Webhook</option>
              </select>
            </Field>
          </div>
        )}
      </section>

      <SubmitButton pendingLabel="Aprovisionando…">Crear servicio</SubmitButton>
    </form>
  );
}
