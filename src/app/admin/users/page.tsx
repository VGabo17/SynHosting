import { prisma } from "@/lib/prisma";
import { UserRoleSelect } from "@/components/admin-controls";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    include: { _count: { select: { services: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <h2 className="font-semibold">Usuarios ({users.length})</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="pb-3">Nombre</th>
              <th className="pb-3">Email</th>
              <th className="pb-3">Servicios</th>
              <th className="pb-3">Alta</th>
              <th className="pb-3">Rol</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="py-3">{user.name ?? "—"}</td>
                <td className="py-3 text-slate-400">{user.email}</td>
                <td className="py-3 text-slate-400">{user._count.services}</td>
                <td className="py-3 text-slate-400">
                  {user.createdAt.toLocaleDateString("es-ES")}
                </td>
                <td className="py-3">
                  <UserRoleSelect userId={user.id} role={user.role} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
