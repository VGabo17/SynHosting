"use server";

import { revalidatePath } from "next/cache";
import { Role, ServiceStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { planSchema } from "@/lib/validation";

export type AdminFormState = { error?: string; success?: string } | undefined;

export async function upsertPlanAction(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin();

  const parsed = planSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    type: formData.get("type"),
    tier: formData.get("tier") ?? undefined,
    description: formData.get("description"),
    priceCents: formData.get("priceCents"),
    cpuCores: formData.get("cpuCores"),
    ramMb: formData.get("ramMb"),
    diskMb: formData.get("diskMb"),
    maxPlayers: formData.get("maxPlayers") || undefined,
    features: formData.get("features"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { features: featuresInput, ...plan } = parsed.data;
  const features = (featuresInput ?? "")
    .split(",")
    .map((feature) => feature.trim())
    .filter(Boolean);

  await prisma.plan.upsert({
    where: { slug: plan.slug },
    create: { ...plan, features },
    update: { ...plan, features },
  });

  revalidatePath("/admin/plans");
  revalidatePath("/");
  return { success: `Plan "${plan.name}" guardado` };
}

export async function togglePlanAction(planId: string, isActive: boolean) {
  await requireAdmin();
  await prisma.plan.update({ where: { id: planId }, data: { isActive } });
  revalidatePath("/admin/plans");
  revalidatePath("/");
}

export async function setUserRoleAction(userId: string, role: Role) {
  await requireAdmin();
  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/users");
}

export async function setServiceStatusAction(
  serviceId: string,
  status: ServiceStatus,
) {
  const admin = await requireAdmin();
  await prisma.service.update({
    where: { id: serviceId },
    data: {
      status,
      events: {
        create: {
          message: `Estado cambiado a ${status} por un administrador`,
          actor: admin.email ?? undefined,
        },
      },
    },
  });
  revalidatePath("/admin/services");
}
