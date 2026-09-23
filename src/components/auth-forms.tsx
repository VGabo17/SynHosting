"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction, registerAction, type FormState } from "@/app/actions/auth";
import { SubmitButton } from "@/components/submit-button";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60";

function ErrorMessage({ state }: { state: FormState }) {
  if (!state?.error) return null;
  return (
    <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-sm text-rose-300">
      {state.error}
    </p>
  );
}

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, formAction] = useActionState(loginAction, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Bienvenido de nuevo</h1>
        <p className="mt-1 text-sm text-slate-400">
          Accede para gestionar tus servicios.
        </p>
      </div>
      <ErrorMessage state={state} />
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <label className="block text-sm">
        <span className="text-slate-300">Email</span>
        <input
          className={`mt-1.5 ${inputClass}`}
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="tu@email.com"
        />
      </label>
      <label className="block text-sm">
        <span className="text-slate-300">Contraseña</span>
        <input
          className={`mt-1.5 ${inputClass}`}
          type="password"
          name="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
        />
      </label>
      <SubmitButton className="w-full" pendingLabel="Entrando…">
        Entrar
      </SubmitButton>
      <p className="text-center text-sm text-slate-400">
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="text-cyan-400 hover:underline">
          Regístrate
        </Link>
      </p>
    </form>
  );
}

export function RegisterForm() {
  const [state, formAction] = useActionState(registerAction, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Crea tu cuenta</h1>
        <p className="mt-1 text-sm text-slate-400">
          Empieza a desplegar servidores y bots en minutos.
        </p>
      </div>
      <ErrorMessage state={state} />
      <label className="block text-sm">
        <span className="text-slate-300">Nombre</span>
        <input
          className={`mt-1.5 ${inputClass}`}
          name="name"
          required
          autoComplete="name"
          placeholder="Tu nombre"
        />
      </label>
      <label className="block text-sm">
        <span className="text-slate-300">Email</span>
        <input
          className={`mt-1.5 ${inputClass}`}
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="tu@email.com"
        />
      </label>
      <label className="block text-sm">
        <span className="text-slate-300">Contraseña</span>
        <input
          className={`mt-1.5 ${inputClass}`}
          type="password"
          name="password"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="Mínimo 8 caracteres"
        />
      </label>
      <label className="block text-sm">
        <span className="text-slate-300">Repite la contraseña</span>
        <input
          className={`mt-1.5 ${inputClass}`}
          type="password"
          name="confirmPassword"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="••••••••"
        />
      </label>
      <SubmitButton className="w-full" pendingLabel="Creando cuenta…">
        Crear cuenta
      </SubmitButton>
      <p className="text-center text-sm text-slate-400">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="text-cyan-400 hover:underline">
          Entrar
        </Link>
      </p>
    </form>
  );
}
