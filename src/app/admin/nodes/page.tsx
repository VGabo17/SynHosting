import { prisma } from "@/lib/prisma";
import { formatDisk, formatRam } from "@/lib/services";

export const dynamic = "force-dynamic";

const NODE_STATUS_LABEL = {
  ONLINE: "En línea",
  OFFLINE: "Fuera de línea",
  MAINTENANCE: "Mantenimiento",
} as const;

export default async function AdminNodesPage() {
  const nodes = await prisma.node.findMany({
    include: { _count: { select: { services: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="font-semibold">Nodos ({nodes.length})</h2>
        <p className="mt-1 text-sm text-slate-400">
          Capacidad disponible para el aprovisionamiento automático. La gestión
          real de contenedores se conectará en la siguiente fase.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {nodes.map((node) => (
            <div
              key={node.id}
              className="rounded-2xl border border-white/10 p-5"
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold">{node.name}</p>
                <span className="text-xs text-slate-400">
                  {NODE_STATUS_LABEL[node.status]}
                </span>
              </div>
              <p className="mt-1 font-mono text-xs text-slate-500">
                {node.hostname}
              </p>
              <p className="mt-3 text-sm text-slate-400">
                {node.region} · {node.cpuCores} vCPU · {formatRam(node.ramMb)} ·{" "}
                {formatDisk(node.diskMb)}
              </p>
              <p className="mt-2 text-sm text-emerald-300">
                {node._count.services} servicios asignados
              </p>
            </div>
          ))}
          {nodes.length === 0 && (
            <p className="text-sm text-slate-400">No hay nodos registrados.</p>
          )}
        </div>
      </div>
    </div>
  );
}
