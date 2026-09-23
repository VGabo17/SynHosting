import Link from "next/link";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 text-sm font-black text-slate-950">
        S
      </span>
      <span className="text-lg font-semibold tracking-tight">
        Syn<span className="text-emerald-400">Hosting</span>
      </span>
    </Link>
  );
}
