# MVP Nails Platform

Monorepo con tres proyectos separados para el MVP del SaaS de salones de unas:

- `apps/web`: frontend web en Next.js listo para desplegarse como proyecto independiente en Vercel.
- `apps/api`: backend serverless en Next.js Route Handlers listo para desplegarse como proyecto independiente en Vercel.
- `apps/mobile`: app movil en React Native con Expo.
- `packages/core`: tipos y datos mock compartidos entre web, api y mobile.

## Stack

- Web: Next.js 15 + TypeScript + App Router
- API: Next.js 15 Route Handlers
- Mobile: React Native + Expo
- Shared: TypeScript

## Estructura

```text
apps/
  api/
  mobile/
  web/
packages/
  core/
```

## Arranque local

1. Instala dependencias en la raiz:

```bash
npm install
```

2. Ejecuta cada proyecto por separado:

```bash
npm run dev:web
npm run dev:api
npm run dev:mobile
```

## Despliegue en Vercel

Configura dos proyectos distintos en Vercel:

- Proyecto frontend con root directory `apps/web`
- Proyecto backend con root directory `apps/api`

Variables recomendadas:

- `NEXT_PUBLIC_API_URL` en `apps/web`
- `EXPO_PUBLIC_API_URL` en `apps/mobile` mediante Expo
- `ALLOWED_ORIGIN` en `apps/api` para permitir el frontend publicado

## Funcionalidades incluidas en esta base

- Landing del producto
- Dashboard de agenda
- Gestion de clientas
- Resumen de caja
- Pantalla publica de reservas
- Endpoints mock de bookings, clients, services y dashboard
- App movil con agenda del dia y tarjetas de clientas VIP

## Siguientes pasos

1. Conectar `packages/core` a una base de datos real como Supabase o Neon.
2. Sustituir mocks por Prisma/Drizzle.
3. Integrar autenticacion y recordatorios.
4. Publicar `apps/web` y `apps/api` como proyectos separados en Vercel.

## Nota sobre mobile

`apps/mobile` arranca con Expo y usa el paquete compartido `@nails/core`. En un monorepo de Expo conviene mantener `metro.config.js` para que el bundler resuelva correctamente los paquetes del workspace.
