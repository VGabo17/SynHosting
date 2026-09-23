import { z } from "zod";
import { ServiceType } from "@prisma/client";

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres"),
    email: z.string().trim().toLowerCase().email("Email no válido"),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email no válido"),
  password: z.string().min(1, "Introduce tu contraseña"),
});

export const minecraftConfigSchema = z.object({
  version: z.string().trim().min(1),
  serverType: z.enum(["VANILLA", "PAPER", "FORGE", "FABRIC"]),
});

export const discordBotConfigSchema = z.object({
  repoUrl: z.string().trim().url("Introduce una URL de repositorio válida"),
  runtime: z.enum(["NODE", "PYTHON", "JAVA"]),
  entrypoint: z.string().trim().min(1),
});

export const telegramBotConfigSchema = z.object({
  repoUrl: z.string().trim().url("Introduce una URL de repositorio válida"),
  runtime: z.enum(["NODE", "PYTHON", "JAVA"]),
  mode: z.enum(["POLLING", "WEBHOOK"]),
});

export const createServiceSchema = z.object({
  name: z.string().trim().min(3, "El nombre debe tener al menos 3 caracteres"),
  planId: z.string().min(1, "Selecciona un plan"),
  type: z.nativeEnum(ServiceType),
  config: z.record(z.string(), z.string()).default({}),
});

export const planSchema = z.object({
  name: z.string().trim().min(2),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]+$/, "Usa solo minúsculas, números y guiones"),
  type: z.nativeEnum(ServiceType),
  description: z.string().trim().min(5),
  priceCents: z.coerce.number().int().min(0),
  cpuCores: z.coerce.number().min(0.1),
  ramMb: z.coerce.number().int().min(128),
  diskMb: z.coerce.number().int().min(512),
  maxPlayers: z.coerce.number().int().min(0).optional(),
  features: z.string().optional(),
});
