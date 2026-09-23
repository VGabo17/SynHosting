# SynHosting

Plataforma de hosting para **servidores de Minecraft**, **bots de Discord** y **bots de Telegram**:
landing pública, autenticación, panel de cliente y panel de administración.

## Stack

| Capa | Tecnología |
| --- | --- |
| Frontend / backend | Next.js 15 (App Router, Server Actions) + TypeScript |
| Estilos | Tailwind CSS v4 |
| Base de datos | PostgreSQL + Prisma |
| Autenticación | Auth.js (next-auth v5, credenciales + JWT) |
| Cache / colas | Redis (opcional en desarrollo) |
| Despliegue | Docker / docker compose |

## Arranque rápido

```bash
cp .env.example .env            # ajusta DATABASE_URL y AUTH_SECRET
docker compose up -d db redis   # o usa tu propio Postgres/Redis
npm install
npm run db:migrate              # crea el esquema
npm run db:seed                 # planes, nodos y usuario admin de ejemplo
npm run dev
```

La app queda en `http://localhost:3000`.

Credenciales del seed (configurables con `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`):

- Email: `admin@synhosting.net`
- Contraseña: `admin12345`

## Estructura

```
prisma/
  schema.prisma          Usuarios, planes, servicios, nodos y eventos
  seed.ts                Datos de ejemplo
src/
  auth.ts                Auth.js con proveedor de credenciales
  auth.config.ts         Configuración edge-safe usada por el middleware
  middleware.ts          Protege /dashboard y /admin (y el rol ADMIN)
  app/
    page.tsx             Landing pública con planes desde la base de datos
    (auth)/              Login y registro
    dashboard/           Panel de cliente
      [type]/            Vistas por tipo: /dashboard/minecraft|discord|telegram
      new/               Alta de servicio (tipo → plan → configuración)
      services/[id]/     Detalle, acciones de encendido y actividad
    admin/               Panel de administración (usuarios, planes, servicios, nodos)
    actions/             Server Actions de auth, servicios y administración
  lib/
    prisma.ts            Cliente Prisma
    redis.ts             Conexión Redis opcional
    provisioning.ts      Contrato del orquestador + driver simulado
    services.ts          Metadatos y formateadores por tipo de servicio
    validation.ts        Esquemas Zod
```

## Roles

- `USER`: gestiona sus propios servicios desde `/dashboard`.
- `ADMIN`: además accede a `/admin` para usuarios, planes, servicios y nodos.

## Integración con infraestructura real

`src/lib/provisioning.ts` define la interfaz `Provisioner` (`provision`, `start`,
`stop`, `destroy`). El MVP usa un driver simulado que elige el nodo con menos
carga y asigna puerto. Para conectar Docker, Pterodactyl o Nomad basta con
implementar la misma interfaz y exportarla como `provisioner`; el resto de la
aplicación no cambia.

## Comandos

```bash
npm run dev         # desarrollo
npm run build       # build de producción (standalone)
npm run lint        # ESLint
npm run typecheck   # TypeScript
npm run db:migrate  # migraciones en desarrollo
npm run db:deploy   # migraciones en producción
npm run db:seed     # datos de ejemplo
```

## Docker

```bash
docker compose up --build
```

Levanta Postgres, Redis y la app (`output: "standalone"`). Aplica las
migraciones con `docker compose exec web npx prisma migrate deploy`.
