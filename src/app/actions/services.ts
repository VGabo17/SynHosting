"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ServiceStatus, ServiceType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { provisioner } from "@/lib/provisioning";
import { requireUser } from "@/lib/session";
import {
  createServiceSchema,
  discordBotConfigSchema,
  minecraftConfigSchema,
  telegramBotConfigSchema,
} from "@/lib/validation";
import { SERVICE_TYPE_META } from "@/lib/services";

export type ServiceFormState = { error?: string } | undefined;

function parseConfig(type: ServiceType, formData: FormData) {
  if (type === ServiceType.MINECRAFT) {
    return minecraftConfigSchema.safeParse({
      version: formData.get("version"),
      serverType: formData.get("serverType"),
    });
  }
  if (type === ServiceType.DISCORD_BOT) {
    return discordBotConfigSchema.safeParse({
      repoUrl: formData.get("repoUrl"),
      runtime: formData.get("runtime"),
      entrypoint: formData.get("entrypoint"),
    });
  }
  return telegramBotConfigSchema.safeParse({
    repoUrl: formData.get("repoUrl"),
    runtime: formData.get("runtime"),
    mode: formData.get("mode"),
  });
}

export async function createServiceAction(
  _prev: ServiceFormState,
  formData: FormData,
): Promise<ServiceFormState> {
  const user = await requireUser();

  const parsed = createServiceSchema.omit({ config: true }).safeParse({
    name: formData.get("name"),
    planId: formData.get("planId"),
    type: formData.get("type"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const config = parseConfig(parsed.data.type, formData);
  if (!config.success) {
    return { error: config.error.issues[0].message };
  }

  const plan = await prisma.plan.findFirst({
    where: { id: parsed.data.planId, type: parsed.data.type, isActive: true },
  });
  if (!plan) {
    return { error: "El plan seleccionado no está disponible" };
  }

  const service = await prisma.service.create({
    data: {
      name: parsed.data.name,
      type: parsed.data.type,
      userId: user.id,
      planId: plan.id,
      config: config.data,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  const result = await provisioner.provision(service);
  await prisma.service.update({
    where: { id: service.id },
    data: {
      ...result,
      events: {
        create: {
          message: `Servicio ${SERVICE_TYPE_META[service.type].label} creado con el plan ${plan.name}`,
          actor: user.email ?? undefined,
        },
      },
    },
  });

  revalidatePath("/dashboard");
  redirect(`/dashboard/services/${service.id}`);
}

async function ownedService(serviceId: string) {
  const user = await requireUser();
  const service = await prisma.service.findFirst({
    where:
      user.role === "ADMIN"
        ? { id: serviceId }
        : { id: serviceId, userId: user.id },
  });
  return { user, service };
}

export async function setServicePowerAction(
  serviceId: string,
  action: "start" | "stop",
) {
  const { user, service } = await ownedService(serviceId);
  if (!service) return;

  const status =
    action === "start"
      ? await provisioner.start(service)
      : await provisioner.stop(service);

  await prisma.service.update({
    where: { id: service.id },
    data: {
      status,
      events: {
        create: {
          message: action === "start" ? "Servicio iniciado" : "Servicio detenido",
          actor: user.email ?? undefined,
        },
      },
    },
  });

  revalidatePath(`/dashboard/services/${serviceId}`);
  revalidatePath("/dashboard");
}

export async function deleteServiceAction(serviceId: string) {
  const { service } = await ownedService(serviceId);
  if (!service) return;

  await provisioner.destroy(service);
  await prisma.service.update({
    where: { id: service.id },
    data: { status: ServiceStatus.DELETED, containerId: null },
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
